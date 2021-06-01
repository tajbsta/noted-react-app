import {
    SET_ITEMS,
    CLEAR_CART,
    SET_PICKUP_ADDRESS, SET_PAYMENT, SET_PICKUP_DETAILS
} from '../constants/actions/cart';

const initialState = {
    items: [],
    pickupAddress: {},
    payment: {},
    pickupDetails: {}
};

function cart(state = initialState, { type, data }) {
    switch (type) {
        case SET_ITEMS:
            return {
                ...state,
                items: data
            };
        case CLEAR_CART:
            return {
                ...initialState,
            };
        case SET_PICKUP_ADDRESS:
            return {
                ...state,
                pickupAddress: data
            };
        case SET_PAYMENT:
            return {
                ...state,
                payment: data
            };
        case SET_PICKUP_DETAILS:
            return {
                ...state,
                pickupDetails: data
            };
        default:
            return state;
    }
}

export default cart;
