import axios from "axios";
import { getUserSession } from "./auth";

// import qs from "qs";

const { REACT_APP_API_URI } = process.env;

// const instance = axios.create({ baseURL: REACT_APP_API_URI });

// instance.defaults.paramsSerializer = (params) => qs.stringify(params);

// export function attachToken(token) {
//   instance.defaults.headers.common.Authorization = `Bearer ${token}`;
// }

// export function detachToken() {
//   delete instance.defaults.headers.common.Authorization;
// }

export const api = async () => {
  const user = await getUserSession();

  return axios.create({
    baseURL: REACT_APP_API_URI, headers: { 'Authorization': `Bearer ${user.idToken}` }
  })
}