import React, { useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import qs from 'qs';
import { useHistory } from 'react-router-dom';
import { saveGoogleAuthCode } from '../api/authApi';
import { getUserId } from '../api/auth';
import {
  SERVER_ERROR,
  GOOGLE_AUTH_ACCESS_DENIED,
} from '../constants/errors/errorCodes';
import { scrollToTop } from '../utils/window';

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
              ? error.response.data.details
              : SERVER_ERROR;

          // console.log({
          //   error: error.response,
          //   errorCode,
          // });

          history.push(`/request-permission?error=${errorCode}`);
          return;
        }
      }

      history.push('/dashboard');
    } catch (error) {
      // TODO: ERROR HANDLING
      history.push('/');
    }
  };
  useEffect(() => {
    scrollToTop();
    verifyUser();
  }, []);
  return (
    <div id='Code'>
      <Spinner animation='border' size='lg' className='spinner' />
    </div>
  );
}
