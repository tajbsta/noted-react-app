import * as moment from 'moment';
import * as accounting from 'accounting';
import { parseHtmlString, productQuantityHelper } from '../helpers';
import { decode as htmlDecode } from 'html-entities';
import { OrderData, RawProduct, IEmailPayload } from '../../models';

export default class UltaBeauty {
  static async parse(code: string, payload: IEmailPayload): Promise<OrderData> {
    const doc = parseHtmlString(payload.decodedBody);

    const [orderRef, orderDate, rawProducts] = await Promise.all([
      this.getOrderRef(doc),
      this.getOrderDate(doc),
      this.getProducts(doc)
    ]);

    if (!orderRef || !orderDate || rawProducts.length === 0 || rawProducts.find((x) => !x.name)) {
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
        'body > table.scaleForMobile > tbody > tr:nth-child(2) > td > table > tbody > tr > td > table > tbody > tr:nth-child(3) > td > table > tbody > tr > td > table > tbody > tr:nth-child(1) > td > table > tbody > tr:nth-child(3) > td > span:nth-child(2)'
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
        'body > table.scaleForMobile > tbody > tr:nth-child(2) > td > table > tbody > tr > td > table > tbody > tr:nth-child(3) > td > table > tbody > tr > td > table > tbody > tr:nth-child(1) > td > table > tbody > tr:nth-child(4) > td'
      );

      const orderDate = orderDateElement ? orderDateElement.childNodes[2].textContent.trim() : null;

      return orderDate ? moment(orderDate, 'MM.DD.YY').startOf('day').valueOf() : null;
    } catch (error) {
      /* istanbul ignore next */
      return null;
    }
  }

  static async getProducts(root: Document): Promise<RawProduct[]> {
    try {
      const initialContainer = root.querySelector(
        'body > table.scaleForMobile > tbody > tr:nth-child(2) > td > table > tbody > tr > td > table > tbody > tr:nth-child(7) > td > table:nth-child(3) > tbody'
      );

      const orderTableContainer = [];

      initialContainer.querySelectorAll('tr').forEach((item) => {
        const hasThumbnail = item.querySelector('td:nth-child(1) > a > img');
        const isProduct = !!hasThumbnail && item.children.length === 2 && item.childNodes.length === 5;

        if (isProduct) {
          orderTableContainer.push(item);
        }
      });

      let products = [];

      orderTableContainer.forEach((item) => {
        const productRowElement = item;

        const productNameElement1 = productRowElement.querySelector(
          'td:nth-child(2) > table > tbody > tr:nth-child(1) > td > span:nth-child(1)'
        );
        const productNameElement2 = productRowElement.querySelector(
          'td:nth-child(2) > table > tbody > tr:nth-child(1) > td'
        );
        const productName1 = productNameElement1.textContent.trim() || /* istanbul ignore next */ '';
        const productName2 = productNameElement2.childNodes[4].textContent.trim() || /* istanbul ignore next */ '';
        const productName = `${productName1} ${productName2}`;

        const productQuantityElement = productRowElement.querySelector(
          'td:nth-child(2) > table > tbody > tr:nth-child(2) > td:nth-child(2)'
        );
        const productQuantity = productQuantityElement.childNodes[4].textContent.trim();
        const quantity = productQuantity ? parseInt(productQuantity, 10) : /* istanbul ignore next */ 1;

        const productThumbnailElement = productRowElement.querySelector('td:nth-child(1) > a > img');
        const productThumbnail = productThumbnailElement
          ? productThumbnailElement.getAttribute('src')
          : /* istanbul ignore next */ '';

        const productPriceElement = productRowElement.querySelector(
          'td:nth-child(2) > table > tbody > tr:nth-child(2) > td:nth-child(1)'
        );
        const price = /* istanbul ignore next */ productPriceElement.childNodes[3]?.textContent.replace('$', '').trim();
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
