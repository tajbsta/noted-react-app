import React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';

import publicRoutes from '../constants/publicRoutes';
import privateRoutes from '../constants/privateRoutes';
import PrivateLayout from '../layouts/PrivateLayout';
import PublicLayout from '../layouts/PublicLayout';
import Test from '../pages/Test';

function AppRouteSwitcher() {
    return (
        <Switch>
            <Route path="/test" render={(props) => <Test {...props} />} />
            {publicRoutes.map(({ path, component: Component }) => (
                <PublicLayout
                    key={path}
                    path={path}
                    exact
                    component={Component}
                />
            ))}
            {privateRoutes.map(({ path, component: Component }) => (
                <PrivateLayout
                    key={path}
                    path={path}
                    exact
                    component={Component}
                />
            ))}
            <Redirect to="/dashboard" />
        </Switch>
    );
}

export default AppRouteSwitcher;
