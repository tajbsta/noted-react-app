import { SIGN_OUT } from '../constants/actions/auth';
import {
  UPDATE_SCRAPER_STATUS,
  UPDATE_SCRAPER_TYPE,
} from '../constants/actions/scraper';
import { NORMAL } from '../constants/scraper';

const initialState = {
  status: '',
  type: NORMAL,
};

function scraper(state = initialState, { type, data }) {
  switch (type) {
    case UPDATE_SCRAPER_STATUS:
      return {
        ...state,
        status: data,
      };
    case UPDATE_SCRAPER_TYPE:
      return {
        ...state,
        type: data,
      };
    case SIGN_OUT:
      return initialState;
    default:
      return state;
  }
}

export default scraper;
