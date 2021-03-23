import React, { useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import qs from 'qs';
import { useHistory } from 'react-router-dom';
import { saveGoogleAuthCode } from '../utils/authApi';
import { getUserId } from '../utils/auth';

export default function Code() {
  const history = useHistory();

  const verifyUser = async () => {
    const isAuthRedirect = history.location.pathname.includes('/code/verify');

    try {
      const query = qs.parse(history.location.search, {
        ignoreQueryPrefix: true,
      });

      console.log({
        query,
      });

      if (isAuthRedirect) {
        if (!query.code) {
          throw new Error('Rejected by the user');
        }

        const user = await getUserId();

        // get the code and call POST /auth/google with code and user
        await saveGoogleAuthCode(query.code, user);
      }

      history.push('/dashboard');
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
    verifyUser();
  }, []);
  return (
    <div id='Code'>
      <Spinner animation='border' size='lg' className='spinner' />
    </div>
  );
}
