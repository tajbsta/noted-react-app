import { CLEAR_SEARCH, SEARCH } from '../constants/actions/runtime';

export function searchScans(query) {
  return {
    type: SEARCH,
    data: query,
  };
}

export function clearSearchQuery() {
  return {
    type: CLEAR_SEARCH,
  };
}
