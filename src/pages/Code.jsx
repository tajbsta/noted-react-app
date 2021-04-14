import React, { useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import qs from 'qs';
import { useHistory } from 'react-router-dom';
import { saveGoogleAuthCode } from '../utils/authApi';
import { getUserId } from '../utils/auth';
import {
  ACCOUNT_ALREADY_EXIST,
  INVALID_REQUEST,
  SERVER_ERROR,
  GOOGLE_AUTH_ACCESS_DENIED,
} from '../constants/errors/errorCodes';

export default function Code() {
  const history = useHistory();

  const verifyUser = async () => {
    const isAuthRedirect = history.location.pathname.includes('/code/verify');

    try {
      const query = qs.parse(history.location.search, {
        ignoreQueryPrefix: true,
      });

      // console.log({
      //   query,
      // });

      if (isAuthRedirect) {
        if (!query.code) {
          history.push(
            `/request-permission?error=${GOOGLE_AUTH_ACCESS_DENIED}`
          );
          return;
        }

        const user = await getUserId();

        // get the code and call POST /auth/google with code and user
        try {
          await saveGoogleAuthCode(query.code, user);
        } catch (error) {
          const errorCode =
            error.response && error.response.data
              ? error.response.data.description
              : SERVER_ERROR;

          console.log({
            error: error.response,
            errorCode,
          });

          history.push(`/request-permission?error=${errorCode}`);
          return;
        }
      }

      history.push('/dashboard');
    } catch (error) {
      console.log(error);

      // if (isAuthRedirect) {
      //   history.push('/request-permission?auth=error');
      // } else {
      // No current user
      history.push('/');
      // }
    }
  };
  useEffect(() => {
    verifyUser();
  }, []);
  return (
    <div id='Code'>
      <Spinner animation='border' size='lg' className='spinner' />
    </div>
  );
}
