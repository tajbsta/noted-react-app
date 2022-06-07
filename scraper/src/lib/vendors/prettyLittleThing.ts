import * as moment from 'moment';
import * as accounting from 'accounting';
import { parseHtmlString, productQuantityHelper } from '../helpers';
import { decode as htmlDecode } from 'html-entities';
import { OrderData, RawProduct, IEmailPayload } from '../../models';

export default class PrettyLittleThing {
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
        'body > table > tbody > tr > td > table:nth-child(2) > tbody > tr > td > table > tbody > tr > td > table > tbody > tr:nth-child(8) > td > table > tbody > tr > td'
      );
      const orderRef = orderRefElement ? orderRefElement.childNodes[2].textContent.trim() : null;
      return orderRef;
    } catch (error) {
      /* istanbul ignore next */
      return null;
    }
  }

  static async getProducts(root: Document): Promise<RawProduct[]> {
    try {
      const initialContainer = root.querySelector(
        'body > table > tbody > tr > td > table:nth-child(3) > tbody > tr > td > table > tbody'
      );

      const orderTableContainer = [];

      initialContainer.querySelectorAll('tr').forEach((item) => {
        const hasTumbnail = item.querySelector('td:nth-child(1) > table > tbody > tr > td > img');
        const isProduct = !!hasTumbnail && item.children.length === 2 && item.childNodes.length === 4;

        if (isProduct) {
          orderTableContainer.push(item);
        }
      });

      let products = [];

      orderTableContainer.forEach((item) => {
        const productRowElement = item;

        const productNameElement = productRowElement.querySelector(
          'td:nth-child(2) > table:nth-child(1) > tbody > tr:nth-child(1) > td > table > tbody > tr > td'
        );
        const productName = productNameElement.textContent.trim() || /* istanbul ignore next */ '';

        const productQuantityElement = productRowElement.querySelector(
          'td:nth-child(2) > table:nth-child(1) > tbody > tr:nth-child(4) > td > table > tbody > tr:nth-child(2) > td'
        );
        const productQuantity = productQuantityElement.textContent.replace('Quantity:', '').trim();
        const quantity = productQuantity ? parseInt(productQuantity, 10) : /* istanbul ignore next */ 1;

        const productThumbnailElement = productRowElement.querySelector(
          'td:nth-child(1) > table > tbody > tr > td > img'
        );
        const productThumbnail = productThumbnailElement
          ? productThumbnailElement.getAttribute('src')
          : /* istanbul ignore next */ '';

        const productPriceElement1 = productRowElement.querySelector(
          'td:nth-child(2) > table:nth-child(2) > tbody > tr:nth-child(1) > td'
        );
        const productPriceElement2 = productRowElement.querySelector(
          'td:nth-child(2) > table:nth-child(2) > tbody > tr:nth-child(2) > td'
        );
        const price = /* istanbul ignore next */ productPriceElement2
          ? productPriceElement2.textContent.split(' ')[0].replace('$', '')
          : productPriceElement1.textContent.trim().replace('$', '');
        const productPrice =
          productPriceElement1 || productPriceElement2 ? accounting.unformat(price) : /* istanbul ignore next */ 0;

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
