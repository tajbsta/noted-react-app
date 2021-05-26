import { SET_ITEMS } from '../constants/actions/cart';

export function setCartItems(items) {
  return {
    type: SET_ITEMS,
    data: items,
  };
}
