import * as moment from 'moment';
import * as accounting from 'accounting';
import { parseHtmlString, productQuantityHelper } from '../helpers';
import { decode as htmlDecode } from 'html-entities';
import { OrderData, RawProduct, IEmailPayload } from '../../models';

export default class Walmart {
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
        'html > body > table:nth-child(6) > tbody > tr:nth-child(2) > td > p > span:nth-child(8) > span'
      );
      const orderRef = orderRefElement ? orderRefElement.textContent.trim() : null;
      return `${orderRef}`;
    } catch (error) {
      /* istanbul ignore next */
      return null;
    }
  }

  /* istanbul ignore next */
  static async getOrderDate(root: Document): Promise<number | null> {
    try {
      const orderDateElement = root.querySelector(
        'html > body > table:nth-child(6) > tbody > tr:nth-child(2) > td > p > span:nth-child(9) > span'
      );
      const orderDate = orderDateElement ? orderDateElement.textContent.trim().split(',').slice(1).join().trim() : null;
      return orderDate ? moment(orderDate, 'MMM DD, YYYY').startOf('day').valueOf() : null;
    } catch (error) {
      /* istanbul ignore next */
      return null;
    }
  }

  static async getProducts(root: Document): Promise<RawProduct[]> {
    try {
      const initialContainer = root.querySelector('html > body');

      const orderTableContainer = [];

      initialContainer.querySelectorAll('table').forEach((item) => {
        let hasProductName = null;
        /* istanbul ignore next */
        if (item) {
          hasProductName = item.querySelector(
            'tbody > tr > td > table:nth-child(3) > tbody > tr > td:nth-child(1) > a > span'
          );
        }

        const hasPrice = item
          .querySelector('tbody > tr > td > table:nth-child(3) > tbody > tr > td:nth-child(2) > span')
          ?.textContent?.trim()
          .split('')
          .includes('$');

        const isProduct = !!hasProductName && hasPrice && item.childNodes.length === 7;
        if (isProduct) {
          orderTableContainer.push(item);
        }
      });

      let products = [];

      orderTableContainer.forEach((item) => {
        const productRowElement = item;
        const productNameElement = productRowElement.querySelector(
          'tbody > tr > td > table:nth-child(3) > tbody > tr > td:nth-child(1) > a > span'
        );
        const productName = productNameElement.textContent.trim() || /* istanbul ignore next */ '';

        const productQuantityElement = productRowElement.querySelector(
          'tbody > tr > td > table:nth-child(3) > tbody > tr > td:nth-child(1) > span:nth-child(3)'
        );

        const productQuantity = productQuantityElement.textContent.split(':').pop().trim();

        const quantity = productQuantity ? parseInt(productQuantity, 10) : /* istanbul ignore next */ 1;

        const productThumbnail = '';

        const productPriceElement = productRowElement.querySelector(
          'tbody > tr > td > table:nth-child(3) > tbody > tr > td:nth-child(2) > span'
        );
        const price = /* istanbul ignore next */ productPriceElement.innerHTML.trim();
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
      /* istanbul ignore next */
      return [];
    }
  }
}
