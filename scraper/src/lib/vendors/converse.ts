import * as moment from 'moment';
import * as accounting from 'accounting';
import { parseHtmlString, productQuantityHelper } from '../helpers';
import { decode as htmlDecode } from 'html-entities';
import { OrderData, RawProduct, IEmailPayload } from '../../models';

export default class Converse {
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
        'html > body > table:nth-child(3) > tbody > tr:nth-child(1) > td > table:nth-child(2) > tbody > tr > td > table > tbody > tr > td > table:nth-child(1) > tbody > tr > td > table > tbody > tr > td > table > tbody > tr:nth-child(7) > td > strong'
      );
      const orderRef = orderRefElement ? orderRefElement.textContent.split('#').pop() : null;
      return `${orderRef}`;
    } catch (error) {
      /* istanbul ignore next */
      return null;
    }
  }

  static async getOrderDate(root: Document): Promise<number | null> {
    try {
      const orderDateElement = root.querySelector(
        'html > body > table:nth-child(3) > tbody > tr:nth-child(1) > td > table:nth-child(2) > tbody > tr > td > table > tbody > tr > td > table:nth-child(1) > tbody > tr > td > table > tbody > tr > td > table > tbody > tr:nth-child(8) > td'
      );

      const orderDate = orderDateElement ? orderDateElement.textContent.split('Ordered on ').pop() : null;
      return orderDate ? moment(orderDate, 'MMMM DD, YYYY').startOf('day').valueOf() : null;
    } catch (error) {
      /* istanbul ignore next */
      return null;
    }
  }
  static async getProducts(root: Document): Promise<RawProduct[]> {
    let products = [];
    try {
      const productRowElement = root.querySelector(
        'html > body > table:nth-child(3) > tbody > tr:nth-child(1) > td > table:nth-child(2) > tbody > tr > td > table > tbody > tr > td > table:nth-child(2) > tbody > tr > td > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr'
      );
      const productNameElement = productRowElement.querySelector(
        'td:nth-child(2) > table > tbody > tr:nth-child(1) > td'
      );
      const productName = productNameElement.textContent.trim() || /* istanbul ignore next */ '';

      const productQuantityElement = productRowElement.querySelector(
        'td:nth-child(2) > table > tbody > tr:nth-child(5) > td > span> strong'
      );

      /* istanbul ignore next */
      const productQuantity = productQuantityElement.innerHTML.trim();
      const quantity = productQuantity ? parseInt(productQuantity, 10) : /* istanbul ignore next */ 1;

      const productThumbnailElement = productRowElement.querySelector(
        'td:nth-child(1) > table > tbody > tr > td > a > img'
      );
      const productThumbnail = productThumbnailElement
        ? productThumbnailElement.getAttribute('src')
        : /* istanbul ignore next */ '';

      const productPriceElement = productRowElement.querySelector('td:nth-child(3) > table > tbody > tr > td');
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

      return products;
    } catch (error) {
      /* istanbul ignore next */
      return [];
    }
  }
}
