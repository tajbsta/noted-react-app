import React, { useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import qs from 'qs';
import { Auth } from 'aws-amplify';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, setGoogleAuthCode } from '../actions/auth.action';

export default function Code() {
  const history = useHistory();
  const dispatch = useDispatch();

  const verifyUser = async () => {
    const isAuthRedirect = history.location.pathname.includes('/code/verify');

    try {
      const query = qs.parse(history.location.search, {
        ignoreQueryPrefix: true,
      });

      console.log({
        query,
      });

      // const res = await Auth.currentSession();

      // const loginMethod = query.method || "google";
      // const username = res.getAccessToken().decodePayload().username;

      // console.log({
      //   loginMethod,
      //   username,
      // });

      // dispatch(
      //   setUser({
      //     loginMethod,
      //     username,
      //   })
      // );

      if (isAuthRedirect) {
        // await scraperStart(query.code);
        dispatch(setGoogleAuthCode(query.code));
        history.push('/scanning');
      } else {
        history.push('/request-permission');
      }
    } catch (error) {
      console.log(error);

      if (isAuthRedirect) {
        history.push('/request-permission?auth=error');
      } else {
        // No current user
        history.push('/');
      }
    }
  };
  useEffect(() => {
    console.log('code');
    verifyUser();
  }, []);
  return (
    <div id='Code'>
      <Spinner animation='border' size='lg' className='spinner' />
    </div>
  );
}
