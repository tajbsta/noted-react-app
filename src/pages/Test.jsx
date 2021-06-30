import React, { useEffect, useState } from 'react';
import { Spinner, Button } from 'react-bootstrap';
import qs from 'qs';
import { useHistory } from 'react-router-dom';
import { saveGoogleAuthCode } from '../api/authApi';
import { getUserId } from '../api/auth';
import {
  SERVER_ERROR,
  GOOGLE_AUTH_ACCESS_DENIED,
} from '../constants/errors/errorCodes';

import { showError } from '../library/notifications.library';
import { AlertCircle } from 'react-feather';
import { loadGoogleScript } from '../library/loadGoogleScript';

export default function Code() {
  const history = useHistory();

  const onClickAuthorizeButton = () => {
    if (window.gapi.auth2.getAuthInstance().isSignedIn.get()) {

      listLabels()
    } else {
      window.gapi.auth2.getAuthInstance().signIn();

    }
  }

  const initClient = async () => {
    try {
      await window.gapi.client.init({
        clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"],
        scope: 'https://www.googleapis.com/auth/gmail.readonly'
      })

      const isSignedIn = window.gapi.auth2.getAuthInstance().isSignedIn.get()

      if (isSignedIn) {
        window.gapi.auth2.getAuthInstance().signOut()
      }

      // Listen for sign-in state changes.
      window.gapi.auth2.getAuthInstance().isSignedIn.listen((success) => {
        if (success) {
          listLabels()
        }
      })
    } catch (error) {
      console.log(JSON.stringify(error, null, 2));
    }

    
  }

  const listLabels = async () => {
    const response = await window.gapi.client.gmail.users.messages.list({
      userId: 'me',
      maxResults: 10,
      q: '(from: blog@zapier.com) OR (from: gabriella@deel.support)'
    })

    const emails = response.result.messages;

    const batch = window.gapi.client.newBatch();

    emails.forEach(email => {
      const getEmail = window.gapi.client.gmail.users.messages.get({
        userId: 'me',
        id: email.id
      });
      batch.add(getEmail);
    });

    const res = await batch
      console.log({ res })
    
    const token = await window.gapi.client.getToken()
    console.log({ token })

  }

  useEffect(() => {
    // Define window.onGoogleScriptLoad
    window.onGoogleScriptLoad = () => {
      window.gapi.load('client:auth2', initClient);
    }

    loadGoogleScript()
  }, []);
  return (
    <div id='Code'>
      <Button
        onClick={onClickAuthorizeButton}
        disabled={!!window.gapi}
        className='btn btn-green btn-authorize'
      >
        Authorize noted
      </Button>

      <Spinner animation='border' size='lg' className='spinner' />
    </div>
  );
}
