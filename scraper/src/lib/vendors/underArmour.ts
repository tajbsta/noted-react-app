import * as accounting from 'accounting';
import { parseHtmlString, productQuantityHelper } from '../helpers';
import { decode as htmlDecode } from 'html-entities';
import { OrderData, RawProduct, IEmailPayload } from '../../models';

export default class UnderArmour {
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
        'html > body > center > table > tbody > tr > td > div > table:nth-child(3) > tbody > tr:nth-child(2) > td > div > table > tbody > tr > td > p:nth-child(2)'
      );

      const orderRef = orderRefElement ? orderRefElement.textContent.trim() : null;
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
        'html > body > center > table > tbody > tr > td > div > table:nth-child(3) > tbody > tr:nth-child(6) > td'
      );

      const productNameElement = productRowElement.querySelector(
        'table > tbody > tr > td:nth-child(2) > p:nth-child(1)'
      );

      const productName = productNameElement.textContent.trim() || /* istanbul ignore next */ '';

      const productQuantityElement = productRowElement.querySelector(
        'table > tbody > tr > td:nth-child(2) > p:nth-child(2)'
      );

      const productQuantity = productQuantityElement.textContent.split('x ').pop()?.trim();

      const quantity = productQuantity ? parseInt(productQuantity, 10) : /* istanbul ignore next */ 1;

      const productThumbnailElement = productRowElement.querySelector('table > tbody > tr > td:nth-child(1) > a > img');
      const productThumbnail = productThumbnailElement
        ? productThumbnailElement.getAttribute('src')
        : /* istanbul ignore next */ '';

      const productPriceElement = productRowElement.querySelector(
        'table > tbody > tr > td:nth-child(2) > p:nth-child(2)'
      );

      const price =
        productPriceElement.innerHTML.split('<br>').pop()?.split(' x ').shift()?.trim() ||
        /* istanbul ignore next */ '';
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
