import axios from 'axios';
import { getUserSession } from './auth';

const { REACT_APP_API_URI } = process.env;

export const api = async () => {
  const { accessToken } = await getUserSession();
  return axios.create({
    baseURL: REACT_APP_API_URI,
    headers: { Authorization: `Bearer ${accessToken}` },
  });
};
