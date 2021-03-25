import {
  SET_USER,
  SIGN_OUT,
  SET_GOOGLE_AUTH_CODE,
  SUBMIT_ORDER,
  CLEAR_ORDER,
  UPDATE_ORDERS,
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
