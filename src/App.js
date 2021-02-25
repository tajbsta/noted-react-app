/* eslint-disable react/react-in-jsx-scope */
import { Suspense } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { Provider } from "react-redux";
import "./assets/scss/theme.scss";
import "./assets/scss/App.scss";

/*
IMPORTS ROUTES
*/
import AppRouteSwitcher from "./routes/AppRouteSwitcher";
import store from "./store";

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <BrowserRouter>
          <Suspense fallback={<div className="loading" />}>
            <Route render={(props) => <AppRouteSwitcher {...props} />} />
          </Suspense>
        </BrowserRouter>
      </div>
    </Provider>
  );
}

export default App;
