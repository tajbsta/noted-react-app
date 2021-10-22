import * as moment from 'moment';
import * as accounting from 'accounting';
import { parseHtmlString, productQuantityHelper } from '../helpers';
import { decode as htmlDecode } from 'html-entities';
import { OrderData, RawProduct, IEmailPayload } from '../../models';

export default class LuckyBrand {
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
        'body > table.gwfw > tbody > tr > td > table > tbody > tr:nth-child(2) > td > table:nth-child(3) > tbody > tr > td > table > tbody > tr > td'
      );
      const orderRef = orderRefElement ? orderRefElement.textContent.split(' ')[3].replace('#', '').trim() : null;
      return `${orderRef}`;
    } catch (error) {
      /* istanbul ignore next */
      return null;
    }
  }

  static async getProducts(root: Document): Promise<RawProduct[]> {
    try {
      const initialContainer = root.querySelector(
        'body > table.gwfw > tbody > tr > td > table > tbody > tr:nth-child(2) > td > table:nth-child(5) > tbody > tr > td > table > tbody'
      );

      const orderTableContainer = [];

      initialContainer.querySelectorAll('tr').forEach((item) => {
        const hasThumbnail = item.querySelector(
          'tr > td > table > tbody > tr > td:nth-child(1) > table > tbody > tr > td > a > img'
        );
        const isProduct = !!hasThumbnail && item.children.length === 2 && item.childNodes.length === 5;

        if (isProduct) {
          orderTableContainer.push(item);
        }
      });

      let products = [];

      orderTableContainer.forEach((item) => {
        const productRowElement = item;
        const productNameElement = productRowElement.querySelector(
          'td:nth-child(2) > table > tbody > tr:nth-child(1) > td > strong > a'
        );
        const productName = productNameElement.textContent.trim() || /* istanbul ignore next */ '';

        const productQuantityElement = productRowElement.querySelector(
          'td:nth-child(2) > table > tbody > tr:nth-child(6) > td'
        );

        const productQuantity = productQuantityElement.textContent.split('Quantity:').pop().trim();

        const quantity = productQuantity ? parseInt(productQuantity, 10) : /* istanbul ignore next */ 1;

        const productThumbnailElement = productRowElement.querySelector(
          'td:nth-child(1) > table > tbody > tr > td > a > img'
        );

        const productThumbnail = productThumbnailElement
          ? productThumbnailElement.getAttribute('src')
          : /* istanbul ignore next */ '';

        const productPriceElement = productRowElement.querySelector(
          'td:nth-child(2) > table > tbody > tr:nth-child(7) > td'
        );

        const price = /* istanbul ignore next */ productPriceElement.innerHTML.trim().replace('Price: $', '');
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
