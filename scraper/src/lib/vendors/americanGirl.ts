import * as moment from 'moment';
import * as accounting from 'accounting';
import { parseHtmlString, productQuantityHelper } from '../helpers';
import { decode as htmlDecode } from 'html-entities';
import { OrderData, RawProduct, IEmailPayload } from '../../models';

export default class AmericanGirl {
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
        'body > table > tbody > tr > td > center > div > table:nth-child(2) > tbody > tr:nth-child(2) > td > table > tbody > tr > td > table:nth-child(1) > tbody > tr:nth-child(2) > td'
      );

      const orderRef = orderRefElement ? orderRefElement.textContent.match(/\((.*)\)/)[1].trim() : null;
      return `${orderRef}`;
    } catch (error) {
      /* istanbul ignore next */
      return null;
    }
  }

  static async getProducts(root: Document): Promise<RawProduct[]> {
    try {
      const initialContainer = root.querySelector(
        'body > table > tbody > tr > td > center > div > table:nth-child(2) > tbody > tr:nth-child(2) > td > table > tbody > tr > td > table.container > tbody'
      );

      const orderTableContainer = [];

      initialContainer.querySelectorAll('tr').forEach((item: any) => {
        const hasThumbnail = item.querySelector(
          'td:nth-child(1) > div:nth-child(1) > table > tbody > tr > td > a > img'
        );
        const isProduct = !!hasThumbnail && item.children.length === 1 && item.childNodes[0].length === 5;

        if (isProduct) {
          orderTableContainer.push(item);
        }
      });

      let products = [];

      orderTableContainer.forEach((item) => {
        const productRowElement = item;

        const productNameElement = productRowElement.querySelector(
          'td:nth-child(1) > div:nth-child(2) > table > tbody > tr > td > a > span'
        );
        const productName = productNameElement.textContent.trim() || '';

        const productQuantityElement = productRowElement.querySelector(
          'td:nth-child(1) > div:nth-child(2) > table > tbody > tr > td'
        );
        const productQuantity = productQuantityElement.childNodes[8].textContent.replace('Quantity:', '').trim();
        const quantity = productQuantity ? parseInt(productQuantity, 10) : /* istanbul ignore next */ 1;

        const productThumbnailElement = productRowElement.querySelector(
          'td:nth-child(1) > div:nth-child(1) > table > tbody > tr > td > a > img'
        );

        const productThumbnail = productThumbnailElement
          ? productThumbnailElement.getAttribute('src')
          : /* istanbul ignore next */ '';

        const productPriceElement = productRowElement.querySelector(
          'td:nth-child(1) > div:nth-child(2) > table > tbody > tr > td'
        );
        const price = /* istanbul ignore next */ productPriceElement.childNodes[6].textContent.trim().replace('$', '');
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
