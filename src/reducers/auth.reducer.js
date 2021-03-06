import { SET_USER, SIGN_OUT } from '../constants/actions/auth';

const initialState = {
  // email: "",
  // password: "",
  // jwtToken: "",
  // loggedIn: false,
  // user: null
  accessToken: null,
  idToken: null,
  refreshToken: null,
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
    case SIGN_OUT:
      return {};
    default:
      return state;
  }
}

export default auth;
