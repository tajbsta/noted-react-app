import { combineReducers } from "redux";
import auth from "../reducers/auth.reducer";
import scans from "../reducers/scans.reducer";
export default combineReducers({
  auth,
  scans,
});
