import * as moment from 'moment';
import * as accounting from 'accounting';
import { parseHtmlString, productQuantityHelper } from '../helpers';
import { decode as htmlDecode } from 'html-entities';
import { OrderData, RawProduct, IEmailPayload } from '../../models';

export default class DakotaWatch {
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
        'body > table > tbody > tr > td > table:nth-child(4) > tbody > tr > td > table:nth-child(3) > tbody > tr > th > table > tbody > tr > th:nth-child(1) > h2'
      );

      const orderRef = orderRefElement ? orderRefElement.textContent.replace('Order #', '').trim() : null;
      return `${orderRef}`;
    } catch (error) {
      /* istanbul ignore next */
      return null;
    }
  }

  static async getProducts(root: Document): Promise<RawProduct[]> {
    try {
      const initialContainer = root.querySelector(
        'body > table > tbody > tr > td > table:nth-child(4) > tbody > tr > td > table:nth-child(3) > tbody > tr > th > table > tbody > tr > th:nth-child(1) > table > tbody'
      );

      const orderTableContainer = [];

      initialContainer.querySelectorAll('tr').forEach((item) => {
        const hasThumbnail = item.querySelector('th:nth-child(1) > img');
        const isProduct = !!hasThumbnail && item.children.length === 4 && item.childNodes.length === 9;
        if (isProduct) {
          orderTableContainer.push(item);
        }
      });

      let products = [];

      orderTableContainer.forEach((item) => {
        const productRowElement = item;

        const productNameElement = productRowElement.querySelector('th:nth-child(2) > p:nth-child(1)');
        const productName = productNameElement.textContent.trim() || '';

        const productQuantityElement = productRowElement.querySelector('th:nth-child(3) > p');
        const productQuantity = productQuantityElement.textContent.replace('Qty:', '').trim() || '';
        const quantity = productQuantity ? parseInt(productQuantity, 10) : /* istanbul ignore next */ 1;

        const productThumbnailElement = productRowElement.querySelector('th:nth-child(1) > img');
        const productThumbnail = productThumbnailElement
          ? productThumbnailElement.getAttribute('src')
          : /* istanbul ignore next */ '';

        const productPriceElement = productRowElement.querySelector('th:nth-child(2) > p:nth-child(4)');
        const price = /* istanbul ignore next */ productPriceElement.textContent
          .replace('$', '')
          .replace('USD', '')
          .trim();
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
