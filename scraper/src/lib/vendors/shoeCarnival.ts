import * as accounting from 'accounting';
import { parseHtmlString, productQuantityHelper } from '../helpers';
import { decode as htmlDecode } from 'html-entities';
import { OrderData, RawProduct, IEmailPayload } from '../../models';

export default class ShoeCarnival {
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
        'html > body > table > tbody > tr > td > table > tbody > tr > td > table:nth-child(6) > tbody > tr:nth-child(2) > th > div'
      );

      const orderRef = orderRefElement ? orderRefElement.textContent.split(': ').pop()?.trim() : null;
      return `${orderRef}`;
    } catch (error) {
      /* istanbul ignore next */
      return null;
    }
  }

  /* istanbul ignore next */
  static async getProducts(root: Document): Promise<RawProduct[]> {
    try {
      let products = [];

      const productRowElement = root.querySelector(
        'html > body > table > tbody > tr > td > table > tbody > tr > td > table:nth-child(14) > tbody > tr:nth-child(2)'
      );

      const productNameElement = productRowElement.querySelector(
        'td:nth-child(2) > table > tbody > tr > th:nth-child(1) > div:nth-child(1)'
      );

      const productName = productNameElement.textContent.split(': ').pop()?.trim() || /* istanbul ignore next */ '';

      const productQuantityElement = productRowElement.querySelector(
        'td:nth-child(2) > table > tbody > tr > th:nth-child(1) > div:nth-child(4)'
      );

      const productQuantity = productQuantityElement.textContent.split(':').pop().trim();

      const quantity = productQuantity ? parseInt(productQuantity, 10) : /* istanbul ignore next */ 1;

      const productThumbnailElement = productRowElement.querySelector('td:nth-child(1) > a > img');
      const productThumbnail = productThumbnailElement
        ? productThumbnailElement.getAttribute('src')
        : /* istanbul ignore next */ '';

      const productPriceElement = productRowElement.querySelector(
        'td:nth-child(2) > table > tbody > tr > th:nth-child(2) > div:nth-child(1)'
      );

      const price = productPriceElement.textContent.trim() || /* istanbul ignore next */ '';
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
