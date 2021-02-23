import React, { lazy } from "react";
import { Switch, Redirect, Route } from "react-router-dom";

const LandingPage = lazy(() => import("../pages/LandingPage"));
const RegisterPage = lazy(() => import("../pages/RegisterPage"));
const DashboardPage = lazy(() => import("../pages/DasboardPage"));
const AuthorizePage = lazy(() => import("../pages/AuthorizePage"));

function AppRouteSwitcher() {
  return (
    <Switch>
      <Route path="/" exact render={(props) => <LandingPage {...props} />} />
      <Route
        path="/join"
        exact
        render={(props) => <RegisterPage {...props} />}
      />
      <Route
        path="/request-permission"
        exact
        render={(props) => <AuthorizePage {...props} />}
      />
      <Route
        path="/dashboard"
        exact
        render={(props) => <DashboardPage {...props} />}
      />
      <Redirect to="/" />
    </Switch>
  );
}

export default AppRouteSwitcher;
