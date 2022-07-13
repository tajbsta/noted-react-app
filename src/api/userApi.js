import { api } from './api';
import axiosLib from 'axios';
import { getUserSession } from './auth';

export const saveUserDataToMailchimp = async (userData) => {
  const axios = await api();
  const { userId } = await getUserSession();

  return (await axios.post(`/${userId}/save-to-mailchimp`, userData)).data;
};
