/* eslint-disable react/react-in-jsx-scope */
import { Suspense } from 'react';
import { PersistGate } from 'redux-persist/integration/react';
import { BrowserRouter, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import './assets/scss/theme.scss';
import './assets/scss/App.scss';
import 'react-toastify/dist/ReactToastify.css';

/*
IMPORTS ROUTES
*/
import AppRouteSwitcher from './routes/AppRouteSwitcher';
import configureStore from './store';

import ReactPixel from 'react-facebook-pixel';

const options = {
  autoConfig: true, // set pixel's autoConfig. More info: https://developers.facebook.com/docs/facebook-pixel/advanced/
  debug: false, // enable logs
};
ReactPixel.init('590385872010513', options);

const { persistor, store } = configureStore();

function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <div className='App'>
          <BrowserRouter>
            <Suspense fallback={<div className='loading' />}>
              <Route render={(props) => <AppRouteSwitcher {...props} />} />
            </Suspense>
          </BrowserRouter>
        </div>
      </PersistGate>
    </Provider>
  );
}

export default App;
