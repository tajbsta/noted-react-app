import * as moment from 'moment';
import * as accounting from 'accounting';
import { decode as htmlDecode } from 'html-entities';

import * as log from '../logger';
import { productQuantityHelper, parseHtmlString } from '../helpers';
import { OrderData, RawProduct, IEmailPayload } from '../../models';

export default class Nordstrom {
  static async parse(code: string, payload: IEmailPayload): Promise<OrderData> {
    const doc = parseHtmlString(payload.decodedBody);
    const [orderRef, orderDate, rawProducts, orderRefShipping, orderDateShipping, rawProductsShipping] =
      await Promise.all([
        this.getOrderRef(doc),
        this.getOrderDate(doc),
        this.getProducts(doc),
        this.getOrderRefFromShippingFormat(doc),
        this.getOrderDateFromShippingFormat(doc),
        this.getProductsFromShippingFormat(doc)
      ]);

    const pickUpFormatInvalid =
      !orderRef || !orderDate || rawProducts.length === 0 || rawProducts.find((x) => !x.name || !x.price);
    const shippingFormatInvalid =
      !orderRefShipping ||
      !orderDateShipping ||
      rawProductsShipping.length === 0 ||
      rawProductsShipping.find((x) => !x.name || !x.price);

    if (!pickUpFormatInvalid) {
      return {
        vendor: code,
        emailId: payload.id,
        orderRef,
        orderDate,
        products: rawProducts
      };
    }

    if (!shippingFormatInvalid) {
      return {
        vendor: code,
        emailId: payload.id,
        orderRef: orderRefShipping,
        orderDate: orderDateShipping,
        products: rawProductsShipping
      };
    }

    throw new Error(
      `Lacking info parsed from the email: ${JSON.stringify({
        orderRef,
        orderDate,
        rawProducts,
        orderRefShipping,
        orderDateShipping,
        rawProductsShipping
      })}`
    );
  }

  static async getOrderRef(doc: Document): Promise<string | null> {
    try {
      const orderRefElement: any = doc.querySelector(
        'body > table > tbody > tr > td > table:nth-child(6) > tbody > tr > td > table:nth-child(3) > tbody > tr > td > table:nth-child(3) > tbody > tr > td > table > tbody > tr > th:nth-child(1) > table > tbody > tr > td:nth-child(1) > div > a'
      );

      const orderRef = orderRefElement ? orderRefElement.textContent.trim() : null;

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

      const orderDate = orderDateElement ? orderDateElement.textContent.trim() : '';

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

            const name = nameElement.textContent.trim();
            const description = descriptionElement.textContent.replace(',', '').trim();
            const productPriceElement: any = productElement.querySelector('td:nth-child(3) > div:nth-child(8)');

            const priceString = productPriceElement.textContent.split(':').pop().trim();
            const price = priceString ? accounting.unformat(priceString) : /* istanbul ignore next */ 0;

            const thumbnail = productElement.querySelector('td:first-child a img').getAttribute('src');

            let quantity = 1;

            const quantityElement: any = productElement.querySelector('td:nth-child(3) > div:nth-child(9) span');

            /* istanbul ignore next */
            if (quantityElement) {
              const quantityString: string = quantityElement.textContent.split(':').pop().trim();

              quantity = !!quantityString ? parseInt(quantityString) : /* istanbul ignore next */ 1;
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
            /* istanbul ignore next */
            log.info(error.message);
          }
        }
      });
      return products;
    } catch (error) {
      /* istanbul ignore next */
      return [];
    }
  }
  static async getOrderRefFromShippingFormat(doc: Document): Promise<string | null> {
    try {
      const orderRefElement = doc.querySelector(
        'body > table > tbody > tr > td > table:nth-child(6) > tbody > tr > td > table:nth-child(3) > tbody > tr > td > table:nth-child(3) > tbody > tr > td > table > tbody > tr > th:nth-child(1) > table > tbody > tr > td:nth-child(1) > div > a'
      );
      const orderRef = orderRefElement ? orderRefElement.textContent.trim() : null;
      return `${orderRef}`;
    } catch (error) {
      /* istanbul ignore next */
      return null;
    }
  }
  static async getOrderDateFromShippingFormat(doc: Document): Promise<number | null> {
    try {
      const orderDateElement = doc.querySelector(
        'body > table > tbody > tr > td > table:nth-child(6) > tbody > tr > td > table:nth-child(3) > tbody > tr > td > table:nth-child(3) > tbody > tr > td > table > tbody > tr > th:nth-child(1) > table > tbody > tr > td.block > div > a'
      );

      const orderDate = orderDateElement ? orderDateElement.textContent.trim() : null;

      return orderDate ? moment(orderDate, 'MM/DD/YYYY').startOf('day').valueOf() : null;
    } catch (error) {
      /* istanbul ignore next */
      return null;
    }
  }
  static async getProductsFromShippingFormat(doc: Document): Promise<RawProduct[]> {
    try {
      const initialContainer = doc.querySelector(
        'html > body > table > tbody > tr > td > table:nth-child(6) > tbody > tr > td > table:nth-child(4) > tbody > tr > td > table > tbody > tr > td'
      );

      const orderTableContainer = [];

      initialContainer.querySelectorAll('table').forEach((item) => {
        const hasThumbnail = item
          .querySelector('tbody > tr > td > table > tbody > tr > td:nth-child(1) > a > img')
          ?.getAttribute('src');
        const isProduct = !!hasThumbnail && item.querySelector('tbody > tr').childNodes.length === 9;
        if (isProduct) {
          orderTableContainer.push(item);
        }
      });

      let products = [];

      orderTableContainer.forEach((item) => {
        const productRowElement = item;
        const productNameElement = productRowElement.querySelector(
          'tbody > tr > td > table > tbody > tr > td:nth-child(3) > table > tbody > tr > td:nth-child(1) > div > a'
        );
        const productName = productNameElement.textContent.trim() || /* istanbul ignore next */ '';

        const productQuantityElement = productRowElement.querySelector(
          'tbody > tr > td > table > tbody > tr > td:nth-child(3) > table > tbody > tr > td:nth-child(2)'
        );

        /* istanbul ignore next */
        const productQuantity = productQuantityElement.textContent.split('Qty: ').pop().trim();
        const quantity = productQuantity ? parseInt(productQuantity, 10) : /* istanbul ignore next */ 1;

        const productThumbnailElement = productRowElement.querySelector(
          'tbody > tr > td > table > tbody > tr > td:nth-child(1) > a > img'
        );
        const productThumbnail = productThumbnailElement
          ? productThumbnailElement.getAttribute('src')
          : /* istanbul ignore next */ '';

        const productPriceElement = productRowElement.querySelector(
          'tbody > tr > td > table > tbody > tr > td:nth-child(3) > div:nth-child(6)'
        );
        const price = /* istanbul ignore next */ productPriceElement.textContent.split('$').pop().trim();
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
