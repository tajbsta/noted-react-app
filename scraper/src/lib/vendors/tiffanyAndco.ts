import * as moment from 'moment';
import * as accounting from 'accounting';
import { parseHtmlString, productQuantityHelper } from '../helpers';
import { decode as htmlDecode } from 'html-entities';
import { OrderData, RawProduct, IEmailPayload } from '../../models';

export default class TiffanyAndCo {
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
        'body > div > table > tbody > tr > td > table:nth-child(2) > tbody > tr > td > table > tbody > tr:nth-child(3) > td > table > tbody > tr > td > table > tbody > tr > td > h3'
      );
      const orderRef = orderRefElement
        ? orderRefElement.childNodes[3].textContent.replace('Order #:', '').trim()
        : null;
      return `${orderRef}`;
    } catch (error) {
      /* istanbul ignore next */
      return null;
    }
  }

  static async getOrderDate(root: Document): Promise<number | null> {
    try {
      const orderRefElement = root.querySelector(
        'body > div > table > tbody > tr > td > table:nth-child(2) > tbody > tr > td > table > tbody > tr:nth-child(3) > td > table > tbody > tr > td > table > tbody > tr > td > h3'
      );
      const orderDate = orderRefElement
        ? orderRefElement.childNodes[5].textContent.replace('Order Date:', '').trim()
        : null;

      return orderDate ? moment(orderDate, 'DD-MMM-YYYY').startOf('day').valueOf() : null;
    } catch (error) {
      /* istanbul ignore next */
      return null;
    }
  }

  static async getProducts(root: Document): Promise<RawProduct[]> {
    try {
      const initialContainer = root.querySelector(
        'body > div > table > tbody > tr > td > table:nth-child(2) > tbody > tr > td > table > tbody'
      );

      const orderTableContainer = [];

      initialContainer.querySelectorAll('tr').forEach((item: any) => {
        const hasTumbnail = item.querySelector(
          'td > table:nth-child(1) > tbody > tr > td > table > tbody > tr > td > img'
        );
        const isProduct = !!hasTumbnail && item.children.length === 1 && item.childNodes[2].length === 45;

        if (isProduct) {
          orderTableContainer.push(item);
        }
      });

      let products = [];

      orderTableContainer.forEach((item) => {
        const productRowElement = item;

        const productNameElement = productRowElement.querySelector(
          'td > table:nth-child(2) > tbody > tr > td > table > tbody > tr:nth-child(1) > td > p'
        );
        const productName = productNameElement.textContent.trim() || /* istanbul ignore next */ '';

        const productQuantityElement = productRowElement.querySelector(
          'td > table:nth-child(2) > tbody > tr > td > table > tbody > tr:nth-child(4) > td > table > tbody > tr:nth-child(1) > td'
        );
        const productQuantity = productQuantityElement.textContent.replace('Quantity :', '').trim();
        const quantity = productQuantity ? parseInt(productQuantity, 10) : /* istanbul ignore next */ 1;

        const productThumbnailElement = productRowElement.querySelector(
          'td > table:nth-child(1) > tbody > tr > td > table > tbody > tr > td > img'
        );
        const productThumbnail = productThumbnailElement
          ? productThumbnailElement.getAttribute('src')
          : /* istanbul ignore next */ '';

        const productPriceElement = productRowElement.nextElementSibling.querySelector(
          'td > table > tbody > tr > td > table > tbody > tr > td:nth-child(2) > h3'
        );
        const price = /* istanbul ignore next */ productPriceElement.textContent.replace('$', '').trim();
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
