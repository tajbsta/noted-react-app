import React, { useEffect } from "react";
import { Auth } from "aws-amplify";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../actions/auth.action";

export default function Code() {
  const history = useHistory();
  const dispatch = useDispatch();

  const verifyUser = async () => {
    try {
      const res = await Auth.currentSession();

      const accessToken = res.getAccessToken().getJwtToken();
      const idToken = res.getIdToken().getJwtToken();
      const refreshToken = res.getRefreshToken().getToken();
      const loginMethod = "Google";
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

      history.push("/request-permission");
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
  return <div></div>;
}
