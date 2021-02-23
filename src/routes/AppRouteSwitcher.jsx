import React, { lazy } from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';

const LandingPage = lazy(() => import('../pages/LandingPage'));
const RegisterPage = lazy(() => import('../pages/RegisterPage'));

function AppRouteSwitcher() {
  return (
    <Switch>
      <Route path="/" exact render={(props) => <LandingPage {...props} />} />
      <Route path="/join" exact render={(props) => <RegisterPage {...props} />} />
      <Redirect to="/" />
    </Switch>
  );
}

export default AppRouteSwitcher;
