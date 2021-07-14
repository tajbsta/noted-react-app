import React, { useState, useEffect } from 'react';
import { Button, Col, Container, Row, Spinner } from 'react-bootstrap';
import AuthorizeImg from '../../assets/img/Authorize.svg';
import ScanningIcon from '../../assets/icons/Scanning.svg';
import CustomRow from '../../components/Row';
import { loadGoogleScript } from '../../library/loadGoogleScript';
import { addProductFromScraper, getVendors } from '../../api/productsApi';
import { showError } from '../../library/notifications.library';
import {
  getVendorsFromEmail,
  buildEmailQuery,
  getAccountMessages,
} from '../../library/scraper.library';
import moment from 'moment';
import { useRef } from 'react';
import * as _ from 'lodash/array';
import axios from 'axios';
import { AlertCircle } from 'react-feather';

const Authorize = ({ triggerScanNow }) => {
  return (
    <div id="AuthorizeUpdate">
      <Container className="main-body" fluid="lg">
        <Row md="2" className="text-left align-items-end">
          <Col xs="6" className="info">
            <h1 className="bold text-title">Everything is automatic</h1>
            <h4 className="text-noted">
              noted will scan your email inbox and find all of your online
              purchases and their return limits.
            </h4>
            <div className="text-subtitle">
              <h4 className="bold">In time?</h4>
              <h4>Get your cash back with one click</h4>
            </div>
            <div className="text-subtitle">
              <h4 className="bold">Too late?</h4>
              <h4>Declutter your home and donate to local charities</h4>
            </div>

            <h4 className="text-first">
              You first need to authorized noted to read your emails. Only bots
              will see the relevant emails and we will never sell or transfer
              any of your personal info to anyone.
            </h4>
            <h4 className="text-underline">
              <a
                href="https://notedreturns.com/privacy-policy"
                target="_blank"
                rel="noreferrer"
                className="sofia-pro"
              >
                Learn more about security
              </a>
            </h4>
            <Button
              onClick={triggerScanNow}
              className="btn btn-green btn-authorize"
            >
              Scan Now
            </Button>
          </Col>
          <Col xs="6">
            <div className="authorize-img">
              <img src={AuthorizeImg} />
            </div>
          </Col>
        </Row>
      </Container>
      {/* MOBILE VIEW */}
      <Container
        className="main-body-mobile"
        fluid="lg"
        style={{ marginTop: '2.5rem' }}
      >
        <Row md="2" className="text-left align-items-end">
          <Col xs="6">
            <div className="authorize-img-mobile">
              <img src={AuthorizeImg} />
            </div>
          </Col>
          <Col xs="6" className="info">
            <h1 className="bold text-title">Everything is automatic</h1>
            <h4 className="text-noted">
              noted will scan your email inbox and find all of your online
              purchases and their return limits.
            </h4>
            <div className="text-subtitle">
              <h4 className="bold">In time?</h4>
              <h4 className="subtitle">Get your cash back with one click</h4>
            </div>
            <div className="text-subtitle">
              <h4 className="bold">Too late?</h4>
              <h4 className="subtitle">
                Declutter your home and donate to local charities
              </h4>
            </div>

            <h4 className="text-first">
              You first need to authorized noted to read your emails. Only bots
              will see the relevant emails and we will never sell or transfer
              any of your personal info to anyone.
            </h4>
            <h4 className="text-underline">
              <a href="#" className="sofia-pro">
                Learn more about security
              </a>
            </h4>
            <Button
              onClick={triggerScanNow}
              className="btn btn-green btn-authorize"
            >
              Scan Now
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

const Scanning = () => {
  return (
    <div id="ScanningUpdate">
      <div className="card-body">
        <CustomRow marginBottom={2}>
          <div
            className="col-12"
            style={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <img src={ScanningIcon} />
          </div>
        </CustomRow>
        <p className="text-center sofia-pro noted-purple text-18 text-subtitle">
          Scan running...
        </p>
        <p className="small text-muted mb-1 text-center text-16 sofia-pro">
          Go have some coffee - we&apos;ll email ya when it&apos;s done!
        </p>
      </div>
    </div>
  );
};

/**STATUSES
 * 1. notAutorized - User has not initiated authorization
 * 2. isAuthorizing - Authorization in progress, Google Modal in the foreground
 * 3. isScraping - Authorization is complete and Scraping has been initiated
 * 4. scrapeComplete - Scraping is complete
 *  */

const DashboardPageInitial = () => {
  const [status, setStatus] = useState('');
  const gapi = useRef(null);

  /**TRIGGER SCAN NOW FOR USERS */
  const triggerScanNow = async () => {
    try {
      await gapi.current.auth2.getAuthInstance().signIn();
      setStatus('isAuthorizing');
    } catch (error) {
      if (error.error === 'popup_closed_by_user') {
        showError({
          message: (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <AlertCircle />
              <h4 className="ml-3 mb-0" style={{ lineHeight: '16px' }}>
                Error! Please reauthorise this scan
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
            <h4 className="ml-3 mb-0" style={{ lineHeight: '16px' }}>
              Error! An error occurred.
            </h4>
          </div>
        ),
      });
    }
  };

  const sendToBE = async (orders) => {
    try {
      const addProductResponse = await addProductFromScraper({ orders });

      console.log(addProductResponse);
    } catch (e) {
      console.log(e.response);
    }
  };

  const NORMAL = 'normal';
  const SCRAPEOLDER = 'scrapeOlder';
  /**
   * HANDLE EMAIl SCRAPING
   * @param {string} type - Scraper Types - normal, scrapeOlder
   * */
  const handleScraping = async (type) => {
    try {
      setStatus('isScraping');
      const vendors = await getVendors();

      const before =
        type === NORMAL
          ? moment().format('YYYY/MM/DD')
          : moment().subtract(90, 'days').format('YYYY/MM/DD');
      const after =
        type === NORMAL
          ? moment().subtract(90, 'days').format('YYYY/MM/DD')
          : moment().subtract(1, 'year').format('YYYY/MM/DD');

      const q = {
        // from: getVendorsFromEmail([{ from_emails: 'gabriella@deel.support' }]),
        from: getVendorsFromEmail(vendors),
        after,
        before,
      };

      //BUILD EMAIL QUERY
      const emailQuery = buildEmailQuery(q);
      const emails = await getAccountMessages(emailQuery, gapi);

      if (emails.length <= 0) {
        //HANDLE NO EMAIL AVAILABLE FOR SCRAPING
        throw Error('No Email Available for Scraping');
      }

      //CURRENTLY USING DATA FROM S3 TO TEST
      //TODO- E2E testing with noted@notedreturns.com
      const TEST_DATA_URL =
        'https://noted-scrape-test.s3-us-west-2.amazonaws.com/NORDSTROM.json';

      const response = await axios.get(TEST_DATA_URL);
      const nord = await response.data;
      const data = await window.notedScraper(vendors, [nord]);

      await sendToBE(data);
    } catch (error) {
      switch (error.message) {
        case 'No Email Available for Scraping':
          showError({
            message: (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <AlertCircle />
                <h4 className="ml-3 mb-0" style={{ lineHeight: '16px' }}>
                  Error! No Email Available for Scraping
                </h4>
              </div>
            ),
          });
          break;
        default:
          showError({
            message: (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <AlertCircle />
                <h4 className="ml-3 mb-0" style={{ lineHeight: '16px' }}>
                  Error! An error occurred
                </h4>
              </div>
            ),
          });
      }
    }
  };

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

      // Listen for sign-in state changes.
      gapi.current.auth2.getAuthInstance().isSignedIn.listen((success) => {
        if (success) {
          handleScraping(NORMAL);
        }
      });
    } catch (error) {
      console.log('NEW ERROR', error);
    }
  };

  useEffect(() => {
    setStatus('notAuthorized');
  }, []);

  //INITIALIZE GOOGLE API
  useEffect(() => {
    window.onGoogleScriptLoad = () => {
      gapi.current = window.gapi;
      gapi.current.load('client:auth2', initClient);
    };

    loadGoogleScript();
  }, []);

  return (
    <div id="DashboardInitial">
      {status === 'notAuthorized' && (
        <Authorize triggerScanNow={triggerScanNow} />
      )}
      {status === 'isScraping' && <Scanning></Scanning>}
      {(status === 'isAuthorizing' || status === '') && (
        <div>
          <Spinner size="lg" color="#570097" animation="border" />
        </div>
      )}
    </div>
  );
};

export default DashboardPageInitial;
