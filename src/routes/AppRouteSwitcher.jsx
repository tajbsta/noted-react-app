import React from "react";
import { Switch, Redirect, Route } from "react-router-dom";
import routes from "../constants/routes";
import AppLayout from "../layouts/AppLayout";

function AppRouteSwitcher() {
  return (
    <Switch>
      {routes.map(({ path, component: Component }) => (
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
      ))}
      <Redirect to="/" />
    </Switch>
  );
}

export default AppRouteSwitcher;
