import { SET_ITEMS, CLEAR_CART, SET_PICKUP_ADDRESS, SET_PAYMENT, SET_PICKUP_DETAILS } from '../constants/actions/cart';

export function setCartItems(items) {
  return {
    type: SET_ITEMS,
    data: items,
  };
}

export const clearCart = () => ({
  type: CLEAR_CART,
});

export const setPickupAddress = (data) => ({
  type: SET_PICKUP_ADDRESS,
  data

});

export const setPayment = (data) => ({
  type: SET_PAYMENT,
  data
});

export const setPickupDetails = (data) => ({
  type: SET_PICKUP_DETAILS,
  data
});