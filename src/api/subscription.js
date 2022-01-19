import { api } from './api';

export const subscriptionPlans = async () => {
  try {
    const axios = await api();

    const plans = await axios.get('/plans');
    return plans;
  } catch (error) {
    // console.log(error);
    return false;
  }
};

export const subscribeUser = async (values) => {
  try {
    const axios = await api();

    const plans = await axios.post('/subscribe', values);
    return plans;
  } catch (error) {
    // console.log(error);
    return false;
  }
};
