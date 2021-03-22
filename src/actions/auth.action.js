import { SET_USER, SIGN_OUT, SET_GOOGLE_AUTH_CODE } from '../constants/actions/auth';

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
      googleAuthCode: code
    }
  };
}
