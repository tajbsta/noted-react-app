import {
  ADD_PRODUCT_IN_REVIEW,
  ADD_TO_NEW_DONATIONS,
  CLEAR_NEW_DONATIONS,
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
    case ADD_TO_NEW_DONATIONS:
      return {
        items: [...state.items],
        newDonations: [...state.newDonations, data],
      };
    case CLEAR_NEW_DONATIONS:
      return {
        items: [...state.items],
        newDonations: [],
      };
    default:
      return state;
  }
}

export default products;
