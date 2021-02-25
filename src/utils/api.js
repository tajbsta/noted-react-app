import axios from "axios";
import qs from "qs";

const { REACT_APP_API_URI } = process.env;

const instance = axios.create({ baseURL: REACT_APP_API_URI });

instance.defaults.paramsSerializer = (params) => qs.stringify(params);

export function attachToken(token) {
  instance.defaults.headers.common.Authorization = `Bearer ${token}`;
}

export function detachToken() {
  delete instance.defaults.headers.common.Authorization;
}

export default instance;
