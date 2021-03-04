import { SET_USER, SIGN_UP } from "../constants/actions/auth";

export function setUser(data) {
  return {
    type: SET_USER,
    data
  }
}
