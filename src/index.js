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
    mandatorySignIn: false,
    oauth: {
      domain: process.env.REACT_APP_OAUTH_DOMAIN,
      scope: ["email", "profile", "openid"],
      redirectSignIn: process.env.REACT_APP_OAUTH_REDIRECT_SIGN_IN,
      redirectSignOut: process.env.REACT_APP_OAUTH_REDIRECT_SIGN_OUT,
      responseType: "code",
    },
  },
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
