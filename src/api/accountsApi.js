import { api } from './api';
import axiosLib from 'axios';

const BASE_URL = process.env.REACT_APP_API_URI;

// Get user accounts
export const getAccounts = async (userId) => {
  const axios = await api();

  const res = await axios.get(`/${userId}/accounts`);
  return res.data.data;
};

export const deleteAccount = async (userId, accountId) => {
  const axios = await api();

  await axios.delete(`/${userId}/accounts/${accountId}`);
};

export const createUnsupportedUser = async (data) => {
  const res = await axiosLib.post(`${BASE_URL}/unsupported-signup`, data);

  return res.data.data;
};
