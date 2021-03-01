/* eslint-disable react/react-in-jsx-scope */
import { Suspense } from "react";
import { PersistGate } from "redux-persist/integration/react";
import { BrowserRouter, Route } from "react-router-dom";
import { Provider } from "react-redux";
import "./assets/scss/theme.scss";
import "./assets/scss/App.scss";

/*
IMPORTS ROUTES
*/
import AppRouteSwitcher from "./routes/AppRouteSwitcher";
import configureStore from "./store";

const { persistor, store } = configureStore();

function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <div className="App">
          <BrowserRouter>
            <Suspense fallback={<div className="loading" />}>
              <Route render={(props) => <AppRouteSwitcher {...props} />} />
            </Suspense>
          </BrowserRouter>
        </div>
      </PersistGate>
    </Provider>
  );
}

export default App;
