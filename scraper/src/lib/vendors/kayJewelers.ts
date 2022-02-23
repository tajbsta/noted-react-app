import * as moment from 'moment';
import * as accounting from 'accounting';
import { parseHtmlString, productQuantityHelper } from '../helpers';
import { decode as htmlDecode } from 'html-entities';
import { OrderData, RawProduct, IEmailPayload } from '../../models';

export default class KayJewelers {
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
        'body > table:nth-child(4) > tbody > tr > td > table > tbody > tr > td > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(5) > td > p.sanseriffonts > font:nth-child(2) > a'
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
        'body > table:nth-child(4) > tbody > tr > td > table > tbody > tr > td > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(5) > td > p.sanseriffonts > font:nth-child(3)'
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
        'body > table:nth-child(10) > tbody > tr > td > table > tbody > tr > td > table > tbody'
      );

      const orderTableContainer = [];

      initialContainer.querySelectorAll('tr').forEach((item: any) => {
        const hasThumbnail = item.querySelector('td:nth-child(1) > table > tbody > tr > td > div > img');
        const isProduct = !!hasThumbnail && item.childNodes.length === 3 && item.childNodes[2].length === 10;

        if (isProduct) {
          orderTableContainer.push(item);
        }
      });

      let products = [];

      orderTableContainer.forEach((item) => {
        const productRowElement = item;

        const productNameElement = productRowElement.querySelector(
          'td > table > tbody > tr > td > table:nth-of-type(2) > tbody > tr:nth-child(4) > td:nth-child(1) > p'
        );
        const productName = productNameElement.textContent.trim() || /* istanbul ignore next */ '';

        const productQuantityElement = productRowElement.querySelector(
          'td > table > tbody > tr > td > table:nth-of-type(2) > tbody > tr:nth-child(4) > td:nth-child(2) > p:nth-child(1)'
        );
        const productQuantity = productQuantityElement.textContent.replace('Quantity:', '').trim();
        const quantity = productQuantity ? parseInt(productQuantity, 10) : /* istanbul ignore next */ 1;

        const productThumbnail = '';

        const productPriceElement = productRowElement.querySelector(
          'td > table > tbody > tr > td > table:nth-of-type(2) > tbody > tr:nth-child(4) > td:nth-child(2) > p:nth-child(2)'
        );
        const price = /* istanbul ignore next */ productPriceElement.textContent
          .replace('Price:', '')
          .replace('$', '')
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
      /* istanbul ignore next */
      return [];
    }
  }
}
