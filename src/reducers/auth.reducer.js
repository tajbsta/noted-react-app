import { get } from 'lodash-es';
import {
  SET_USER,
  SIGN_OUT,
  SET_GOOGLE_AUTH_CODE,
  SUBMIT_ORDER,
  CLEAR_ORDER,
  UPDATE_ORDERS,
} from '../constants/actions/auth';

const initialState = {
  googleAuthCode: null,
  loginMethod: null,
  username: null,
  scheduledReturns: [],
  paymentMethods: [],
};

function auth(state = initialState, { type, data }) {
  switch (type) {
    case SET_USER:
      return {
        ...state,
        ...data,
      };
    case SET_GOOGLE_AUTH_CODE:
      return {
        ...state,
        googleAuthCode: data.googleAuthCode,
      };
    case SIGN_OUT:
      return initialState;
    case SUBMIT_ORDER:
      return {
        ...state,
        scheduledReturns: [...get(state, 'scheduledReturns', []), data],
      };
    case UPDATE_ORDERS:
      return {
        scheduledReturns: [...data],
      };
    case CLEAR_ORDER:
      return { ...state, scheduledReturns: [] };
    case 'SAVE_PAYMENT_TEMP':
      return { ...state, paymentMethods: [...state.paymentMethods, data] };
    case 'UPDATE_PAYMENT_TEMP':
      return { ...state, paymentMethods: [...data] };
    case 'CLEAR_PAYMENT_TEMP':
      return { ...state, paymentMethods: [] };
    default:
      return state;
  }
}

export default auth;
