import { SIGN_IN, SIGN_UP } from "../constants/actions/auth";

export function login(data) {
  return {
    type: SIGN_UP,
    data
  }
}

export function signUp(data) {
  return {
    type: SIGN_UP,
    data
  }
}
