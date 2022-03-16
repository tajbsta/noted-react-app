import * as accounting from 'accounting';
import { parseHtmlString, productQuantityHelper } from '../helpers';
import { decode as htmlDecode } from 'html-entities';
import { OrderData, RawProduct, IEmailPayload } from '../../models';

export default class FreePeople {
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
      orderDate: Number(payload.internalDate),
      products: rawProducts
    };
  }

  static async getOrderRef(root: Document): Promise<string | null> {
    try {
      const orderRefElement = root.querySelector(
        'html > body > table > tbody > tr > td > table > tbody > tr > td > table:nth-child(1) > tbody > tr:nth-child(3) > td > h4 > a'
      );
      const orderRef = orderRefElement ? orderRefElement.textContent.split(': ').pop()?.trim() : null;
      return `${orderRef}`;
    } catch (error) {
      /* istanbul ignore next */
      return null;
    }
  }

  static async getProducts(root: Document): Promise<RawProduct[]> {
    try {
      let products = [];

      const productRowElement = root.querySelector(
        'html > body > table > tbody > tr > td > table > tbody > tr > td > table:nth-child(2) > tbody > tr:nth-child(1) > td > table:nth-child(4) > tbody > tr:nth-child(2) > td > table > tbody'
      );

      const productNameElement = productRowElement.querySelector(
        'tr:nth-child(1) > td:nth-child(2) > table > tbody > tr:nth-child(1) > td'
      );

      const productName = productNameElement.innerHTML.split('<br>').shift()?.trim() || /* istanbul ignore next */ '';

      const productQuantityElement = productRowElement.querySelector('tr:nth-child(1) > td:nth-child(4)');

      const productQuantity = productQuantityElement.innerHTML.trim();

      const quantity = productQuantity ? parseInt(productQuantity, 10) : /* istanbul ignore next */ 1;

      const productThumbnailElement = productRowElement.querySelector('tr:nth-child(1) > td:nth-child(1) > a > img');
      const productThumbnail = productThumbnailElement
        ? productThumbnailElement.getAttribute('src')
        : /* istanbul ignore next */ '';

      const productPriceElement = productRowElement.querySelector('tr:nth-child(1) > td:nth-child(3)');

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
