import {
  ADD_PRODUCT_IN_REVIEW,
  UPDATE_PRODUCTS_IN_REVIEW,
} from '../constants/actions/products';

export const updateProductsInReview = (products = []) => ({
  type: UPDATE_PRODUCTS_IN_REVIEW,
  data: products,
});

export const addProductInReview = (product) => ({
  type: ADD_PRODUCT_IN_REVIEW,
  data: product,
});
