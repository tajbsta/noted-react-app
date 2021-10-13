import {
  SET_USER,
  SIGN_OUT,
  SET_GOOGLE_AUTH_CODE,
  SUBMIT_ORDER,
  CLEAR_ORDER,
  UPDATE_ORDERS,
  SET_IS_NEWLY_SIGNED_UP,
} from '../constants/actions/auth';

export function setUser(data) {
  return {
    type: SET_USER,
    data,
  };
}

export function logout() {
  return {
    type: SIGN_OUT,
  };
}

export function unsetUser() {
  return {
    type: SIGN_OUT,
  };
}

export function setGoogleAuthCode(code) {
  return {
    type: SET_GOOGLE_AUTH_CODE,
    data: {
      googleAuthCode: code,
    },
  };
}

export function submitOrder(scheduledReturn) {
  return {
    type: SUBMIT_ORDER,
    data: scheduledReturn,
  };
}

export function clearOrder() {
  return {
    type: CLEAR_ORDER,
  };
}

export function updateOrders(scheduledReturns) {
  return {
    type: UPDATE_ORDERS,
    data: scheduledReturns,
  };
}

export function setIsNewlySignedUp(bool) {
  return {
    type: SET_IS_NEWLY_SIGNED_UP,
    data: bool,
  };
}

/**
 * TEMPORARY REALM
 */

export function savePaymentForm(data) {
  return {
    type: 'SAVE_PAYMENT_TEMP',
    data,
  };
}

export function updatePaymentForm(data) {
  return {
    type: 'UPDATE_PAYMENT_TEMP',
    data,
  };
}

export function clearPaymentForm() {
  return {
    type: 'CLEAR_PAYMENT_TEMP',
  };
}
