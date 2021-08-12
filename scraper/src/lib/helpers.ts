import { RawProduct } from '../models';

export const cleanRawBody = (body: string): string => {
  return body.replace(/-/g, '+').replace(/_/g, '/');
};

/* istanbul ignore next */
export const decodeRawBody = (body: string): string => {
  return window.atob(body);
};

export const productQuantityHelper = (product: RawProduct): RawProduct[] => {
  const products = [];

  for (let x = 0; x < product.quantity; x++) {
    const qnty = x + 1;
    const qntyLabel = product.quantity > 1 ? ` (${qnty})` : '';

    products.push({
      name: `${product.name}${qntyLabel}` || '',
      thumbnail: product.thumbnail,
      price: product.price
    });
  }

  return products;
};

/* istanbul ignore next */
export const parseHtmlString = (body: string): Document => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(body, 'text/html');
  return doc;
};
