import * as moment from 'moment';
import * as accounting from 'accounting';
import { parseHtmlString, productQuantityHelper } from '../helpers';
import { decode as htmlDecode } from 'html-entities';
import { OrderData, RawProduct, IEmailPayload } from '../../models';

export default class Aerie {
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
        'html > body > table >tbody > tr> td >table > tbody >tr>td:nth-child(2) >table >tbody> tr:nth-child(2) >td >font >pre'
      );

      const orderRef = orderRefElement ? orderRefElement.textContent.split('RESP')[1].split('       ')[1].trim() : null;
      return `${orderRef}`;
    } catch (error) {
      /* istanbul ignore next */
      return null;
    }
  }

  static async getOrderDate(root: Document): Promise<number | null> {
    try {
      const body = root.querySelector('pre').textContent.split('__________________________________________');

      const orderDate = body[1].split('  ')[0].trim();

      return !!orderDate ? moment(orderDate, 'MM/DD/YYYY').startOf('day').valueOf() : /* istanbul ignore next */ null;
    } catch (error) {
      /* istanbul ignore next */
      return null;
    }
  }
  static async getProducts(root: Document): Promise<RawProduct[]> {
    let products = [];
    try {
      const body = root.querySelector('pre').textContent.split('__________________________________________');

      const salesSection = body[2].split('Subtotal')[0];
      const productRows = salesSection
        .split('AERIE')
        .map((row) => {
          return row
            .split('\r\n')
            .map((col) => col.trim())
            .filter((col) => !!col.length);
        })
        .filter((row) => row.length > 0);

      let p = productRows.filter((row) => row[0].split(' ').length > 1);
      for (let i = 0; i < p.length; i++) {
        const product = p[i][0]
          .split('  ')
          .map((x) => x.trim())
          .filter((x) => !!x.length); // Get first element

        const productName = `${product[0]}`;

        const quantity = product[4].split('@')[0]
          ? parseInt(product[4].split('@')[0], 10)
          : /* istanbul ignore next */ 1;

        const productPrice = product[1] ? accounting.unformat(product[1]) : /* istanbul ignore next */ 0;

        products = products.concat(
          productQuantityHelper({
            name: productName,
            price: productPrice,
            thumbnail: '',
            quantity
          })
        );
      }

      return products;
    } catch (error) {
      return [];
    }
  }
}
