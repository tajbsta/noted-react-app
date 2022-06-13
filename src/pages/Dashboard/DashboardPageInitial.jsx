import React, { useEffect, useState, Fragment } from 'react';
import { Spinner } from 'react-bootstrap';
import * as Sentry from '@sentry/react';
import moment from 'moment';
import { useRef } from 'react';
import { AlertCircle } from 'react-feather';
import { useSelector, useDispatch } from 'react-redux';
import { get } from 'lodash';
import { Elements } from '@stripe/react-stripe-js';
import { ToastContainer } from 'react-toastify';
import { loadStripe } from '@stripe/stripe-js';

import ProductOptionsModal from '../../modals/ProductOptionsModal';
import SubscriptionModal from '../../modals/SubscriptionModal';
import Authorize from './components/Authorize';
import DashboardScan from './components/DashboardScan';
import DashboardPage from './DashboardPage';
import Topnav from '../../components/Navbar/Navbar';

import ACCOUNT_PROVIDERS from '../../constants/accountProviders';
import {
  ISAUTHORIZING,
  ISSCRAPING,
  NORMAL,
  NOTAUTHORIZED,
  SCRAPECOMPLETE,
  SCRAPEOLDER,
  SCRAPECANCEL,
  COOKIE_ENABLED,
} from '../../constants/scraper';

import { showError, showSuccess } from '../../library/notifications.library';
import { loadGoogleScript } from '../../library/loadGoogleScript';
import {
  getVendorsFromEmail,
  buildEmailQuery,
  getAccountMessages,
} from '../../library/scraper.library';

import {
  updateScraperStatus,
  updateScraperType,
  updateNoOfMonthsToScan,
} from '../../actions/scraper.action';

import { getUser, updateUserAttributes } from '../../api/auth';
import { subscriptionPlans, subscribeUserToRuby } from '../../api/subscription';
import { getPublicKey } from '../../api/orderApi';
import {
  addProductFromScraper,
  getProducts,
  getVendors,
} from '../../api/productsApi';

const DashboardPageInitial = () => {
  const { status, type, noOfMonthsToScan } = useSelector(
    (state) => state.scraper
  );
  const dispatch = useDispatch();
  const gapi = useRef(null);
  const typeRef = useRef(type);
  const [thirdPartyCookie, setThirdPartyCookie] = useState(false);
  const [productOptions, setProductOptions] = useState([]);
  const [showProductOptions, setShowProductOptions] = useState(false);
  const [isSavingProducts, setIsSavingProducts] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [user, setUser] = useState(null);
  const [plans, setPlans] = useState([]);
  const [userGmailAuthenticated, setUserGmailAuthenticated] = useState(false);

  /**TRIGGER SCAN NOW FOR USERS */
  const triggerScanNow = async (noOfMonths) => {
    dispatch(updateNoOfMonthsToScan(noOfMonths));
    dispatch(updateScraperType(NORMAL));

    try {
      const isSignedIn = gapi.current.auth2.getAuthInstance().isSignedIn.get();
      if (isSignedIn) {
        gapi.current.auth2.getAuthInstance().signOut();
      }
      await window.gapi.auth2.getAuthInstance().signIn({ prompt: 'consent' });
      dispatch(updateScraperStatus(ISAUTHORIZING));
    } catch (error) {
      if (error.error === 'popup_closed_by_user') {
        if (!thirdPartyCookie) {
          showError({
            message: (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <AlertCircle />
                <h4 className='ml-3 mb-0' style={{ lineHeight: '16px' }}>
                  Error! Please allow third party cookies and try again.
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
      setIsSavingProducts(true);
      const { data } = await addProductFromScraper(addProductData);
      setIsSavingProducts(false);
      if (data.status === 'success') {
        dispatch(updateScraperStatus(SCRAPECOMPLETE));
        setShowProductOptions(false);

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
    } catch (error) {
      setIsSavingProducts(false);
      Sentry.captureException(error);
    }
  };

  const showModalWithProducts = async (products) => {
    setProductOptions(products);
    setShowProductOptions(true);
  };

  /**
   * HANDLE EMAIl SCRAPING
   * @param {string} type - Scraper Types - normal, scrapeOlder
   * */
  const handleScraping = async () => {
    try {
      dispatch(updateScraperStatus(ISSCRAPING));
      const vendors = await getVendors(['supported=true']);
      await updateUserAttributes({ 'custom:scan_months': '3' });

      let after = moment().startOf('day').subtract(noOfMonthsToScan, 'months');
      let before = moment().startOf('day').add(1, 'd');

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

        dispatch(updateScraperStatus(SCRAPECANCEL));
        return;
      }

      let data = await window.notedScraper(vendors, emails);
      //REMOVE UNDEFINED FOR VENDORS SCRAPER DOES NOT SUPPORT YET
      data = data.filter((item) => item !== undefined);

      if (data.length <= 0) {
        showSuccess({
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
        dispatch(updateScraperStatus(SCRAPECANCEL));
        return;
      }

      showModalWithProducts(data);
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
        gapi.current.auth2.getAuthInstance().signOut();
        dispatch(updateScraperStatus(SCRAPECANCEL));
        return;
      }
      showError({
        message: (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <AlertCircle />
            <h4 className='ml-3 mb-0' style={{ lineHeight: '16px' }}>
              Please refresh the page and re-authorise the scan.
            </h4>
          </div>
        ),
      });
      gapi.current.auth2.getAuthInstance().signOut();
      dispatch(updateScraperStatus(SCRAPECANCEL));

      Sentry.captureException(error);
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
          handleScraping();
          setUserGmailAuthenticated(success);
        }
      });
    } catch (error) {
      Sentry.captureException(error);
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

  /**CHECK IF FIRST TIME USER */
  const checkIfFirstTimeUser = async () => {
    const user = await getUser();
    const monthsScanned = get(user, 'custom:scan_months', undefined);

    setUser(user);

    if (user && !user['custom:stripe_sub_name']) {
      setShowSubscriptionModal(true);
    } else {
      setShowSubscriptionModal(false);
    }

    if (monthsScanned === undefined) {
      dispatch(updateScraperStatus(NOTAUTHORIZED));

      return;
    }
    dispatch(updateScraperStatus(SCRAPECANCEL));
  };

  const is3PCookieAllowed = async () =>
    new Promise((resolve) => {
      {
        const frame = document.createElement('iframe');

        frame.id = '3P';
        frame.src = process.env.REACT_APP_COOKIE_URL;
        frame.style.display = 'none';
        frame.style.position = 'fixed';

        window.addEventListener('message', function listen(event) {
          const accurateOrigin =
            process.env.REACT_APP_COOKIE_URL === event.origin;
          if (accurateOrigin) {
            if (!event.data) {
              resolve(false);
              window.removeEventListener('message', listen);
              return;
            }
            const cookieEnabled =
              `${event.data}`.split('=')[0] === COOKIE_ENABLED;

            resolve(cookieEnabled);
          }
        });

        document.body.appendChild(frame);
      }
    });

  const checkForCookie = async () => {
    const cookieIsSet = await is3PCookieAllowed();
    setThirdPartyCookie(cookieIsSet);
  };

  const handleCancelProductOptionsModal = () => {
    dispatch(updateScraperStatus(SCRAPECOMPLETE));
    setShowProductOptions(false);
  };

  const onsubscriptionModalClose = async () => {
    setShowSubscriptionModal(false);
    // await subscribeUserToRuby(false);
  };

  //INITIALIZE GOOGLE API
  useEffect(() => {
    window.onGoogleScriptLoad = () => {
      gapi.current = window.gapi;
      gapi.current.load('client:auth2', initClient);
    };

    loadGoogleScript();
    checkIfFirstTimeUser();
    checkForCookie();
  }, []);

  useEffect(() => {
    gapi.current = window.gapi;
  });

  useEffect(() => {
    typeRef.current = type;
  }, [type]);

  useEffect(async () => {
    const user = await getUser();

    setUser(user);

    console.log(user);
  }, [showSubscriptionModal]);

  useEffect(async () => {
    const plans = await subscriptionPlans();

    setPlans(plans.data);
  }, []);

  useEffect(() => {
    if (userGmailAuthenticated) {
      handleScraping();
      setUserGmailAuthenticated(false);
    }
  }, [userGmailAuthenticated]);

  return (
    <Fragment>
      <ToastContainer />
      <Fragment>
        {status !== SCRAPECOMPLETE && status !== SCRAPECANCEL && (
          <div id='DashboardInitial'>
            <SubscriptionModal
              show={showSubscriptionModal}
              onClose={onsubscriptionModalClose}
              plans={plans}
            />

            {status === NOTAUTHORIZED && (
              <Authorize triggerScanNow={triggerScanNow} />
            )}
            {status === ISSCRAPING && <DashboardScan></DashboardScan>}
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
      <ProductOptionsModal
        show={showProductOptions}
        isSavingProducts={isSavingProducts}
        sendToBE={sendToBE}
        data={productOptions}
        handleCancel={handleCancelProductOptionsModal}
      />
    </Fragment>
  );
};

export const DashboardPageInitialWrapper = () => {
  const [stripePromise, setStripePromise] = useState(null);

  const loadStripeComponent = async () => {
    const key = await getPublicKey();
    const stripePromise = loadStripe(key);
    setStripePromise(stripePromise);
  };

  // Fetch stripe publishable api key
  useEffect(() => {
    loadStripeComponent();
  }, []);

  return (
    <Elements stripe={stripePromise}>
      <DashboardPageInitial />
    </Elements>
  );
};
