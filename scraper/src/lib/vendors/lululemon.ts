import * as moment from 'moment';
import * as accounting from 'accounting';
import { parseHtmlString, productQuantityHelper } from '../helpers';
import { decode as htmlDecode } from 'html-entities';
import { OrderData, RawProduct, IEmailPayload } from '../../models';

export default class Lululemon {
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
      orderRef,
      orderDate,
      products: rawProducts
    };
  }

  static async getOrderRef(root: Document): Promise<string | null> {
    try {
      const orderRefElement: any = root.querySelector(
        'html > body > div > div:nth-child(4) > div > div > div:nth-child(1) > div:nth-child(1) > span:nth-child(2) > a'
      );

      const orderRef = orderRefElement ? orderRefElement.textContent.trim() : /* istanbul ignore next */ null;
      return `${orderRef}`;
    } catch (error) {
      /* istanbul ignore next */
      return null;
    }
  }

  static async getOrderDate(root: Document): Promise<number | null> {
    try {
      const orderDateElement: any = root.querySelector(
        'html > body > div >div:nth-child(4) > div > div > div:nth-child(1) > div:nth-child(2) > span:nth-child(2)'
      );

      const orderDate = orderDateElement ? orderDateElement.textContent.trim() : /* istanbul ignore next */ null;
      return orderDate ? moment(orderDate, 'MMMM DD, YYYY').startOf('day').valueOf() : /* istanbul ignore next */ null;
    } catch (error) {
      /* istanbul ignore next */
      return null;
    }
  }
  static async getProducts(root: Document): Promise<RawProduct[]> {
    let products = [];
    try {
      const initialContainer = root.querySelector('html > body > div > div:nth-child(5) > div');

      const orderTableContainer = [];
      initialContainer.querySelectorAll('div').forEach((item: any) => {
        const hasThumbnail = item.querySelector('div:nth-child(1) > img')?.getAttribute('src');
        const hasPrice = item.querySelector('div:nth-child(2) > div > div:nth-child(2) > span')?.textContent.trim();
        if (!!hasThumbnail && !!hasPrice) {
          orderTableContainer.push(item);
        }
      });

      orderTableContainer.forEach((item: any) => {
        const productRowElement = item;
        const productNameElement = productRowElement.querySelector('div:nth-child(2) > div > div:nth-child(1) > h2');

        const productName = productNameElement.textContent.trim() || /* istanbul ignore next */ '';

        const productQuantityElement = productRowElement.querySelector(
          'div:nth-child(2) > div > div:nth-child(1) > span:nth-child(3)'
        );

        /* istanbul ignore next */
        const productQuantity = productQuantityElement.innerHTML.split('Qty: ').pop();
        const quantity = productQuantity ? parseInt(productQuantity, 10) : /* istanbul ignore next */ 1;

        const productThumbnailElement = productRowElement.querySelector('div > img');
        const productThumbnail = productThumbnailElement
          ? productThumbnailElement.getAttribute('src')
          : /* istanbul ignore next */ '';

        const productPriceElement = productRowElement.querySelector('div:nth-child(2) > div > div:nth-child(2) > span');
        const price = productPriceElement.innerHTML.trim();
        const productPrice = productPriceElement ? accounting.unformat(price) : /* istanbul ignore next */ 0;

        products = products.concat(
          productQuantityHelper({
            name: htmlDecode(`${productName}`),
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
