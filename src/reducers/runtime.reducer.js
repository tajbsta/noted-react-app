import {
  CLEAR_SEARCH,
  SEARCH,
  UPDATE_FOR_DONATION,
  UPDATE_FOR_RETURN,
} from '../constants/actions/runtime';

const initialState = {
  search: '',
  forReturn: [],
  forDonation: [],
};

function runtime(state = initialState, { type, data }) {
  console.log(data);
  switch (type) {
    case SEARCH:
      return {
        ...state,
        search: data,
      };
    case CLEAR_SEARCH:
      return {
        ...state,
        search: '',
      };
    case UPDATE_FOR_RETURN:
      return {
        ...state,
        forReturn: [...data],
      };
    case UPDATE_FOR_DONATION:
      return {
        ...state,
        forDonation: [...data],
      };
    default:
      return state;
  }
}

export default runtime;
