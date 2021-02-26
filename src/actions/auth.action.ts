import { SIGN_IN } from "../constants/actions/auth";
import iAuth from "../models/iAuth";

export const login = ({ email, password, jwtToken }: iAuth) => ({
  type: SIGN_IN,
  auth: {
    email,
    password,
    jwtToken,
  },
});
