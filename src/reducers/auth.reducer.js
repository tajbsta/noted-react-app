import { SIGN_IN, SIGN_OUT } from "../constants/actions/auth";

const initialState = {
  email: "",
  password: "",
  jwtToken: "",
  loggedIn: false,
};

function auth(state = initialState, { type, auth }) {
  switch (type) {
    case SIGN_IN:
      return {
        ...state,
        ...auth,
      };
    case SIGN_OUT:
      return {};
    default:
      return state;
  }
}

export default auth;
