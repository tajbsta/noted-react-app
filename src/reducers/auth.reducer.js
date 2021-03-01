import { SIGN_IN, SIGN_OUT, SIGN_UP } from "../constants/actions/auth";

const initialState = {
  // email: "",
  // password: "",
  // jwtToken: "",
  // loggedIn: false,
  user: null
};

function auth(state = initialState, { type, data: user }) {
  switch (type) {
    case SIGN_IN:
      return {
        ...state,
        user,
      };
    case SIGN_UP:
      return {
        ...state,
        user,
      };
    case SIGN_OUT:
      return {
        user: null
      };
    default:
      return state;
  }
}

export default auth;
