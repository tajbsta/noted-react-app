import { api } from './api';

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

// Cancel Order
export const cancelOrder = async (userId, orderId) => {
  const axios = await api();
  const res = await axios.post(`/${userId}/orders/${orderId}/cancel`);
  return res.data.data;
};