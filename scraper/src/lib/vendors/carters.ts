import * as accounting from 'accounting';
import { parseHtmlString, productQuantityHelper } from '../helpers';
import { decode as htmlDecode } from 'html-entities';
import { OrderData, RawProduct, IEmailPayload } from '../../models';

export default class Carters {
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
        '#body > table:nth-child(12) > tbody > tr > td > table > tbody > tr > td > table:nth-child(6)> tbody > tr > td > table > tbody > tr:nth-child(2) > td > strong:nth-child(7)'
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
        '#body > table:nth-child(12) > tbody > tr > td > table > tbody > tr > td'
      );

      const orderTableContainer = [];

      initialContainer.querySelectorAll('table').forEach((item) => {
        const hasThumbnail = item
          .querySelector('tbody > tr > td:nth-child(2) > table > tbody > tr > td:nth-child(1) > a:nth-child(1) > img')
          ?.getAttribute('src');
        const isProduct = !!hasThumbnail && item.querySelector('tbody > tr').childNodes.length === 13;
        if (isProduct) {
          orderTableContainer.push(item);
        }
      });

      let products = [];

      orderTableContainer.forEach((item) => {
        const productRowElement = item;
        const productNameElement = productRowElement.querySelector(
          'tbody > tr > td:nth-child(2) > table > tbody > tr > td:nth-child(3) > strong:nth-child(1)'
        );
        const productName = productNameElement.textContent.trim() || /* istanbul ignore next */ '';

        const productQuantityElement = productRowElement.querySelector(
          'tbody > tr > td:nth-child(2) > table > tbody > tr > td:nth-child(4)'
        );

        /* istanbul ignore next */
        const productQuantity = productQuantityElement.innerHTML.trim();
        const quantity = productQuantity ? parseInt(productQuantity, 10) : /* istanbul ignore next */ 1;

        const productThumbnailElement = productRowElement.querySelector(
          'tbody > tr > td:nth-child(2) > table > tbody > tr > td:nth-child(1) > a:nth-child(1) > img'
        );
        const productThumbnail = productThumbnailElement
          ? productThumbnailElement.getAttribute('src')
          : /* istanbul ignore next */ '';

        const productPriceElement = productRowElement.querySelector(
          'tbody > tr > td:nth-child(2) > table > tbody > tr > td:nth-child(6) > strong'
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
