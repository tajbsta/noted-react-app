import * as moment from 'moment';
import * as accounting from 'accounting';
import { parseHtmlString, productQuantityHelper } from '../helpers';
import { decode as htmlDecode } from 'html-entities';
import { OrderData, RawProduct, IEmailPayload } from '../../models';

export default class MacCosmetics {
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
        'body > div > div.order-info > table > tbody > tr:nth-child(1) > td:nth-child(1)'
      );
      const orderRef = orderRefElement ? orderRefElement.textContent.replace('Order Number:', '').trim() : null;
      return `${orderRef}`;
    } catch (error) {
      /* istanbul ignore next */
      return null;
    }
  }

  static async getOrderDate(root: Document): Promise<number | null> {
    try {
      const orderDateElement = root.querySelector(
        'body > div > div.order-info > table > tbody > tr:nth-child(1) > td:nth-child(2)'
      );

      const orderDate = orderDateElement ? orderDateElement.textContent.replace('Order Date:', '').trim() : null;

      return orderDate ? moment(orderDate, 'MMM DD, YYYY').startOf('day').valueOf() : null;
    } catch (error) {
      /* istanbul ignore next */
      return null;
    }
  }

  static async getProducts(root: Document): Promise<RawProduct[]> {
    try {
      const initialContainer = root.querySelector('#replenisment_maincontent > table:nth-child(2) > tbody');

      const orderTableContainer = [];

      initialContainer.querySelectorAll('tr').forEach((item) => {
        const hasTumbnail = item.querySelector('tr > td:nth-child(1) > a > img');
        const isProduct = !!hasTumbnail && item.children.length === 5 && item.childNodes.length === 10;

        if (isProduct) {
          orderTableContainer.push(item);
        }
      });

      let products = [];

      orderTableContainer.forEach((item) => {
        const productRowElement = item;

        const productNameElement = productRowElement.querySelector('tr > td:nth-child(2) > a');
        const productName = productNameElement.textContent.trim() || /* istanbul ignore next */ '';

        const productQuantityElement = productRowElement.querySelector('tr > td:nth-child(4)');

        const productQuantity = productQuantityElement.innerHTML.trim();

        const quantity = productQuantity ? parseInt(productQuantity, 10) : /* istanbul ignore next */ 1;

        const productThumbnailElement = productRowElement.querySelector('tr > td:nth-child(1) > a > img');

        const productThumbnail = productThumbnailElement
          ? productThumbnailElement.getAttribute('src')
          : /* istanbul ignore next */ '';

        const productPriceElement = productRowElement.querySelector('tr > td:nth-child(3)');
        const price = /* istanbul ignore next */ productPriceElement.innerHTML.trim().replace('$', '');
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
