import * as accounting from 'accounting';
import { parseHtmlString, productQuantityHelper } from '../helpers';
import { decode as htmlDecode } from 'html-entities';
import { OrderData, RawProduct, IEmailPayload } from '../../models';

export default class Zara {
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
        'html > body > div > div:nth-child(1) > table > tbody > tr > td > div > table > tbody > tr > td > table > tbody > tr:nth-child(3) > td > div'
      );

      const orderRef = orderRefElement ? orderRefElement.textContent.trim().split(' ').pop()?.trim() : null;
      return `${orderRef}`;
    } catch (error) {
      /* istanbul ignore next */
      return null;
    }
  }

  static async getProducts(root: Document): Promise<RawProduct[]> {
    try {
      const initialContainer = root.querySelector(
        'html > body > div > div:nth-child(3) > table > tbody > tr > td > div > table > tbody > tr > td > table > tbody'
      );

      let products = [];

      initialContainer.querySelectorAll('tr').forEach((item, index, arr) => {
        const productRowElement = item;
        if (productRowElement.querySelector('td').getAttribute('class') === 'product-price') {
          const productNameElement = arr[index - 5].querySelector('td > div');

          const productName = productNameElement.innerHTML.trim() || /* istanbul ignore next */ '';

          const productQuantityElement = arr[index - 2].querySelector('td > div');

          /* istanbul ignore next */
          const productQuantity = productQuantityElement.textContent.trim();
          const quantity = productQuantity ? parseInt(productQuantity, 10) : /* istanbul ignore next */ 1;

          const productThumbnailElement = arr[index - 8].querySelector('td > img');
          const productThumbnail = productThumbnailElement
            ? productThumbnailElement.getAttribute('src')
            : /* istanbul ignore next */ '';

          const productPriceElement = arr[index].querySelector('td > div');
          /* istanbul ignore next */
          const price = productPriceElement.innerHTML.split('&').shift()?.trim();
          const productPrice = productPriceElement ? accounting.unformat(price) : /* istanbul ignore next */ 0;

          products = products.concat(
            productQuantityHelper({
              name: productName,
              price: productPrice,
              thumbnail: productThumbnail,
              quantity
            })
          );
        }
      });
      return products;
    } catch (error) {
      /* istanbul ignore next */
      return [];
    }
  }
}
