import {
  UPDATE_FOR_DONATION,
  CLEAR_SEARCH,
  SEARCH,
  UPDATE_FOR_RETURN,
  UPDATE_LAST_CALL,
  UPDATE_RETURN_ADDRESS,
  CLEAR_RETURN_ADDRESS,
  UPDATE_PAYMENT_INFO,
  CLEAR_PAYMENT_INFO,
  UPDATE_PICKUP_DETAILS,
  CLEAR_PICKUP_DETAILS,
  CLEAR_FORM,
  UPDATE_CURRENT_ORDER,
  CLEAR_CURRENT_ORDER,
} from '../constants/actions/runtime';

export const searchScans = (query) => ({
  type: SEARCH,
  data: query,
});

export const clearSearchQuery = () => ({
  type: CLEAR_SEARCH,
});

export const updateForReturn = ({ scans }) => ({
  type: UPDATE_FOR_RETURN,
  data: scans,
});

export const updateForDonation = ({ scans }) => ({
  type: UPDATE_FOR_DONATION,
  data: scans,
});

export const updateLastCall = ({ scans }) => ({
  type: UPDATE_LAST_CALL,
  data: scans,
});

export const updateReturnAdddress = ({ formData }) => ({
  type: UPDATE_RETURN_ADDRESS,
  data: formData,
});

export const clearReturnAddress = () => ({
  type: CLEAR_RETURN_ADDRESS,
});

export const updatePaymentInfo = ({ formData }) => ({
  type: UPDATE_PAYMENT_INFO,
  data: formData,
});

export const clearPaymentInfo = () => ({
  type: CLEAR_PAYMENT_INFO,
});

export const updatePickUpDetails = ({ formData }) => ({
  type: UPDATE_PICKUP_DETAILS,
  data: formData,
});

export const clearPickUpDetails = () => ({
  type: CLEAR_PICKUP_DETAILS,
});

export const clearForm = () => ({
  type: CLEAR_FORM,
});

export const updateCurrentOrder = (data) => ({
  type: UPDATE_CURRENT_ORDER,
  data,
});

export const clearCurrentOrder = () => ({
  type: CLEAR_CURRENT_ORDER,
});
