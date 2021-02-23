import React, { lazy } from "react";
import { Switch, Redirect, Route } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import DashboardPage from "../pages/Dashboard";

const LandingPage = lazy(() => import("../pages/LandingPage"));
const RegisterPage = lazy(() => import("../pages/RegisterPage"));

function AppRouteSwitcher() {
  return (
    <>
      <AppLayout>
        <Switch>
          <Route
            path="/"
            exact
            render={(props) => <LandingPage {...props} />}
          />
          <Route
            path="/join"
            exact
            render={(props) => <RegisterPage {...props} />}
          />
          <Route
            path="/dashboard"
            exact
            render={(props) => <DashboardPage {...props} />}
          />
          <Redirect to="/" />
        </Switch>
      </AppLayout>
    </>
  );
}

export default AppRouteSwitcher;
