import * as accounting from 'accounting';
import { parseHtmlString, productQuantityHelper } from '../helpers';
import { decode as htmlDecode } from 'html-entities';
import { OrderData, RawProduct, IEmailPayload } from '../../models';

export default class FootLocker {
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
        'html > body > table > tbody > tr > td > table:nth-child(14) > tbody > tr > td:nth-child(2) > font'
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

  /* istanbul ignore next */
  static async getProducts(root: Document): Promise<RawProduct[]> {
    try {
      let products = [];

      const productRowElement = root.querySelector(
        'html > body > table > tbody > tr > td > table:nth-child(20) > tbody > tr'
      );

      const productNameElement = productRowElement.querySelector('td:nth-child(2) > font');

      const productName = productNameElement.innerHTML.split('<br>').shift()?.trim() || /* istanbul ignore next */ '';

      const productQuantityElement = productRowElement.querySelector('td:nth-child(2) > font');

      const productQuantity = productQuantityElement.innerHTML.split(': ').pop()?.trim();

      const quantity = productQuantity ? parseInt(productQuantity, 10) : /* istanbul ignore next */ 1;

      const productThumbnail = '';

      const productPriceElement = productRowElement.querySelector('td:nth-child(3) > font');

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
