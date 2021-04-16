import {
  CLEAR_CURRENT_ORDER,
  CLEAR_FORM,
  CLEAR_PAYMENT_INFO,
  CLEAR_PICKUP_DETAILS,
  CLEAR_RETURN_ADDRESS,
  CLEAR_SEARCH,
  MOUNT_PRODUCT_IN_EDIT,
  SEARCH,
  UNMOUNT_PRODUCT_IN_EDIT,
  UPDATE_CURRENT_ORDER,
  UPDATE_FOR_DONATION,
  UPDATE_FOR_RETURN,
  UPDATE_LAST_CALL,
  UPDATE_PAYMENT_INFO,
  UPDATE_PICKUP_DETAILS,
  UPDATE_RETURN_ADDRESS,
} from '../constants/actions/runtime';

const initialState = {
  search: '',
  lastCall: [],
  forReturn: [],
  forDonation: [],
  inEdit: {},
  form: {
    address: {},
    payment: {},
    details: {},
  },
  orderInMemory: {},
  profileImage: '',
};

function runtime(state = initialState, { type, data }) {
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
    case UPDATE_LAST_CALL:
      return {
        ...state,
        lastCall: [...data],
      };
    case UPDATE_RETURN_ADDRESS:
      return {
        ...state,
        form: {
          ...state.form,
          address: { ...data },
        },
      };
    case UPDATE_PAYMENT_INFO:
      return {
        ...state,
        form: {
          ...state.form,
          payment: { ...data },
        },
      };
    case UPDATE_PICKUP_DETAILS:
      return {
        ...state,
        form: {
          ...state.form,
          details: { ...data },
        },
      };
    case CLEAR_RETURN_ADDRESS:
      return {
        ...state,
        form: {
          ...state.form,
          address: {},
        },
      };
    case CLEAR_PAYMENT_INFO:
      return {
        ...state,
        form: {
          ...state.form,
          payment: {},
        },
      };
    case CLEAR_PICKUP_DETAILS:
      return {
        ...state,
        form: {
          ...state.form,
          details: {},
        },
      };
    case CLEAR_FORM:
      return {
        ...state,
        form: {},
      };
    case UPDATE_CURRENT_ORDER:
      return {
        ...state,
        orderInMemory: data,
      };
    case CLEAR_CURRENT_ORDER:
      return {
        ...state,
        orderInMemory: {},
      };
    case MOUNT_PRODUCT_IN_EDIT:
      return { ...state, inEdit: { ...data } };
    case UNMOUNT_PRODUCT_IN_EDIT:
      return {
        ...state,
        inEdit: {},
      };
    case 'UPDATE_PROFILE_PICTURE_TEMP':
      return { ...state, profileImage: data };
    default:
      return state;
  }
}

export default runtime;
