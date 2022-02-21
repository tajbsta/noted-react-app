import * as moment from 'moment';
import * as accounting from 'accounting';
import { parseHtmlString, productQuantityHelper } from '../helpers';
import { decode as htmlDecode } from 'html-entities';
import { OrderData, RawProduct, IEmailPayload } from '../../models';

export default class JosABank {
  static async parse(code: string, payload: IEmailPayload): Promise<OrderData> {
    const doc = parseHtmlString(payload.decodedBody);
    const [orderRef, orderDate, rawProducts] = await Promise.all([
      this.getOrderRef(doc),
      this.getOrderDate(doc),
      this.getProducts(doc)
    ]);

    if (!orderRef || !orderDate || rawProducts.length === 0 || rawProducts.find((x) => !x.name)) {
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
        'body > table:nth-child(2) > tbody > tr > td > table:nth-child(1) > tbody > tr > td > table > tbody > tr:nth-child(5) > td > table:nth-child(2) > tbody > tr:nth-child(2) > td:nth-child(1) > div > div:nth-child(1) > a'
      );
      const orderRef = orderRefElement ? orderRefElement.textContent.trim() : null;

      return `${orderRef}`;
    } catch (error) {
      /* istanbul ignore next */
      return null;
    }
  }

  static async getOrderDate(root: Document): Promise<number | null> {
    try {
      const orderDateElement = root.querySelector(
        'body > table:nth-child(2) > tbody > tr > td > table:nth-child(1) > tbody > tr > td > table > tbody > tr:nth-child(5) > td > table:nth-child(2) > tbody > tr:nth-child(2) > td:nth-child(1) > div > div:nth-child(2) > span:nth-child(2)'
      );

      const orderDate = orderDateElement ? orderDateElement.textContent.trim() : null;

      return orderDate ? moment(orderDate, 'MMM DD, YYYY').startOf('day').valueOf() : null;
    } catch (error) {
      /* istanbul ignore next */
      return null;
    }
  }

  static async getProducts(root: Document): Promise<RawProduct[]> {
    try {
      const initialContainer = root.querySelector(
        'body > table:nth-child(2) > tbody > tr > td > table:nth-child(1) > tbody > tr > td > table > tbody > tr:nth-child(6) > td:nth-child(1) > table > tbody'
      );

      const orderTableContainer = [];

      initialContainer.querySelectorAll('tr').forEach((item: any) => {
        const hasQty = !isNaN(item.querySelector('td:nth-child(1) > div')?.textContent.trim());
        const isProduct = !!hasQty && item.children.length === 2 && item.childNodes.length === 3;

        if (isProduct) {
          orderTableContainer.push(item);
        }
      });

      let products = [];

      orderTableContainer.forEach((item) => {
        const productRowElement = item;

        const productNameElement = productRowElement.querySelector(
          'td:nth-child(1) > table > tbody > tr > td:nth-child(2) > div:nth-child(1)'
        );
        const productName =
          productNameElement.textContent.replace(/\n|\r/g, '').replace('Item Code:', '').trim() ||
          /* istanbul ignore next */ '';

        const productQuantityElement = productRowElement.querySelector(
          'td:nth-child(1) > table > tbody > tr > td:nth-child(1) > div'
        );
        const productQuantity = productQuantityElement.textContent.trim();
        const quantity = productQuantity ? parseInt(productQuantity, 10) : /* istanbul ignore next */ 1;

        const productThumbnail = '';

        const productPrice = 0;

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
