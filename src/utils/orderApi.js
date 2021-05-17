import { api } from './api';
import { getUserSession } from './auth';

//  Get available time slots for pickup date
export const getPickupSlots = async (userId, date) => {
  const axios = await api();
  const res = await axios.post(`/${userId}/orders/pickup-slots`, {
    pickupDate: date,
  });
  return res.data.data;
};

// Create Order
export const createOrder = async (userId, order) => {
  const axios = await api();
  const res = await axios.post(`/${userId}/orders`, order);
  return res.data.data;
};

// Get Orders
export const getOrders = async (userId, type, size = 5, nextToken = null) => {
  const axios = await api();

  let url = `/${userId}/orders?type=${type}&size=${size}`;

  if (nextToken) {
    url += `&lastEvaluatedKey=${nextToken}`;
  }

  const res = await axios.get(url);

  return res.data.data;
};

// Get Order
export const getOrder = async (orderId) => {
  const axios = await api();
  const { userId } = await getUserSession();

  const res = await axios.get(`/${userId}/orders/${orderId}`);

  return res.data.data;
};

// Cancel Order
export const cancelOrder = async (userId, orderId) => {
  const axios = await api();
  await axios.post(`/${userId}/orders/${orderId}/cancel`);
};
