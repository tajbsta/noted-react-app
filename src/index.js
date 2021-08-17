import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Amplify from 'aws-amplify';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';

const version = JSON.stringify(require('../package.json').version);

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    release: 'noted-react-app@' + version,
    environment: process.env.REACT_APP_ENV,
    dsn: process.env.REACT_APP_SENTRY_URL,
    integrations: [new Integrations.BrowserTracing()],
    autoSessionTracking: false,
    tracesSampleRate: 0,
  });
}

Amplify.configure({
  Auth: {
    region: process.env.REACT_APP_REGION,
    userPoolId: process.env.REACT_APP_USER_POOL_ID,
    userPoolWebClientId: process.env.REACT_APP_USER_POOL_CLIENT_ID,
    mandatorySignIn: false,
    oauth: {
      domain: process.env.REACT_APP_OAUTH_DOMAIN,
      scope: ['email', 'profile', 'openid', 'aws.cognito.signin.user.admin'],
      redirectSignIn: process.env.REACT_APP_OAUTH_REDIRECT_SIGN_IN,
      redirectSignOut: process.env.REACT_APP_OAUTH_REDIRECT_SIGN_OUT,
      responseType: 'code',
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
