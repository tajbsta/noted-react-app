import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import Amplify, { Auth, Hub } from "aws-amplify";
import authListener from "./utils/authListener";

Amplify.configure({
  Auth: {
    region: process.env.REACT_APP_REGION,
    userPoolId: process.env.REACT_APP_USER_POOL_ID,
    userPoolWebClientId: process.env.REACT_APP_USER_POOL_CLIENT_ID,
    // identityPoolId: 'us-west-2:5a1fb8b6-28f9-44ec-9e1d-fee6c1d7f0cd',
    // identityPoolRegion: process.env.REACT_APP_REGION,
    mandatorySignIn: false,
    oauth: {
      domain: process.env.REACT_APP_OAUTH_DOMAIN,
      scope: ["email", "profile", "openid"],
      redirectSignIn: process.env.REACT_APP_OAUTH_REDIRECT_SIGN_IN,
      redirectSignOut: process.env.REACT_APP_OAUTH_REDIRECT_SIGN_OUT,
      responseType: "code",
    },
  },
  // aws_appsync_graphqlEndpoint: process.env.REACT_APP_APPSYNC,
  // aws_appsync_authenticationType: process.env.REACT_APPSYNC_AUTHENTICATION_TYPE,
  // aws_appsync_region: process.env.REACT_APP_REGION,
  // aws_appsync_apiKey: process.env.REACT_APP_APPSYNC_APIKEY
});

// Hub.listen('auth', authListener);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
