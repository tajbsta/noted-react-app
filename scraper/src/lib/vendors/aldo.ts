import * as moment from 'moment';
import * as accounting from 'accounting';
import { parseHtmlString, productQuantityHelper } from '../helpers';
import { decode as htmlDecode } from 'html-entities';
import { OrderData, RawProduct, IEmailPayload } from '../../models';

export default class Aldo {
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
        'html > body > table:nth-child(6) > tbody > tr > td:nth-child(2) > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr > td > table:nth-child(2) > tbody > tr > td:nth-child(1) > p:nth-child(2)'
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
        'html > body > table:nth-child(6) > tbody > tr > td:nth-child(2) > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr > td > table:nth-child(2) > tbody > tr > td:nth-child(2) > p:nth-child(2)'
      );
      const orderDate = orderDateElement ? orderDateElement.textContent.trim() : null;
      return orderDate ? moment(orderDate, 'YYYY-MM-DD').startOf('day').valueOf() : null;
    } catch (error) {
      /* istanbul ignore next */
      return null;
    }
  }

  static async getProducts(root: Document): Promise<RawProduct[]> {
    try {
      let products = [];

      const productRowElement = root.querySelector(
        'html > body > table:nth-child(7) > tbody > tr > td:nth-child(2) > table > tbody > tr > td > table > tbody > tr > td > table:nth-child(2) > tbody > tr'
      );

      const productNameElement = productRowElement.querySelector(
        'td:nth-child(2) > table > tbody > tr > td:nth-child(1) > p:nth-child(1)'
      );

      const productName = productNameElement.textContent.trim() || /* istanbul ignore next */ '';

      const productQuantityElement = productRowElement.querySelector(
        'td:nth-child(2) > table > tbody > tr > td:nth-child(1) > p:nth-child(2)'
      );

      const productQuantity = productQuantityElement.textContent.split(' ').pop();

      const quantity = productQuantity ? parseInt(productQuantity, 10) : /* istanbul ignore next */ 1;

      const productThumbnailElement = productRowElement.querySelector(
        'tbody > tr > td:nth-child(1) > table > tbody > tr > td > a > img'
      );
      const productThumbnail = productThumbnailElement
        ? productThumbnailElement.getAttribute('src')
        : /* istanbul ignore next */ '';

      const productPriceElement = productRowElement.querySelector(
        'tbody > tr > td:nth-child(2) > table > tbody > tr > td:nth-child(2) > p > span'
      );

      const price = productPriceElement.innerHTML.trim() || /* istanbul ignore next */ '';
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
