import React from "react";
import { Redirect, Route } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";

function PrivateRoute({ component: Component, isLoggedIn, ...allProps }) {
  return (
    <Route
      {...allProps}
      render={(props) =>
        isLoggedIn ? (
          <AppLayout>
            <Component {...props} />
          </AppLayout>
        ) : (
          <Redirect to={{ pathname: "/join" }} />
        )
      }
    />
  );
}

export default PrivateRoute;
