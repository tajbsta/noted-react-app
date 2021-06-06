import {
  ADD_PRODUCT_IN_REVIEW,
  UPDATE_PRODUCTS_IN_REVIEW,
} from '../constants/actions/products';

const initialState = {
  items: [],
  newDonations: [],
};

function products(state = initialState, { type, data }) {
  switch (type) {
    case UPDATE_PRODUCTS_IN_REVIEW:
      return {
        items: data,
      };
    case ADD_PRODUCT_IN_REVIEW:
      return { items: [...state.items, { ...data, status: 'pending' }] };
    default:
      return state;
  }
}

export default products;
