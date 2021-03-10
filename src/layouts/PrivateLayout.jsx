import { get, isEmpty, isNull } from "lodash";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Redirect, Route, useHistory } from "react-router-dom";
import AppLayout from "./AppLayout";

function PrivateLayout({ component: Component, ...allProps }) {
  const history = useHistory();
  const username = useSelector(({ auth: { username } }) => username);

  useEffect(() => {
    const isLoggedIn = !isEmpty(username) && !isNull(username);
    if (!isLoggedIn) {
      history.push("/join");
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

export default PrivateLayout;
