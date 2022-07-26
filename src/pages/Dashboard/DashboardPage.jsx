import { get, isEmpty } from 'lodash';
import React, { useEffect, useState, useRef } from 'react';
import moment from 'moment';
import { Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import ReturnCategory from '../../components/Product/ReturnCategory';
import RightCard from './components/RightCard';
import { getUserId, getUser } from '../../api/auth';
import { getOrders } from '../../api/orderApi';
import {
  LAST_CALL,
  NOT_ELIGIBLE,
  RETURNABLE,
  DONATE,
} from '../../constants/actions/runtime';
import AddProductModal from '../../modals/AddProductModal';
import ScheduledCard from './components/ScheduledCard';
import Scanning from './components/Scanning';
import { scrollToTop } from '../../utils/window';
import { showError, showSuccess } from '../../library/notifications.library';
import { AlertCircle, CheckCircle } from 'react-feather';
import ReturnValueInfoIcon from '../../components/ReturnValueInfoIcon';
import { resetAuthorizeNewEmail } from '../../utils/data';
import { SCRAPEOLDER } from '../../constants/scraper';
import InitialScanModal from '../../modals/initialScanModal';
import PickUpLeftModal from '../../modals/PickUpLeftModal';
import { setIsNewlySignedUp } from '../../actions/auth.action';
import { Auth } from 'aws-amplify';
import MonthsToScanModal from '../../modals/monthsToScanModal';
import { subscribeUserToRuby } from '../../api/subscription';

export default function DashboardPage({ triggerScanNow }) {
  const [search, setSearch] = useState('');
  const [refreshCategory, setRefreshCategory] = useState({
    LAST_CALL: () => {},
    NOT_ELIGIBLE: () => {},
    RETURNABLE: () => {},
    DONATE: () => {},
  });
  const isNewlySignedUp = useSelector((state) => state.auth.isNewlySignedUp);
  const { search: searchSession } = useSelector(
    ({ runtime: { search }, auth: { scheduledReturns } }) => ({
      search,
      scheduledReturns,
    })
  );

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState('');
  const [userId, setUserId] = useState('');
  const [showScanOlderButton, setShowScanOlderButton] = useState(false);
  const [modalProductShow, setModalProductShow] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [orders, setOrders] = useState([]);
  const [fetchingOrders, setFetchingOrders] = useState(false);
  const addManualRef = useRef(null);
  const [showInitialScanModal, setShowInitialScanModal] = useState(false);
  const [showMonthsToScanModal, setShowMonthsToScanModal] = useState(false);
  // const [validPayment, setValidPayment] = useState(false);
  const [isClosedToday, setIsClosedToday] = useState(false);
  const showScanning = false;

  const dispatch = useDispatch();

  useEffect(() => {
    async function sendSession() {
      const session = await Auth.currentSession();
      const extensionID = process.env.REACT_APP_CHROME_EXT_ID;

      try {
        window.chrome.runtime.sendMessage(
          extensionID,
          JSON.stringify(session),
          function (response) {
            // eslint-disable-next-line no-console
            console.log(response);
          }
        );
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
      }
    }

    sendSession();
  }, []);

  /**HANDLE CATEGORY REFRESH */
  const handleRefreshCategory = (method, category) => {
    if (category === 'LAST_CALL,NOT_ELIGIBLE') {
      setRefreshCategory((refreshCategory) => ({
        ...refreshCategory,
        LAST_CALL: method,
      }));
    } else {
      setRefreshCategory((refreshCategory) => ({
        ...refreshCategory,
        [`${category}`]: method,
      }));
    }
  };

  const getScheduledOrders = async () => {
    try {
      setFetchingOrders(true);
      const userId = await getUserId();
      const res = await getOrders(userId, 'active');

      setFetchingOrders(false);
      setOrders(res.orders);
      // console.log(res.orders);
    } catch (error) {
      setFetchingOrders(false);
    }
  };

  useEffect(() => {
    setSearch(searchSession.trim());
  }, [searchSession]);

  useEffect(() => {
    // empty orders
    if (orders.length === 0) {
      getScheduledOrders();
    }
  }, []);

  async function loadScans() {
    try {
      setLoading(true);
      const userId = await getUserId();
      console.log('userId', userId);

      setUserId(userId);
      setLoading(false);
      setTimeout(() => {
        console.log('setShowInitialScanModal');
        setShowInitialScanModal(true);
      }, 5000);
    } catch (error) {
      showError({
        message: (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <AlertCircle />
            <h4 className='ml-3 mb-0' style={{ lineHeight: '16px' }}>
              Error! Failed to load products!
            </h4>
          </div>
        ),
      });
      setLoading(false);
    }
  }

  const scanOlderRequest = async () => {
    setShowScanOlderButton(false);
    triggerScanNow(SCRAPEOLDER);
  };

  const checkForJustAuthorizedMail = () => {
    const isMailJustAuthorized =
      localStorage.getItem('authorizeNewEmail') === 'true' || false;
    if (isMailJustAuthorized) {
      showSuccess({
        message: (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <CheckCircle />
            <h4 className='ml-3 mb-0' style={{ lineHeight: '16px' }}>
              Successfully added an email! Please wait a few minutes to show
              your returns on the dashboard
            </h4>
          </div>
        ),
      });
      resetAuthorizeNewEmail();
    }
  };

  useEffect(() => {
    scrollToTop();
    loadScans();
    checkForJustAuthorizedMail();
  }, []);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 991);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  useEffect(() => {
    function handleResize() {
      setIsTablet(window.innerWidth >= 541 && window.innerWidth <= 767);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  useEffect(() => {
    (async () => {
      const user = await getUser();
      setUser(user);
      setShowScanOlderButton(user['custom:scan_older_done'] === '0');

      const newUser = moment(user.createdAt).isSame(moment(), 'day');

      if (user && !user['custom:stripe_sub_name'] && !newUser) {
        await subscribeUserToRuby(true);
      }
    })();
  }, []);

  const beyond90days = get(user, 'custom:scan_older_done', '0') === '1';

  const onHide = () => {
    setShowInitialScanModal(false);
    dispatch(setIsNewlySignedUp(false));
  };

  return (
    <div id='DashboardPage'>
      <div className='container mt-6 main-mobile-dashboard'>
        <div className='row sched-row'>
          {/* If there are in progress orders */}
          {!isEmpty(orders) && (
            <ScheduledCard fetchingOrders={fetchingOrders} />
          )}
        </div>
        <div className='row ipad-row'>
          <div className={`mt-4 w-840 bottom ${isTablet ? 'col' : 'col-sm-9'}`}>
            {(loading || showScanning) && (
              <>
                <h3 className={`sofia-pro text-16 ${isMobile ? 'ml-3' : ''}`}>
                  Your online purchases - Last 90 Days
                </h3>
                <div
                  className={`card shadow-sm scanned-item-card mb-2 p-5 spinner-container ${
                    isMobile ? 'ml-3 mr-3' : ''
                  }`}
                >
                  {showScanning && <Scanning />}
                  {loading && (
                    <div>
                      <Spinner
                        className='dashboard-spinner'
                        animation='border'
                      />
                    </div>
                  )}
                </div>
              </>
            )}

            <PickUpLeftModal
              show={
                !isClosedToday &&
                user?.['custom:stripe_sub_id'] &&
                user?.['custom:user_pickups'] === '1'
              }
              onHide={() => {
                onHide();
                setIsClosedToday(true);
              }}
              // setValidPayment={setValidPayment}
              setValidPayment={() => {}}
            />

            <InitialScanModal
              show={showInitialScanModal && isNewlySignedUp}
              onHide={onHide}
              // onButtonClick={() => executeScroll(addManualRef)}
              onButtonClick={() =>
                window.open(
                  'https://chrome.google.com/webstore/detail/noted/balllddlldhlonjikikjlonmjpdgjcof'
                )
              }
            />

            {/*CONTAINS ALL SCANS LEFT CARD OF DASHBOARD PAGE*/}
            {!loading && !showScanning && (
              <>
                {isEmpty(search) && (
                  <h3 className='sofia-pro mt-0 ml-3 text-18 text-list'>
                    Your online purchases - Last 90 Days
                    {beyond90days ? ' & beyond' : ''}
                  </h3>
                )}
                {!isEmpty(search) && (
                  <h3 className='sofia-pro mt-0 ml-3 text-18 text-list'>
                    Search Results
                  </h3>
                )}
                {isEmpty(search) && (
                  <>
                    <div>
                      <ReturnCategory
                        typeTitle='Last Call!'
                        userId={userId}
                        size={5}
                        category={`${LAST_CALL},${NOT_ELIGIBLE}`}
                        refreshCategory={refreshCategory}
                        handleRefreshCategory={handleRefreshCategory}
                        tooltipMessage='These items are down to the last 30 days'
                      />
                    </div>
                    <div className='mt-4 returnable-items'>
                      <ReturnCategory
                        typeTitle='Returnable Items'
                        userId={userId}
                        size={5}
                        category={RETURNABLE}
                        refreshCategory={refreshCategory}
                        handleRefreshCategory={handleRefreshCategory}
                        tooltipMessage='These items are eligible for return!'
                      />
                    </div>
                    <div>
                      <p className='line-break'>
                        <span></span>
                      </p>
                    </div>
                    <div className='mt-4' unselectable='one'>
                      <ReturnCategory
                        typeTitle='Donate'
                        userId={userId}
                        size={5}
                        category={DONATE}
                        refreshCategory={refreshCategory}
                        handleRefreshCategory={handleRefreshCategory}
                        tooltipMessage='Unfortunately, these items are unreturnable. However, you can still have us pick them up and donate them to one of our community partners!'
                      />
                    </div>
                    <div>
                      <p className='line-break'>
                        <span></span>
                      </p>
                    </div>
                  </>
                )}

                {!isEmpty(search) && (
                  <div>
                    <ReturnCategory
                      typeTitle='Select all'
                      userId={userId}
                      size={5}
                      search={search}
                    />
                  </div>
                )}

                {isEmpty(search) && (
                  <div>
                    <div className='row justify-center mt-3 mobile-footer-row mt-5'>
                      <div className='col-sm-6 text-center'>
                        <div className='text-muted text-center text-cant-find sofia-pro'>
                          Can’t find one?
                          <button
                            className='btn btn-add-product mr-1'
                            onClick={() => setModalProductShow(true)}
                            disabled={false}
                            style={{
                              padding: '0px',
                            }}
                            ref={addManualRef}
                          >
                            <h4 className='mb-0 noted-purple sofia-pro line-height-16 text-add'>
                              &nbsp; Add it manually
                            </h4>
                          </button>
                          <ReturnValueInfoIcon
                            content="We're still working on this"
                            iconClassname='info-icon-small'
                          />
                        </div>
                      </div>
                    </div>
                    <div className='row justify-center mt-2 mobile-footer-row'>
                      <div className='col-sm-6 text-center'>
                        <button
                          className='btn text-center noted-purple sofia-pro line-height-16 text-new-email'
                          onClick={() => setShowMonthsToScanModal(true)}
                        >
                          Scan Email
                        </button>
                      </div>
                    </div>
                    <AddProductModal
                      show={modalProductShow}
                      onHide={() => setModalProductShow(false)}
                    />

                    <MonthsToScanModal
                      show={showMonthsToScanModal}
                      onHide={() => setShowMonthsToScanModal(false)}
                      triggerScanNow={triggerScanNow}
                    />

                    {showScanOlderButton && (
                      <>
                        <div className='row justify-center mt-2 mobile-footer-row'>
                          <div className='col-sm-6 text-center'>
                            {loading && (
                              <Spinner
                                className='mr-3 noted-purple'
                                animation='border'
                                size='md'
                                style={{
                                  height: '1.5rem',
                                  width: '1.5rem',
                                }}
                              />
                            )}
                            <button
                              className='btn btn-footer'
                              onClick={scanOlderRequest}
                            >
                              <h4 className='text-center mb-0 noted-purple sofia-pro line-height-16 text-new-email'>
                                Scan for older items
                              </h4>
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
          {!isTablet && (
            <>
              <div className='col-sm-3 checkout-card'>
                <RightCard beyond90days={beyond90days} user={user} />
              </div>
            </>
          )}
        </div>
      </div>
      {isTablet && (
        <>
          <div className='col checkout-card'>
            <RightCard beyond90days={beyond90days} user={user} />
          </div>
        </>
      )}
    </div>
  );
}
