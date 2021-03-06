import { SET_USER, SIGN_OUT } from "../constants/actions/auth";

export function setUser(data) {
  return {
    type: SET_USER,
    data
  }
}

export function unsetUser() {
  return {
    type: SIGN_OUT,
  }
}
