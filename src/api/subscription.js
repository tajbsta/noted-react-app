import { api } from './api';
import { getUserSession } from './auth';

export const subscriptionPlans = async () => {
  try {
    const axios = await api();
    const { userId } = await getUserSession();

    const plans = await axios.get(`${userId}/subscription/plans`);
    return plans;
  } catch (error) {
    // console.log(error);
    return false;
  }
};

export const subscribeUser = async (values) => {
  try {
    const axios = await api();
    const { userId } = await getUserSession();

    const subscriptionResponse = await axios.post(
      `${userId}/subscribe`,
      values
    );
    return subscriptionResponse;
  } catch (error) {
    // console.log(error);
    return false;
  }
};

export const subscriptionHistory = async () => {
  try {
    const axios = await api();
    const { userId } = await getUserSession();

    const history = await axios.get(`${userId}/subscription/history`);
    return history.data;
  } catch (error) {
    // console.log(error);
    return false;
  }
};
