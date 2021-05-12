import { api } from './api';

//  Get available time slots for pickup date
export const getPickupSlots = async (userId, date) => {
  const axios = await api();
  const res = await axios.post(`/${userId}/orders/pickup-slots`, {
    pickupDate: date,
  });
  return res.data.data;
};

export const createOrder = async (userId, order) => {
  const axios = await api();
  const res = await axios.post(`/${userId}/orders`, {
    orderItems: order.orderItems,
    fullName: order.fullName,
    state: order.state,
    zipcode: order.zipCode,
    addressLine1: order.line1,
    addressLine2: order.line2,
    city: order.city,
    phone: order.phoneNumber,
    pickupInstructions: order.instructions,
    pickupDate: order.date,
    pickupTime: order.timeSlot
  });
  return res.data.data;
};