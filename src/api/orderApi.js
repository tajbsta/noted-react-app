import axiosLib from 'axios';
import { api } from './api';
import { getUserSession } from './auth';

var getPickupSlotsCancelTokenSource;

//  Get available time slots for pickup date
export const getPickupSlots = async (userId, date) => {
  const axios = await api();

  if (getPickupSlotsCancelTokenSource) {
    getPickupSlotsCancelTokenSource.cancel();
  }

  getPickupSlotsCancelTokenSource = axiosLib.CancelToken.source();

  const res = await axios.post(`/${userId}/orders/pickup-slots`, {
    pickupDate: date,
  }, { cancelToken: getPickupSlotsCancelTokenSource.token });
  return res.data.data;
};

// Get Pricing
export const getOrderPricing = async (productIds, orderId) => {
  const axios = await api();
  const { userId } = await getUserSession();
  const res = await axios.post(`/${userId}/orders/payment/pricing`, { productIds, orderId });
  return res.data.data;
};

// Pre-Validate Order
export const prevalidateOrder = async (order) => {
  const axios = await api();
  const { userId } = await getUserSession();
  const res = await axios.post(`/${userId}/orders/validate`, order);
  return res.data.data
};

// Create Order
export const createOrder = async (order) => {
  const axios = await api();
  const { userId } = await getUserSession();

  const res = await axios.post(`/${userId}/orders`, order);
  return res.data.data;
};

// Get Orders
export const getOrders = async (userId, type, nextToken = null) => {
  const axios = await api();

  let url = `/${userId}/orders?type=${type}&size=5`;

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

// Get Order Counts (History)
export const getOrderHistoryCounts = async () => {
  const axios = await api();
  const { userId } = await getUserSession();

  const res = await axios.get(`/${userId}/orders/total/history`);

  return res.data.data;
};

// Get Order Counts (Active)
export const getActiveOrderCounts = async () => {
  const axios = await api();
  const { userId } = await getUserSession();

  const res = await axios.get(`/${userId}/orders/total/active`);

  return res.data.data;
};

// Cancel Order
export const cancelOrder = async (userId, orderId, billing = null) => {
  const axios = await api();
  await axios.post(`/${userId}/orders/${orderId}/cancel`, { billing });
};

// Get Stripe publishable key
export const getPublicKey = async () => {
  const axios = await api();
  const { userId } = await getUserSession();

  const res = await axios.get(`/${userId}/payment/config`);

  return res.data.data;
};

// Save user payment method
export const savePaymentMethod = async (paymentMethodId) => {
  const axios = await api();
  const { userId } = await getUserSession();

  await axios.post(`/${userId}/payment/save-payment-method`, { paymentMethodId });

};

// Get Stripe publishable key
export const getUserPaymentMethods = async () => {
  const axios = await api();
  const { userId } = await getUserSession();

  const res = await axios.get(`/${userId}/payment/payment-methods`);

  return res.data.data;
};

// Delete payment method
export const deletePaymentMethod = async (paymentMethodId) => {
  const axios = await api();
  const { userId } = await getUserSession();

  await axios.delete(`/${userId}/payment/payment-methods/${paymentMethodId}`);

};

/**
 * Create payment intent to process payment
 * @price - refer to constant price.js
 */
export const createPaymentIntent = async (pricing, orderId) => {
  const axios = await api();
  const { userId } = await getUserSession();

  const url = `/${userId}/orders/payment/intent/${pricing}`


  const res = await axios.post(url, { orderId });

  return res.data.data;
};

// Update Order
export const updateOrder = async (userId, orderId, order) => {
  const axios = await api();

  const res = await axios.patch(`/${userId}/orders/${orderId}`, order);
  return res.data.data;
};