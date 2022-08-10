import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Col, Container, Row, Spinner } from 'react-bootstrap';
import AuthorizeImg from '../assets/img/Authorize.svg';
import $ from 'jquery';
import { getGoogleOauthUrl } from '../api/authApi';
import qs from 'qs';
import { scraperGmailErrors } from '../library/errors.library';
import { get, isEmpty } from 'lodash';
import { timeout } from '../utils/time';
import { scrollToTop } from '../utils/window';
import { showError } from '../library/notifications.library';
import { AlertCircle } from 'react-feather';
import * as Sentry from '@sentry/react';
import { loadGoogleScript } from '../library/loadGoogleScript';
import { createAccount } from '../api/accountsApi';
import { getUser } from '../api/auth';

export default function AuthorizePage() {
  const history = useHistory();

  const [authUrl, setAuthUrl] = useState(null);
  const [errMsg, setErrMsg] = useState(null);
  const [loading, setLoading] = useState(null);
  const gapi = useRef(null);

  //INITIALIZE GOOGLE API
  useEffect(() => {
    window.onGoogleScriptLoad = () => {
      gapi.current = window.gapi;
      gapi.current.load('client:auth2', initClient);
    };
    loadGoogleScript();
  }, []);

  useEffect(() => {
    gapi.current = window.gapi;
  });

  /**INITIALIZE CLIENT TO USE GAPI */
  const initClient = async () => {
    try {
      await gapi.current.client.init({
        clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        discoveryDocs: [
          'https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest',
        ],
        scope: 'https://www.googleapis.com/auth/gmail.readonly',
      });

      const isSignedIn = gapi.current.auth2.getAuthInstance().isSignedIn.get();

      if (isSignedIn) {
        gapi.current.auth2.getAuthInstance().signOut();
      }
    } catch (error) {
      Sentry.captureException(error);
    }
  };

  const authorizeNow = async () => {
    try {
      setLoading(true);
      const isSignedIn = gapi.current.auth2.getAuthInstance().isSignedIn.get();
      if (isSignedIn) {
        gapi.current.auth2.getAuthInstance().signOut();
      }
      await window.gapi.auth2.getAuthInstance().signIn({ prompt: 'consent' });
      const accountEmail = await gapi.current.auth2
        .getAuthInstance()
        .currentUser.get()
        .getBasicProfile()
        .getEmail();
      const user = await getUser();
      await createAccount(user.sub, accountEmail);
      const urlParams = new URLSearchParams(window.location.search);
      const isMailJustAuthorized = urlParams.get('authorized') === 'true';
      if (isMailJustAuthorized) {
        localStorage.setItem('authorizeNewEmail', JSON.stringify(true));
      }
      setLoading(false);
      window.location.href = authUrl;
    } catch (error) {
      setLoading(false);
      if (error.error === 'popup_closed_by_user') {
        showError({
          message: (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <AlertCircle />
              <h4 className='ml-3 mb-0' style={{ lineHeight: '16px' }}>
                Error! Please reauthorise this scan
              </h4>
            </div>
          ),
        });
        return;
      }
      if (error.error === 'access_denied') {
        showError({
          message: (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <AlertCircle />
              <h4 className='ml-3 mb-0' style={{ lineHeight: '16px' }}>
                Please re-authorise this scan and grant adequate permissions to
                noted.
              </h4>
            </div>
          ),
        });
        return;
      }
      showError({
        message: (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <AlertCircle />
            <h4 className='ml-3 mb-0' style={{ lineHeight: '16px' }}>
              Error! An error occurred. Try refreshing the page.
            </h4>
          </div>
        ),
      });

      Sentry.captureException(error);
    }
  };

  const getAuthUrl = async () => {
    try {
      const url = await getGoogleOauthUrl();

      setAuthUrl(url);
    } catch (error) {
      showError('Requesting Authentication URL failed');
    }
  };

  //   const openAuthUrl = () => {
  //     const urlParams = new URLSearchParams(window.location.search);
  //     const isMailJustAuthorized = urlParams.get('authorized') === 'true';
  //     if (isMailJustAuthorized) {
  //         localStorage.setItem('authorizeNewEmail', JSON.stringify(true));
  //     }
  //     window.location.href = authUrl;
  //   };

  useEffect(() => {
    scrollToTop();
    // setErrMsg(null);

    const query = qs.parse(history.location.search, {
      ignoreQueryPrefix: true,
    });

    if (query.error) {
      showError({
        message: get(
          scraperGmailErrors.find(({ code }) => code === query.error),
          'message',
          'An error occurred'
        ),
      });
    }

    // console.log({ query });
    // console.log({ errMsg });
    // getAuthUrl();
  }, []);

  useEffect(() => {
    const platform = window.navigator.platform;
    const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];

    if (windowsPlatforms.indexOf(platform) !== -1) {
      // Windows 10 Chrome
      $('.btn-authorize').css('padding-top', '12px');
    }
  }, []);

  const manageDisplayError = async () => {
    if (!isEmpty(errMsg)) {
      await timeout({ duration: 5000 });
      setErrMsg(null);
    }
  };

  useEffect(() => {
    manageDisplayError();
  }, [errMsg]);

  return (
    <div id='AuthorizeUpdate'>
      <Container className='main-body' fluid='lg'>
        <Row md='2' className='text-left align-items-center'>
          <Col xs='6' className='info'>
            <h1 className='bold text-title'>Everything is automatic</h1>
            <h4 className='text-noted'>
              noted will scan your email inbox and find all of your online
              purchases and their return limits.
            </h4>
            <div className='text-subtitle'>
              <h4 className='bold'>In time?</h4>
              <h4>Get your cash back with one click</h4>
            </div>
            <div className='text-subtitle'>
              <h4 className='bold'>Too late?</h4>
              <h4>Declutter your home and donate to local charities</h4>
            </div>

            <h4 className='text-first'>
              You first need to authorize noted to read your emails. Only bots
              will see the relevant emails and we will never sell or transfer
              any of your personal info to anyone.
            </h4>
            <h4 className='text-second'>
              Furthermore, noted&apos;s use and transfer to any other app of
              information received from Google APIs will adhere to{' '}
              <a
                href='https://developers.google.com/terms/api-services-user-data-policy'
                target='_blank'
                rel='noreferrer'
                className='sofia-pro text-underline'
              >
                Google API Services User Data Policy
              </a>{' '}
              , including the Limited Use requirements.
            </h4>
            <h4 className='text-underline'>
              <a
                href='https://notedreturns.com/privacy-policy'
                target='_blank'
                rel='noreferrer'
                className='sofia-pro'
              >
                Learn more about security
              </a>
            </h4>
            <Button
              onClick={authorizeNow}
              className='btn btn-green btn-authorize'
            >
              {loading && (
                <Spinner
                  animation='border'
                  size='sm'
                  className='spinner btn-spinner mr-2'
                />
              )}
              Authorize Now
            </Button>
          </Col>
          <Col xs='6'>
            <div className='authorize-img'>
              <img src={AuthorizeImg} />
            </div>
          </Col>
        </Row>
      </Container>
      {/* MOBILE VIEW */}
      <Container
        className='main-body-mobile'
        fluid='lg'
        style={{ marginTop: '2.5rem' }}
      >
        <Row md='2' className='text-left align-items-end'>
          <Col xs='6'>
            <div className='authorize-img-mobile'>
              <img src={AuthorizeImg} />
            </div>
          </Col>
          <Col xs='6' className='info'>
            <h1 className='bold text-title'>Everything is automatic</h1>
            <h4 className='text-noted'>
              noted will scan your email inbox and find all of your online
              purchases and their return limits.
            </h4>
            <div className='text-subtitle'>
              <h4 className='bold'>In time?</h4>
              <h4 className='subtitle'>Get your cash back with one click</h4>
            </div>
            <div className='text-subtitle'>
              <h4 className='bold'>Too late?</h4>
              <h4 className='subtitle'>
                Declutter your home and donate to local charities
              </h4>
            </div>

            <h4 className='text-first'>
              You first need to authorized noted to read your emails. Only bots
              will see the relevant emails and we will never sell or transfer
              any of your personal info to anyone.
            </h4>
            <h4 className='text-second'>
              Furthermore, noted&apos;s use and transfer to any other app of
              information received from Google APIs will adhere to{' '}
              <a
                href='https://developers.google.com/terms/api-services-user-data-policy'
                target='_blank'
                rel='noreferrer'
                className='sofia-pro text-underline'
              >
                Google API Services User Data Policy
              </a>{' '}
              , including the Limited Use requirements.
            </h4>
            <h4 className='text-underline'>
              <a href='#' className='sofia-pro'>
                Learn more about security
              </a>
            </h4>
            <Button
              onClick={authorizeNow}
              className='btn btn-green btn-authorize'
            >
              {loading && (
                <Spinner
                  animation='border'
                  size='sm'
                  className='spinner btn-spinner mr-2'
                />
              )}
              Authorize Now
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
