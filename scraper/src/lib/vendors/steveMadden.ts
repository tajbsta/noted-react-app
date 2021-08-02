import * as moment from 'moment';
import * as accounting from 'accounting';
import { parseHtmlString, productQuantityHelper } from '../helpers';
import { decode as htmlDecode } from 'html-entities';
import { OrderData, RawProduct, IEmailPayload } from '../../models';

export default class SteveMadden {
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
        'html > body > center > table > tbody > tr > td > div:nth-child(1) > div > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td > table:nth-child(3) > tbody > tr > td > table > tbody > tr > td > p:nth-child(1) > strong'
      );

      const orderRef = orderRefElement ? orderRefElement.textContent.trim() : null;
      return `${orderRef}`;
    } catch (error) {
      /* istanbul ignore next */
      return null;
    }
  }

  /* istanbul ignore next */
  static async getOrderDate(root: Document): Promise<number | null> {
    try {
      const orderDateElement = root.querySelector(
        'html > body > center > table > tbody > tr > td > div:nth-child(1) > div > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td > table:nth-child(3) > tbody > tr > td > table > tbody > tr > td > p:nth-child(2) > strong'
      );
      const orderDate = orderDateElement ? orderDateElement.textContent.trim() : null;

      return orderDate ? moment(orderDate, 'MM/DD/YYYY').startOf('day').valueOf() : null;
    } catch (error) {
      /* istanbul ignore next */
      return null;
    }
  }

  static async getProducts(root: Document): Promise<RawProduct[]> {
    try {
      const initialContainer = root.querySelector(
        'html > body > center > table > tbody > tr > td > div:nth-child(1) > div > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td > table:nth-child(10) > tbody > tr > td > table > tbody'
      );
      const orderTableContainer = [];
      /* istanbul ignore next */
      initialContainer.querySelectorAll('tr').forEach((item) => {
        const hasThumbnail = item.querySelector('td:nth-child(1) > table > tbody > tr > td > img')?.getAttribute('src');
        const hasProductName = item.querySelector('td:nth-child(2) > p:nth-child(1) > span:nth-child(1) > strong');

        const isProduct = !!hasThumbnail && !!hasProductName;
        if (isProduct) {
          orderTableContainer.push(item);
        }
      });

      let products = [];

      orderTableContainer.forEach((item) => {
        const productRowElement = item;
        const productNameElement = productRowElement.querySelector(
          'td:nth-child(2) > p:nth-child(1) > span:nth-child(1) > strong'
        );

        const productName = productNameElement.textContent.trim() || /* istanbul ignore next */ '';

        const quantity = 1;

        const productThumbnailElement = productRowElement.querySelector(
          'td:nth-child(1) > table > tbody > tr > td > img'
        );
        const productThumbnail = productThumbnailElement
          ? productThumbnailElement.getAttribute('src')
          : /* istanbul ignore next */ '';

        const productPriceElement = productRowElement.querySelector('td:nth-child(2) > p:nth-child(2) > strong > span');
        const price = /* istanbul ignore next */ productPriceElement.innerHTML.trim();
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
