/* eslint-disable react/react-in-jsx-scope */
import React, { useEffect } from 'react';
import { Suspense } from 'react';
import { PersistGate } from 'redux-persist/integration/react';
import { Route, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import './assets/scss/theme.scss';
import './assets/scss/App.scss';
import 'react-toastify/dist/ReactToastify.css';
import ReactPixel from 'react-facebook-pixel';
import ReactGA from 'react-ga';

/*
IMPORTS ROUTES
*/
import AppRouteSwitcher from './routes/AppRouteSwitcher';
import configureStore from './store';

const options = {
  autoConfig: true, // set pixel's autoConfig. More info: https://developers.facebook.com/docs/facebook-pixel/advanced/
  debug: false, // enable logs
};

ReactPixel.init('590385872010513', options);
ReactGA.initialize('259926228');

const { persistor, store } = configureStore();

function App() {
  const location = useLocation();

  useEffect(() => {
    ReactGA.pageview(location.pathname);
  }, [location]);

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <div className='App'>
          <Suspense fallback={<div className='loading' />}>
            <Route render={(props) => <AppRouteSwitcher {...props} />} />
          </Suspense>
        </div>
      </PersistGate>
    </Provider>
  );
}

export default App;
