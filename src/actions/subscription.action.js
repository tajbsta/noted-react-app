import { SET_SUBSCRIPTION_TYPE } from '../constants/actions/subscription';

export function setSubscriptionType(data) {
  return {
    type: SET_SUBSCRIPTION_TYPE,
    data,
  };
}
