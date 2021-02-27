import React from "react";
import { Switch, Redirect, Route } from "react-router-dom";
import routes from "../constants/routes";
import AppLayout from "../layouts/AppLayout";
import PrivateRoute from "./PrivateRoute";

function AppRouteSwitcher() {
  return (
    <Switch>
      {routes.map(({ path, component: Component, isSecured }) =>
        isSecured ? (
          <PrivateRoute
            key={path}
            path={path}
            exact
            component={Component}
            isLoggedIn={true}
          />
        ) : (
          <Route
            key={path}
            path={path}
            exact
            render={(props) => (
              <AppLayout>
                <Component {...props} />
              </AppLayout>
            )}
          />
        )
      )}
      <Redirect to="/" />
    </Switch>
  );
}

export default AppRouteSwitcher;
