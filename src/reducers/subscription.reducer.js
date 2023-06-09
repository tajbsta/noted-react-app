import { SET_SUBSCRIPTION_TYPE } from '../constants/actions/subscription';

const initialState = {
  subscriptionType: '',
  pickups: 1,
};

function subscription(state = initialState, { type, data }) {
  switch (type) {
    case SET_SUBSCRIPTION_TYPE:
      return {
        ...state,
        subscriptionType: data,
      };

    default:
      return state;
  }
}

export default subscription;
