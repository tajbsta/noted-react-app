import * as moment from 'moment';
import * as accounting from 'accounting';
import { parseHtmlString, productQuantityHelper } from '../helpers';
import { decode as htmlDecode } from 'html-entities';
import { OrderData, RawProduct, IEmailPayload } from '../../models';

export default class Abercrombie {
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
        'html > body > table:nth-child(1) > tbody > tr > td > table > tbody > tr > td > table:nth-child(7) > tbody > tr > td > span:nth-child(3)'
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
        'html > body > table:nth-child(1) > tbody > tr > td > table > tbody > tr > td > table:nth-child(7) > tbody > tr > td > span:nth-child(8)'
      );

      const orderDate = orderDateElement ? orderDateElement.textContent.trim() : null;

      return orderDate ? moment(orderDate, 'MM/DD/YYYY').startOf('day').valueOf() : null;
    } catch (error) {
      /* istanbul ignore next */
      return null;
    }
  }
  static async getProducts(root: Document): Promise<RawProduct[]> {
    let products = [];
    try {
      const productNameElement = root.querySelector(
        'body > table:nth-child(1) > tbody > tr > td > table > tbody > tr > td > table:nth-child(19) > tbody> tr > td:nth-child(4) > div:nth-child(2) > b'
      );
      const productName = productNameElement.textContent.trim() || /* istanbul ignore next */ '';

      const productQuantityElement = root.querySelector(
        'body > table:nth-child(1) > tbody > tr > td > table > tbody > tr > td > table:nth-child(19) > tbody > tr > td:nth-child(4) > div:nth-child(2) > span'
      );

      const productQuantity = productQuantityElement.innerHTML.trim().split(' ').pop();

      const quantity = productQuantity ? parseInt(productQuantity, 10) : /* istanbul ignore next */ 1;

      const productThumbnailElement = root.querySelector(
        'body > table:nth-child(1) > tbody > tr > td > table > tbody > tr > td > table:nth-child(19) > tbody > tr > td:nth-child(2) > img'
      );

      const productThumbnail = productThumbnailElement
        ? productThumbnailElement.getAttribute('src')
        : /* istanbul ignore next */ '';

      const productPriceElement = root.querySelector(
        'body > table:nth-child(1) > tbody > tr > td > table > tbody > tr > td > table:nth-child(19) > tbody > tr > td:nth-child(4) > div:nth-child(2) > span'
      );

      const price =
        productPriceElement.innerHTML.split('<br>')[4].trim().split(' ')[1] || /* istanbul ignore next */ '0';
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
      return [];
    }
  }
}
