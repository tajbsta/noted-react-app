import * as moment from 'moment';
import * as accounting from 'accounting';
import { parseHtmlString, productQuantityHelper } from '../helpers';
import { decode as htmlDecode } from 'html-entities';
import { OrderData, RawProduct, IEmailPayload } from '../../models';

export default class AmericanEagleOutfitters {
  static async parse(code: string, payload: IEmailPayload): Promise<OrderData> {
    const doc = parseHtmlString(payload.decodedBody);
    const [orderRef, orderDate, rawProducts] = await Promise.all([
      this.getOrderRef(doc),
      this.getOrderDate(doc),
      this.getProducts(doc)
    ]);

    if (!orderRef || !orderDate || rawProducts.length === 0 || rawProducts.find((x) => !x.name || !x.price)) {
      throw new Error(`Lacking info parsed from the email: ${JSON.stringify({ orderRef, orderDate, rawProducts })}`);
    }

    return {
      vendor: code,
      emailId: payload.id,
      orderRef,
      orderDate,
      products: rawProducts
    };
  }

  static async getOrderRef(root: Document): Promise<string | null> {
    try {
      const orderRefElement = root.querySelector(
        'html > body > div:nth-child(3) > table:nth-child(2) > tbody > tr > td > table > tbody > tr:nth-child(8) > td > table > tbody > tr > td:nth-child(1) > a'
      );
      const orderRef = orderRefElement ? orderRefElement.textContent.trim().split('#').pop() : null;
      return `${orderRef}`;
    } catch (error) {
      /* istanbul ignore next */
      return null;
    }
  }

  static async getOrderDate(root: Document): Promise<number | null> {
    try {
      const orderDateElement = root.querySelector(
        'html > body > div:nth-child(3) > table:nth-child(2) > tbody > tr > td > table > tbody > tr:nth-child(8) > td > table > tbody > tr > td:nth-child(2)'
      );
      const orderDate = orderDateElement ? orderDateElement.textContent.trim().split(': ').pop() : null;
      return orderDate ? moment(orderDate, 'MMMM DD, YYYY').startOf('day').valueOf() : null;
    } catch (error) {
      /* istanbul ignore next */
      return null;
    }
  }

  static async getProducts(root: Document): Promise<RawProduct[]> {
    try {
      const initialContainer = root.querySelector('html > body > div:nth-child(3) > table:nth-child(4) > tbody');

      const orderTableContainer = [];

      initialContainer.querySelectorAll('tr').forEach((item) => {
        const hasThumbnail = item
          .querySelector('td > table > tbody > tr > td:nth-child(2) > a > img')
          ?.getAttribute('src');
        const hasPrice = /* istanbul ignore next */ accounting.unformat(
          item
            ?.querySelector(
              'td > table > tbody > tr > td:nth-child(4) > table > tbody > tr:nth-child(3) > td > span:nth-child(2)'
            )
            ?.textContent.replace(' USD', '')
        );

        const isProduct = !!hasThumbnail && hasPrice && item.childNodes.length === 3;
        if (isProduct) {
          orderTableContainer.push(item);
        }
      });

      let products = [];

      orderTableContainer.forEach((item) => {
        const productRowElement = item;
        const productNameElement = productRowElement.querySelector(
          'td > table > tbody > tr > td:nth-child(4) > table > tbody > tr:nth-child(1) > td > a'
        );
        const productName = productNameElement.textContent.trim() || /* istanbul ignore next */ '';

        const productQuantityElement = productRowElement.querySelector(
          'td > table > tbody > tr > td:nth-child(4) > table > tbody > tr:nth-child(5) > td'
        );

        const productQuantity = productQuantityElement.innerHTML.split('<br>').pop()?.trim().split(' ').pop();

        const quantity = productQuantity ? parseInt(productQuantity, 10) : /* istanbul ignore next */ 1;

        const productThumbnailElement = productRowElement.querySelector(
          'td > table > tbody > tr > td:nth-child(2) > a > img'
        );
        const productThumbnail = productThumbnailElement
          ? productThumbnailElement.getAttribute('src')
          : /* istanbul ignore next */ '';

        const productPriceElement = productRowElement.querySelector(
          'td > table > tbody > tr > td:nth-child(4) > table > tbody > tr:nth-child(3) > td > span:nth-child(2)'
        );
        const price = /* istanbul ignore next */ productPriceElement.textContent
          .split('USD')
          .shift()
          .split('$')
          .pop()
          .trim();

        const productPrice = productPriceElement ? accounting.unformat(price) : /* istanbul ignore next */ 0;
        products = products.concat(
          productQuantityHelper({
            name: productName,
            price: productPrice,
            thumbnail: productThumbnail,
            quantity
          })
        );
      });

      return products;
    } catch (error) {
      return [];
    }
  }
}
