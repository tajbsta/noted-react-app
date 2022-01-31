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

export const subscribeUserToRuby = async (isExistingUser) => {
  try {
    const axios = await api();
    const { userId } = await getUserSession();

    const subscriptionResponse = await axios.post(
      `${userId}/subscription/ruby`,
      {
        planName: 'Ruby',
        existingUser: isExistingUser,
      }
    );
    return subscriptionResponse;
  } catch (error) {
    // console.log(error);
    return false;
  }
};

export const pickUpRefill = async () => {
  try {
    const axios = await api();
    const { userId } = await getUserSession();

    const refillResponse = await axios.post(`${userId}/subscription/refill`, {
      plan_name: 'Refill',
    });
    return refillResponse;
  } catch (error) {
    // console.log(error);
    return false;
  }
};

export const subscriptionUpgrade = async (values) => {
  try {
    const axios = await api();
    const { userId } = await getUserSession();

    const upgradeResponse = await axios.post(
      `${userId}/subscription/upgrade`,
      values
    );
    return upgradeResponse;
  } catch (error) {
    // console.log(error);
    return false;
  }
};
