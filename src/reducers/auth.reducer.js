import { get } from 'lodash-es';
import {
  SET_USER,
  SIGN_OUT,
  SET_GOOGLE_AUTH_CODE,
  SUBMIT_ORDER,
  CLEAR_ORDER,
  UPDATE_ORDERS,
  SET_IS_NEWLY_SIGNED_UP,
  SET_INFO_ADDED,
} from '../constants/actions/auth';

const initialState = {
  googleAuthCode: null,
  loginMethod: null,
  username: null,
  scheduledReturns: [],
  paymentMethods: [],
  isNewlySignedUp: false,
  infoAdded: false,
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
    case SET_IS_NEWLY_SIGNED_UP:
      return {
        ...state,
        isNewlySignedUp: data,
      };
    case SET_INFO_ADDED:
      return {
        ...state,
        infoAdded: data,
      };
    default:
      return state;
  }
}

export default auth;
