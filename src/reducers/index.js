import { combineReducers } from 'redux';
import auth from '../reducers/auth.reducer';
import scans from '../reducers/scans.reducer';
import runtime from '../reducers/runtime.reducer';
import cart from '../reducers/cart.reducer';
import products from '../reducers/products.reducer';

export default combineReducers({
  auth,
  scans,
  runtime,
  cart,
  products,
});
