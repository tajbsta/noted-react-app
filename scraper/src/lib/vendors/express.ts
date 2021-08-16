import * as moment from 'moment';
import * as accounting from 'accounting';
import { parseHtmlString, productQuantityHelper } from '../helpers';
import { decode as htmlDecode } from 'html-entities';
import { OrderData, RawProduct, IEmailPayload } from '../../models';

export default class Express {
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
        'html > body > table > tbody > tr > td > table:nth-child(3) > tbody > tr > td:nth-child(2) > table:nth-child(3) > tbody > tr > td > font'
      );
      const orderRef = orderRefElement
        ? /* istanbul ignore next */ orderRefElement.textContent
            .trim()
            .split('confirmation # is')
            .pop()
            ?.split('Tracking')
            .shift()
            ?.trim()
        : /* istanbul ignore next */ null;
      return `${orderRef}`;
    } catch (error) {
      /* istanbul ignore next */
      return null;
    }
  }

  static async getOrderDate(root: Document): Promise<number | null> {
    try {
      const orderDateElement = root.querySelector(
        'html > body > table > tbody > tr > td > table:nth-child(3) > tbody > tr > td:nth-child(2) > table:nth-child(3) > tbody > tr > td > table > tbody > tr > td:nth-child(2) > font'
      );
      const orderDate = orderDateElement
        ? /* istanbul ignore next */ orderDateElement.textContent.trim().split('Today:').pop()?.replace('EDT', '')
        : /* istanbul ignore next */ null;
      return orderDate ? moment(orderDate, 'MM/DD/YY hh:mm').startOf('day').valueOf() : /* istanbul ignore next */ null;
    } catch (error) {
      /* istanbul ignore next */
      return null;
    }
  }
  static async getProducts(root: Document): Promise<RawProduct[]> {
    try {
      const initialContainer = root.querySelector(
        'html > body > table > tbody > tr > td > table:nth-child(3) > tbody > tr > td:nth-child(2) > table:nth-child(5) > tbody > tr > td > font'
      );

      const orderTableContainer = [];

      initialContainer.querySelectorAll('table').forEach((item) => {
        let hasProductName = null;
        /* istanbul ignore next */
        if (item) {
          hasProductName = item.querySelector('tbody > tr > td:nth-child(1) > font');
        }

        const isProduct = !!hasProductName;
        if (isProduct) {
          orderTableContainer.push(item);
        }
      });

      let products = [];

      orderTableContainer.forEach((item) => {
        const productRowElement = item;
        const productNameElement = productRowElement.querySelector('tbody > tr > td:nth-child(1) > font');
        const productName = productNameElement.textContent.trim() || /* istanbul ignore next */ '';

        const productQuantityElement = productRowElement.querySelector('tbody > tr > td:nth-child(3) > font');

        /* istanbul ignore next */
        const productQuantity = productQuantityElement.innerHTML.trim();
        const quantity = productQuantity ? parseInt(productQuantity, 10) : /* istanbul ignore next */ 1;

        const productThumbnail = '';

        const productPriceElement = productRowElement.querySelector('tbody > tr > td:nth-child(5) > font');
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
