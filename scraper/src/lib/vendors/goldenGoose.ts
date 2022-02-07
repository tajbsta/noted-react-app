import * as moment from 'moment';
import * as accounting from 'accounting';
import { parseHtmlString, productQuantityHelper } from '../helpers';
import { decode as htmlDecode } from 'html-entities';
import { OrderData, RawProduct, IEmailPayload } from '../../models';

export default class GoldenGoose {
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
        'body > table > tbody > tr > td > center > table.container.mail-container.float-center > tbody > tr > td > table:nth-child(2) > tbody > tr > td > table:nth-child(4) > tbody > tr > th.small-12.large-6.columns.first > table > tbody > tr > th > center > div > span:nth-child(2)'
      );
      const orderRef = orderRefElement ? orderRefElement.textContent.replace('US', '').trim() : null;
      return `${orderRef}`;
    } catch (error) {
      /* istanbul ignore next */
      return null;
    }
  }

  static async getOrderDate(root: Document): Promise<number | null> {
    try {
      const orderDateElement = root.querySelector(
        'body > table > tbody > tr > td > center > table.container.mail-container.float-center > tbody > tr > td > table:nth-child(2) > tbody > tr > td > table:nth-child(4) > tbody > tr > th.small-12.large-6.columns.last > table > tbody > tr > th > center > div > span:nth-child(2)'
      );
      const orderDate = orderDateElement ? orderDateElement.textContent.trim() : null;
      return orderDate ? moment(orderDate, 'DD.MM.YYYY').startOf('day').valueOf() : null;
    } catch (error) {
      /* istanbul ignore next */
      return null;
    }
  }
  static async getProducts(root: Document): Promise<RawProduct[]> {
    try {
      const initialContainer = root.querySelector(
        'body > table > tbody > tr > td > center > table.container.mail-container.float-center > tbody > tr > td > table:nth-child(2) > tbody > tr > td > table:nth-child(12) > tbody > tr > th > table > tbody'
      );

      const orderTableContainer = [];

      initialContainer.querySelectorAll('th > div').forEach((item) => {
        const hasThumbnail = item.querySelector('img');
        const isProduct = !!hasThumbnail && item.children.length === 7 && item.childNodes.length === 7;

        if (isProduct) {
          orderTableContainer.push(item);
        }
      });

      let products = [];

      orderTableContainer.forEach((item) => {
        const productRowElement = item;
        const productNameElement = productRowElement.childNodes[2];
        const productName = productNameElement.textContent.trim() || /* istanbul ignore next */ '';

        const productQuantityElement = productRowElement.childNodes[3];
        const productQuantity = productQuantityElement.textContent.replace('Qty:', '').trim();
        const quantity = productQuantity ? parseInt(productQuantity, 10) : /* istanbul ignore next */ 1;

        const productThumbnailElement = productRowElement.childNodes[0];
        const productThumbnail = productThumbnailElement
          ? productThumbnailElement.getAttribute('src')
          : /* istanbul ignore next */ '';

        const productPriceElement = productRowElement.childNodes[4];
        const price = /* istanbul ignore next */ productPriceElement.textContent.replace('$', '').trim();
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
