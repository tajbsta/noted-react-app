import React from 'react';
import { Switch, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

import routes from '../constants/routes';
import AppLayout from '../layouts/AppLayout';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

function AppRouteSwitcher() {
  const username = useSelector(({ auth: { username } }) => username);

  return (
    <Switch>
      {routes.map(({ path, component: Component, isSecured }) =>
        isSecured ? (
          <PrivateRoute
            key={path}
            path={path}
            exact
            component={Component}
            isLoggedIn={!!username}
          />
        ) : (
          <PublicRoute
            key={path}
            path={path}
            exact
            component={Component}
            isLoggedIn={!!username}
          />
        )
      )}
      <Redirect to='/' />
    </Switch>
  );
}

export default AppRouteSwitcher;
