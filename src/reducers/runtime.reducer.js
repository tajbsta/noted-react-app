import { CLEAR_SEARCH, SEARCH } from '../constants/actions/runtime';

const initialState = {
  search: '',
};

function runtime(state = initialState, { type, data }) {
  switch (type) {
    case SEARCH:
      return {
        search: data,
      };
    case CLEAR_SEARCH:
      return {
        search: '',
      };
    default:
      return state;
  }
}

export default runtime;
