import React, { useEffect } from "react";
import { Spinner } from "react-bootstrap";
import qs from "qs";
import { Auth } from "aws-amplify";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../actions/auth.action";

export default function Code() {
  const history = useHistory();
  const dispatch = useDispatch();

  const verifyUser = async () => {
    try {
      const query = qs.parse(history.location.search, {
        ignoreQueryPrefix: true,
      });

      console.log({
        query,
      });

      const res = await Auth.currentSession();

      const accessToken = res.getAccessToken().getJwtToken();
      const idToken = res.getIdToken().getJwtToken();
      const refreshToken = res.getRefreshToken().getToken();
      const loginMethod = query.method || "google";
      const username = res.getAccessToken().decodePayload().username;

      console.log({
        accessToken,
        idToken,
        refreshToken,
        loginMethod,
        username,
      });

      dispatch(
        setUser({
          accessToken,
          idToken,
          refreshToken,
          loginMethod,
          username,
        })
      );

      if (query.code && history.location.pathname.includes("/code/verify")) {
        console.log({ code: query.code });
        history.push("/dashboard");
      } else {
        history.push("/request-permission");
      }
    } catch (error) {
      console.log(error);
      // No current user
      history.push("/");
    }
  };
  useEffect(() => {
    console.log("code");
    verifyUser();
  }, []);
  return (
    <div id="Code">
      <Spinner animation="border" size="lg" className="spinner" />
    </div>
  );
}
