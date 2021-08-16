import * as accounting from 'accounting';
import { parseHtmlString, productQuantityHelper } from '../helpers';
import { decode as htmlDecode } from 'html-entities';
import { OrderData, RawProduct, IEmailPayload } from '../../models';

export default class Adidas {
  static async parse(code: string, payload: IEmailPayload): Promise<OrderData> {
    const doc = parseHtmlString(payload.decodedBody);
    const [orderRef, rawProducts] = await Promise.all([this.getOrderRef(doc), this.getProducts(doc)]);

    if (!orderRef || rawProducts.length === 0 || rawProducts.find((x) => !x.name || !x.price)) {
      throw new Error(`Lacking info parsed from the email: ${JSON.stringify({ orderRef, rawProducts })}`);
    }

    return {
      vendor: code,
      emailId: payload.id,
      orderRef,
      orderDate: 0,
      products: rawProducts
    };
  }

  static async getOrderRef(root: Document): Promise<string | null> {
    try {
      const orderRefElement = root.querySelector(
        'body > table > tbody > tr:nth-child(6) > td > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr:nth-child(2) > td > a > span'
      );

      const orderRef = orderRefElement
        ? /* istanbul ignore next */ orderRefElement.textContent.split(': ').pop()?.trim()
        : /* istanbul ignore next */ null;
      return `${orderRef}`;
    } catch (error) {
      /* istanbul ignore next */
      return null;
    }
  }

  static async getProducts(root: Document): Promise<RawProduct[]> {
    let products = [];
    try {
      const productRowElement = root.querySelector(
        'body > table > tbody > tr:nth-child(8) > td > table > tbody > tr > td > table > tbody > tr > td > table > tbody> tr:nth-child(2) > td > table > tbody > tr'
      );

      const productNameElement = productRowElement.querySelector('td:nth-child(2) > span');

      const productName = productNameElement.textContent.trim() || /* istanbul ignore next */ '';

      const productQuantityElement = productRowElement.querySelector('td:nth-child(2) > span:nth-child(10)');

      /* istanbul ignore next */
      const productQuantity = productQuantityElement.textContent.trim().split(': ').pop()?.trim();

      const quantity = productQuantity ? parseInt(productQuantity, 10) : /* istanbul ignore next */ 1;

      const productThumbnailElement = productRowElement.querySelector('td > img');
      const productThumbnail = productThumbnailElement
        ? productThumbnailElement.getAttribute('src')
        : /* istanbul ignore next */ '';

      const productPriceElement = productRowElement.querySelector('td:nth-child(2) > span:nth-child(3)');

      const price = productPriceElement.innerHTML.trim();

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
