import * as moment from 'moment';
import * as accounting from 'accounting';
import { decode as htmlDecode } from 'html-entities';

import * as log from '../logger';
import { productQuantityHelper } from '../helpers';
import { OrderData, RawProduct, IEmailPayload } from '../../models';

export default class Nordstrom {
  static async parse(code: string, payload: IEmailPayload): Promise<OrderData> {
    const parser = new DOMParser();
    const doc = parser.parseFromString(payload.decodedBody, 'text/html');

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
      order_ref: orderRef,
      order_date: orderDate,
      products: rawProducts
    };
  }

  static async getOrderRef(doc: Document): Promise<string | null> {
    try {
      const orderRefElement: any = doc.querySelector(
        'body > table > tbody > tr > td > table:nth-child(6) > tbody > tr > td > table:nth-child(3) > tbody > tr > td > table:nth-child(3) > tbody > tr > td > table > tbody > tr > th:nth-child(1) > table > tbody > tr > td:nth-child(1) > div > a'
      );

      const orderRef = orderRefElement ? orderRefElement.innerText.trim() : null;

      return orderRef;
    } catch (error) {
      /* istanbul ignore next */
      return null;
    }
  }

  static async getOrderDate(doc: Document): Promise<number | null> {
    try {
      const orderDateElement: any = doc.querySelector(
        'body > table > tbody > tr > td > table:nth-child(6) > tbody > tr > td > table:nth-child(3) > tbody > tr > td > table:nth-child(3) > tbody > tr > td > table > tbody > tr > th:nth-child(1) > table > tbody > tr > td.block > div > a'
      );

      const orderDate = orderDateElement ? orderDateElement.innerText.trim() : '';

      return !!orderDate ? moment(orderDate, 'MM/DD/YYYY').startOf('day').valueOf() : null;
    } catch (error) {
      /* istanbul ignore next */
      return null;
    }
  }

  static async getProducts(doc: Document): Promise<RawProduct[]> {
    try {
      let products = [];

      const productTable = doc.querySelectorAll(
        'body > table > tbody > tr > td > table:nth-child(6) > tbody > tr > td > table:nth-child(4) > tbody > tr > td > table > tbody > tr > td > table'
      );

      productTable.forEach((productElement) => {
        const isProduct = productElement.querySelector('tr td:first-child a img');

        if (productElement.localName === 'table' && isProduct) {
          try {
            const nameElement: any = productElement.querySelector(
              'td:nth-child(3) > table > tbody > tr > td:nth-child(1) > div > a'
            );
            const descriptionElement: any = productElement.querySelector(
              'td:nth-child(3) > div:nth-child(5) > span:nth-child(1)'
            );

            const name = nameElement.innerText.trim();
            const description = descriptionElement.innerText.trim();

            const productPriceElement: any = productElement.querySelector('td:nth-child(3) > div:nth-child(8)');

            const priceString = productPriceElement.innerText.split(':').pop().trim();
            const price = priceString ? accounting.unformat(priceString) : 0;

            const thumbnail = productElement.querySelector('td:first-child a img').getAttribute('src');

            let quantity = 1;

            const quantityElement: any = productElement.querySelector('td:nth-child(3) > div:nth-child(9) span');

            if (quantityElement) {
              const quantityString: string = quantityElement.innerText.split(':').pop().trim();

              quantity = !!quantityString ? parseInt(quantityString) : 1;
            }

            products = products.concat(
              productQuantityHelper({
                name: htmlDecode(`${name} - ${description}`),
                price,
                thumbnail,
                quantity
              })
            );
          } catch (error) {
            log.info(error.message);
          }
        }
      });
      return products;
    } catch (error) {
      return [];
    }
  }
}
