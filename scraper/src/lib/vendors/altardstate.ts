import * as moment from 'moment';
import * as accounting from 'accounting';
import { parseHtmlString, productQuantityHelper } from '../helpers';
import { decode as htmlDecode } from 'html-entities';
import { OrderData, RawProduct, IEmailPayload } from '../../models';

export default class AltardState {
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
        'body > table > tbody > tr > td > table.import-message > tbody > tr:nth-child(5) > td > span:nth-child(2)'
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
        'body > table > tbody > tr > td > table.import-message > tbody > tr:nth-child(6) > td > span:nth-child(2)'
      );

      const orderDate = orderDateElement ? orderDateElement.textContent.trim() : null;

      return orderDate ? moment(orderDate, 'MMM DD, YYYY').startOf('day').valueOf() : null;
    } catch (error) {
      /* istanbul ignore next */
      return null;
    }
  }

  static async getProducts(root: Document): Promise<RawProduct[]> {
    try {
      const initialContainer = root.querySelector('body > table > tbody > tr > td > table.import-message > tbody');

      const orderTableContainer = [];

      initialContainer.querySelectorAll('tr').forEach((item) => {
        const hasTumbnail = item.querySelector('td:nth-child(1) > div > img');
        const isProduct = !!hasTumbnail && item.children.length === 2 && item.childNodes.length === 5;

        if (isProduct) {
          orderTableContainer.push(item);
        }
      });

      let products = [];

      orderTableContainer.forEach((item) => {
        const productRowElement = item;

        const productNameElement = productRowElement.querySelector('td:nth-child(2) > div > div > b');
        const productName = productNameElement.textContent.trim() || '';

        const productQuantityElement = productRowElement.querySelector('td:nth-child(2) > div');
        const productQuantity = productQuantityElement.childNodes[6].textContent.replace('Quantity : ', '').trim();
        const quantity = productQuantity ? parseInt(productQuantity, 10) : 1;

        const productThumbnailElement = productRowElement.querySelector('td:nth-child(1) > div > img');
        const productThumbnail = productThumbnailElement ? productThumbnailElement.getAttribute('src') : '';

        const productPriceElement = productRowElement.querySelector('td:nth-child(2) > div');
        const price = productPriceElement.childNodes[8].textContent
          .replace('Your Price : ', '')
          .replace('$', '')
          .trim();
        const productPrice = productPriceElement ? accounting.unformat(price) : 0;

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
      return [];
    }
  }
}
