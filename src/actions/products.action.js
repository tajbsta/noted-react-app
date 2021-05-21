import {
  ADD_PRODUCT_IN_REVIEW,
  ADD_TO_NEW_DONATIONS,
  CLEAR_NEW_DONATIONS,
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

export const addToNewDonations = (product) => ({
  type: ADD_TO_NEW_DONATIONS,
  data: product,
});

export const clearNewDonations = () => ({
  type: CLEAR_NEW_DONATIONS,
});
