import React, { useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import qs from 'qs';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setGoogleAuthCode } from '../actions/auth.action';

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

      if (isAuthRedirect) {
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
