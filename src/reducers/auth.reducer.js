import { SET_USER, SIGN_OUT, SET_GOOGLE_AUTH_CODE } from '../constants/actions/auth';

const initialState = {
  googleAuthCode: null,
  loginMethod: null,
  username: null,
};

function auth(state = initialState, { type, data }) {
  console.log(type);
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
    default:
      return state;
  }
}

export default auth;
