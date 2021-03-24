import React, { useEffect } from 'react';
import { Route, useHistory } from 'react-router-dom';
import AppLayout from './AppLayout';
import { isAuthenticated } from '../utils/auth';

function PrivateLayout({ component: Component, ...allProps }) {
  const history = useHistory();

  useEffect(() => {
    (async () => {
      const isLoggedIn = await isAuthenticated();

      // console.log({
      //   isLoggedIn,
      //   path: allProps.path,
      // });
      if (!isLoggedIn) {
        history.push('/login');
      }
    })();
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

export default PrivateLayout;
