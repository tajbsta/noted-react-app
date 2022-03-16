import * as accounting from 'accounting';
import { parseHtmlString, productQuantityHelper } from '../helpers';
import { decode as htmlDecode } from 'html-entities';
import { OrderData, RawProduct, IEmailPayload } from '../../models';

export default class VictoriaSecret {
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
        'html > body > table > tbody > tr > td > div > table > tbody > tr > td > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(4) > td > table > tbody > tr > td:nth-child(2) > a'
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
        'html > body > table > tbody > tr > td > div > table > tbody > tr > td > table > tbody'
      );
      const orderTableContainer = [];

      initialContainer.querySelectorAll('tr').forEach((item) => {
        const hasProductName = item.querySelector('td > table > tbody > tr:nth-child(1) > td > b');
        const isTableElment = item.querySelector('td > table')?.tagName === 'TABLE';
        const isProduct = !!hasProductName && isTableElment;

        if (isProduct) {
          orderTableContainer.push(item);
        }
      });

      let products = [];

      orderTableContainer.forEach((item) => {
        const productRowElement = item;
        const productNameElement = productRowElement.querySelector('td > table > tbody > tr:nth-child(1) > td > b');

        const productName = productNameElement.textContent.trim() || /* istanbul ignore next */ '';
        const description = productRowElement
          .querySelector('td > table > tbody > tr:nth-child(1) > td:nth-child(2)')
          .textContent.trim();

        const productQuantityElement = productRowElement.querySelector(
          'td > table > tbody > tr:nth-child(3) > td > table > tbody > tr:nth-child(3) > td:nth-child(2)'
        );

        /* istanbul ignore next */
        const productQuantity = productQuantityElement.textContent.trim();
        const quantity = productQuantity ? parseInt(productQuantity, 10) : /* istanbul ignore next */ 1;

        const productThumbnail = '';

        const productPriceElement = productRowElement.querySelector(
          'td > table > tbody > tr:nth-child(5) > td > span:nth-child(1)'
        );
        const price = /* istanbul ignore next */ productPriceElement.innerHTML.trim();
        const productPrice = productPriceElement ? accounting.unformat(price) : /* istanbul ignore next */ 0;

        products = products.concat(
          productQuantityHelper({
            name: `${productName} - ${description}`,
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
