import { SET_USER, SIGN_OUT, SIGN_UP } from '../constants/actions/auth';

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
