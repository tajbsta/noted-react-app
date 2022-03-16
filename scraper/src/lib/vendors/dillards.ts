import * as moment from 'moment';
import * as accounting from 'accounting';
import { parseHtmlString, productQuantityHelper } from '../helpers';
import { decode as htmlDecode } from 'html-entities';
import { OrderData, RawProduct, IEmailPayload } from '../../models';

export default class Dillards {
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
        '#content > tbody > tr > td > table > tbody > tr > td > table > tbody > tr:nth-child(1) > td > table > tbody > tr:nth-child(1) > td > p:nth-child(1) > strong'
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
      const initialContainer = root.querySelector(
        '#content > tbody > tr > td > table > tbody > tr > td > table > tbody > tr:nth-child(3) > td > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(8) > td > table > tbody'
      );

      const orderTableContainer = [];

      initialContainer.querySelectorAll('tr').forEach((item) => {
        const hasThumbnail = item.querySelector('td:nth-child(1) > a > img');
        const isProduct = !!hasThumbnail && item.children.length === 5 && item.childNodes.length === 11;

        if (isProduct) {
          orderTableContainer.push(item);
        }
      });

      let products = [];

      orderTableContainer.forEach((item) => {
        const productRowElement = item;
        const productNameElement = productRowElement.querySelector(
          'td:nth-child(2) > table > tbody > tr:nth-child(2) > td > p > a'
        );
        const productName = productNameElement.textContent.trim() || /* istanbul ignore next */ '';

        const productQuantityElement = productRowElement.querySelector('td:nth-child(3) > p');

        const productQuantity = productQuantityElement.innerHTML.split('Quantity: ').pop().replace('<br>', '');

        const quantity = productQuantity ? parseInt(productQuantity, 10) : /* istanbul ignore next */ 1;

        const productThumbnailElement = productRowElement.querySelector('td:nth-child(1) > a > img');

        const productThumbnail = productThumbnailElement
          ? productThumbnailElement.getAttribute('src')
          : /* istanbul ignore next */ '';

        const productPriceElement = productRowElement.querySelector('td:nth-child(4) > p');
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
