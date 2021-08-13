import React, { useEffect, Fragment } from 'react';
import { Button, Col, Container, Row, Spinner } from 'react-bootstrap';
import AuthorizeImg from '../../assets/img/Authorize.svg';
import ScanningIcon from '../../assets/icons/Scanning.svg';
import CustomRow from '../../components/Row';
import { loadGoogleScript } from '../../library/loadGoogleScript';
import {
  addProductFromScraper,
  getProducts,
  getVendors,
} from '../../api/productsApi';
import ACCOUNT_PROVIDERS from '../../constants/accountProviders';
import { showError, showSuccess } from '../../library/notifications.library';
import {
  getVendorsFromEmail,
  buildEmailQuery,
  getAccountMessages,
} from '../../library/scraper.library';
import moment from 'moment';
import { useRef } from 'react';
import { AlertCircle } from 'react-feather';
import {
  ISAUTHORIZING,
  ISSCRAPING,
  NORMAL,
  NOTAUTHORIZED,
  SCRAPECOMPLETE,
  SCRAPEOLDER,
  SCRAPECANCEL,
} from '../../constants/scraper';
import DashboardPage from './DashboardPage';
import { useSelector, useDispatch } from 'react-redux';
import {
  updateScraperStatus,
  updateScraperType,
} from '../../actions/scraper.action';
import { ToastContainer } from 'react-toastify';
import Topnav from '../../components/Navbar/Navbar';
import { updateUserAttributes } from '../../api/auth';

const Authorize = ({ triggerScanNow }) => {
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
              onClick={triggerScanNow}
              className='btn btn-green btn-authorize'
            >
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
              onClick={() => triggerScanNow(NORMAL)}
              className='btn btn-green btn-authorize'
            >
              Authorize Now
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

const Scanning = () => {
  return (
    <div id='ScanningUpdate'>
      <div className='card-body'>
        <CustomRow marginBottom={2}>
          <div
            className='col-12'
            style={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <img src={ScanningIcon} />
          </div>
        </CustomRow>
        <p className='text-center sofia-pro noted-purple text-18 text-subtitle'>
          Scan running...
        </p>
        <p className='small text-muted mb-1 text-center text-16 sofia-pro'>
          Go have some coffee - we&apos;ll email ya when it&apos;s done!
        </p>
      </div>
    </div>
  );
};

const DashboardPageInitial = () => {
  const { status, type } = useSelector((state) => state.scraper);
  const dispatch = useDispatch();
  const gapi = useRef(null);
  const typeRef = useRef(type);

  /**TRIGGER SCAN NOW FOR USERS */
  const triggerScanNow = async (type) => {
    dispatch(updateScraperType(type));
    try {
      const isSignedIn = gapi.current.auth2.getAuthInstance().isSignedIn.get();
      if (isSignedIn) {
        gapi.current.auth2.getAuthInstance().signOut();
      }
      const result = await gapi.current.auth2.getAuthInstance().signIn();
      dispatch(updateScraperStatus(ISAUTHORIZING));
    } catch (error) {
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
    }
  };

  const sendToBE = async (orders) => {
    try {
      const isScrapeRegular = typeRef.current === NORMAL;
      const isScrapeOlder = typeRef.current === SCRAPEOLDER;
      const accountEmail = await gapi.current.auth2
        .getAuthInstance()
        .currentUser.get()
        .getBasicProfile()
        .getEmail();
      const provider = ACCOUNT_PROVIDERS.GMAIL;
      const addProductData = {
        orders,
        isScrapeRegular,
        isScrapeOlder,
        accountEmail,
        provider,
      };
      const { data } = await addProductFromScraper(addProductData);
      if (data.status === 'success') {
        dispatch(updateScraperStatus(SCRAPECOMPLETE));
        if (typeRef.current === SCRAPEOLDER) {
          await updateUserAttributes({ 'custom:scan_older_done': '1' });
        }
        showSuccess({
          message: (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <AlertCircle />
              <h4 className='ml-3 mb-0' style={{ lineHeight: '16px' }}>
                Scrape successful.
              </h4>
            </div>
          ),
        });
      }
    } catch (e) {
      console.log(e.response);
    }
  };

  /**
   * HANDLE EMAIl SCRAPING
   * @param {string} type - Scraper Types - normal, scrapeOlder
   * */
  const handleScraping = async (type) => {
    try {
      dispatch(updateScraperStatus(ISSCRAPING));
      const vendors = await getVendors(['supported=true']);

      let before;
      let after;

      if (type === NORMAL) {
        after = moment().startOf('day').subtract(3, 'months');
        before = moment().startOf('day').add(1, 'd');
      } else {
        const startDate = moment().startOf('day').subtract(3, 'months');
        after = startDate.clone().subtract(1, 'years');
        before = startDate;
      }

      const q = {
        from: getVendorsFromEmail(vendors),
        after: after.format('YYYY/MM/DD'),
        before: before.format('YYYY/MM/DD'),
      };

      //BUILD EMAIL QUERY
      const emailQuery = buildEmailQuery(q);
      const emails = await getAccountMessages(emailQuery, gapi);

      if (emails.length <= 0) {
        showSuccess({
          message: (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <AlertCircle />
              <h4 className='ml-3 mb-0' style={{ lineHeight: '16px' }}>
                There are no order emails in this account.
              </h4>
            </div>
          ),
        });
        gapi.current.auth2.getAuthInstance().signOut();
        if (typeRef.current === SCRAPEOLDER) {
          await updateUserAttributes({ 'custom:scan_older_done': '1' });
        }
        checkIfProductsExist();
        return;
      }

      let data = await window.notedScraper(vendors, emails);
      //REMOVE UNDEFINED FOR VENDORS SCRAPER DOES NOT SUPPORT YET
      data = data.filter((item) => item !== undefined);

      if (data.length <= 0) {
        showError({
          message: (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <AlertCircle />
              <h4 className='ml-3 mb-0' style={{ lineHeight: '16px' }}>
                We couldn&apos;t find any orders in this email. Try authorizing
                another email address.
              </h4>
            </div>
          ),
        });
        gapi.current.auth2.getAuthInstance().signOut();
        checkIfProductsExist();
        return;
      }

      await sendToBE(data);
    } catch (error) {
      if (
        error &&
        error?.result?.error?.message ===
          'Request had insufficient authentication scopes.'
      ) {
        showError({
          message: (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <AlertCircle />
              <h4 className='ml-3 mb-0' style={{ lineHeight: '16px' }}>
                Unable to run the scan. Kindly re-authorize scan and select View
                your email messages and settings in the Google popup.
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
              Please refresh the page and reauthorise the scan.
            </h4>
          </div>
        ),
      });
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
          if (typeRef.current === NORMAL) {
            handleScraping(NORMAL);
          } else {
            handleScraping(SCRAPEOLDER);
          }
        }
      });
    } catch (error) {
      console.log('NEW ERROR', error);
    }
  };

  /**CHECK IF USER HAS PRODUCTS ON DASHBOARD */
  const checkIfProductsExist = async () => {
    const products = await getProducts({});
    if (products.length <= 0) {
      dispatch(updateScraperStatus(NOTAUTHORIZED));
      return;
    }
    dispatch(updateScraperStatus(SCRAPECANCEL));
  };

  //INITIALIZE GOOGLE API
  useEffect(() => {
    window.onGoogleScriptLoad = () => {
      gapi.current = window.gapi;
      gapi.current.load('client:auth2', initClient);
    };

    loadGoogleScript();
    checkIfProductsExist();
  }, []);

  useEffect(() => {
    typeRef.current = type;
  }, [type]);

  return (
    <Fragment>
      <ToastContainer />
      <Fragment>
        {status !== SCRAPECOMPLETE && status !== SCRAPECANCEL && (
          <div id='DashboardInitial'>
            {status === NOTAUTHORIZED && (
              <Authorize triggerScanNow={() => triggerScanNow(NORMAL)} />
            )}
            {status === ISSCRAPING && <Scanning></Scanning>}
            {(status === ISAUTHORIZING || status === '') && (
              <div>
                <Spinner size='lg' color='#570097' animation='border' />
              </div>
            )}
          </div>
        )}
      </Fragment>
      {(status === SCRAPECOMPLETE || status === SCRAPECANCEL) && (
        <Fragment>
          <Topnav />
          <DashboardPage triggerScanNow={triggerScanNow} />
        </Fragment>
      )}
    </Fragment>
  );
};

export default DashboardPageInitial;
