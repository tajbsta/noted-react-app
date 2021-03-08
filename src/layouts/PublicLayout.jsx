import { get, isEmpty, isNull } from 'lodash';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Route, useHistory } from 'react-router-dom';
import AppLayout from './AppLayout';
import publicRoutes from '../constants/publicRoutes';

function PublicLayout({ component: Component, ...allProps }) {
  const username = useSelector((state) => get(state, 'auth.username', ''));

  const {
    location: { pathname },
    push,
  } = useHistory();

  const isLoggedIn = !isEmpty(username) && !isNull(username);

  useEffect(() => {
    console.log();
    if (isLoggedIn && publicRoutes.map(({ path }) => path).includes(pathname)) {
      /**
       * SHOULD REDIRECT TO DASHBOARD IF LOGGED IN
       *  - EVERYTHING ADDED TO THE PUBLIC ROUTES WILL BE 'middlewared' BY THIS USE EFFECT CALL
       */
      push('/dashboard');
    }
  }, []);

  return (
    <Route
      {...allProps}
      render={(props) => (
        <AppLayout>
          <Component {...props} />
        </AppLayout>
      )}
    />
  );
}

export default PublicLayout;
