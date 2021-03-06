import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';

function PublicRoute({ component: Component, isLoggedIn, ...allProps }) {
  return (
    <Route
      {...allProps}
      render={(props) =>
        isLoggedIn ? (
          <Redirect to={{ pathname: '/dashboard' }} />
        ) : (
          <AppLayout>
            <Component {...props} />
          </AppLayout>
        )
      }
    />
  );
}

export default PublicRoute;
