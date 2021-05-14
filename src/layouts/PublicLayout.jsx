import React from 'react';
import { Route } from 'react-router-dom';
import AppLayout from './AppLayout';

function PublicLayout({ component: Component, ...allProps }) {
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
