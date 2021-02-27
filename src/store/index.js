import { applyMiddleware, createStore, compose } from "redux";
import thunk from "redux-thunk";
import logger from "redux-logger";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";

import rootReducer from "../reducers/index";

const { NODE_ENV } = process.env;

const middlewares = [thunk];
let reduxDevTools = null;

if (NODE_ENV === "development") {
  reduxDevTools =
    // eslint-disable-next-line no-underscore-dangle
    window.__REDUX_DEVTOOLS_EXTENSION__ &&
    // eslint-disable-next-line no-underscore-dangle
    window.__REDUX_DEVTOOLS_EXTENSION__();
  middlewares.push(logger);
}

const persistConfig = {
  key: "root",
  storage,
  stateReconciler: autoMergeLevel2,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default (customInitialState) => {
  let params = applyMiddleware(...middlewares);

  // include chrome redux extension on development
  if (NODE_ENV === "development" && reduxDevTools) {
    params = compose(applyMiddleware(...middlewares), reduxDevTools);
  }

  const state = customInitialState;
  const store = createStore(persistedReducer, state, params);
  const persistor = persistStore(store);

  if (module.hot) {
    // eslint-disable-next-line global-require
    const nextRootReducer = require("../reducers/index").default;
    module.hot.accept("../reducers/index", () => {
      persistReducer(persistConfig, nextRootReducer);
    });
  }

  return { store, persistor };
};
