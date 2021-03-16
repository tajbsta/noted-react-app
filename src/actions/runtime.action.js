import {
  UPDATE_FOR_DONATION,
  CLEAR_SEARCH,
  SEARCH,
  UPDATE_FOR_RETURN,
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
