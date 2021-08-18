import * as accounting from 'accounting';
import { parseHtmlString, productQuantityHelper } from '../helpers';
import { decode as htmlDecode } from 'html-entities';
import { OrderData, RawProduct, IEmailPayload } from '../../models';

export default class NorthFace {
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
        'html > body > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr > td > table:nth-child(4) > tbody > tr > td > table:nth-child(1) > tbody > tr > td'
      );

      const orderRef = orderRefElement ? orderRefElement.textContent.split(':').pop()?.trim() : null;
      return `${orderRef}`;
    } catch (error) {
      /* istanbul ignore next */
      return null;
    }
  }

  static async getProducts(root: Document): Promise<RawProduct[]> {
    try {
      const initialContainer = root.querySelector(
        'html > body > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr > td > table:nth-child(4) > tbody > tr > td'
      );
      const orderTableContainer = [];

      initialContainer.querySelectorAll('table').forEach((item) => {
        const hasThumbnail = item
          .querySelector(
            'tbody > tr:nth-child(1) > td > table > tbody > tr > td > table:nth-child(1) > tbody > tr > td > a > img'
          )
          ?.getAttribute('src');
        const isProduct = !!hasThumbnail && item.querySelector('tbody').children.length === 2;
        if (isProduct) {
          orderTableContainer.push(item);
        }
      });

      let products = [];

      orderTableContainer.forEach((item) => {
        const productRowElement = item;
        const productNameElement = productRowElement.querySelector(
          'tbody > tr:nth-child(1) > td > table > tbody > tr > td > table:nth-child(2) > tbody > tr:nth-child(1) > td'
        );
        const productName = productNameElement.textContent.trim() || /* istanbul ignore next */ '';

        const productQuantityElement = productRowElement.querySelector(
          'tbody > tr:nth-child(1) > td > table > tbody > tr > td > table:nth-child(2) > tbody > tr:nth-child(6) > td > table > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(2) > td'
        );

        /* istanbul ignore next */
        const productQuantity = productQuantityElement.textContent.trim();
        const quantity = productQuantity ? parseInt(productQuantity, 10) : /* istanbul ignore next */ 1;

        const productThumbnailElement = productRowElement.querySelector(
          'tbody > tr:nth-child(1) > td > table > tbody > tr > td > table:nth-child(1) > tbody > tr > td > a > img'
        );
        const productThumbnail = productThumbnailElement
          ? productThumbnailElement.getAttribute('src')
          : /* istanbul ignore next */ '';

        const productPriceElement = productRowElement.querySelector(
          'tbody > tr:nth-child(1) > td > table > tbody > tr > td > table:nth-child(2) > tbody > tr:nth-child(6) > td > table > tbody > tr > td:nth-child(3) > table > tbody > tr:nth-child(2) > td'
        );
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
