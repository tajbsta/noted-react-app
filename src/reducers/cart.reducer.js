import {
    SET_ITEMS
} from '../constants/actions/cart';

const initialState = {
    items: []
};

function cart(state = initialState, { type, data }) {
    switch (type) {
        case SET_ITEMS:
            return {
                items: data
            };
        default:
            return state;
    }
}

export default cart;
