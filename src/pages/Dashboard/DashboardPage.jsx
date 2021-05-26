import { isEmpty, values, flatMap } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ReturnCategory from '../../components/Product/ReturnCategory';
import RightCard from './components/RightCard';
import { getUserId, getUser, updateUserAttributes } from '../../utils/auth';
import { getAccounts } from '../../utils/accountsApi';
import { clearSearchQuery } from '../../actions/runtime.action';
import { setCartItems } from '../../actions/cart.action';
import {
  LAST_CALL,
  NOT_ELIGIBLE,
  RETURNABLE,
  DONATE,
  ALL,
} from '../../constants/actions/runtime';
import AddProductModal from '../../modals/AddProductModal';
import ScheduledCard from './components/ScheduledCard';
import Scanning from './components/Scanning';
import { scrollToTop } from '../../utils/window';
import { scrapeOlderEmails } from '../../utils/auth';
import { showError, showSuccess } from '../../library/notifications.library';
import { AlertCircle, CheckCircle } from 'react-feather';
import { getOrders } from '../../utils/orderApi';
import ReturnValueInfoIcon from '../../components/ReturnValueInfoIcon';
import { a } from '@aws-amplify/ui';

export default function DashboardPage() {
  const history = useHistory();
  const dispatch = useDispatch();
  const { search, scheduledReturns, items } = useSelector(
    ({ runtime: { search }, auth: { scheduledReturns }, cart: { items } }) => ({
      search,
      scheduledReturns,
      items,
    })
  );

  const [loading, setLoading] = useState(true);
  const [showScanning, setShowScanning] = useState(false);
  const [user, setUser] = useState('');
  const [userId, setUserId] = useState('');
  const [showScanOlderButton, setShowScanOlderButton] = useState(false);
  const [olderScanDone, setIsOlderScanDone] = useState(false);
  const [modalProductShow, setModalProductShow] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState({
    [LAST_CALL]: [],
    [NOT_ELIGIBLE]: [],
    [RETURNABLE]: [],
    [DONATE]: [],
  });
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [orders, setOrders] = useState([]);
  const [fetchingOrders, setFetchingOrders] = useState(false);

  const getScheduledOrders = async () => {
    try {
      setFetchingOrders(true);
      const userId = await getUserId();
      const res = await getOrders(userId, 'active');

      setFetchingOrders(false);
      setOrders(res.orders);
      // console.log(res.orders);
    } catch (error) {
      // TODO: ERROR HANDLING
      console.log(error);
    }
  };

  useEffect(() => {
    // empty orders
    if (orders.length === 0) {
      getScheduledOrders();
    }
  }, []);

  async function loadScans() {
    dispatch(clearSearchQuery());
    try {
      setLoading(true);
      const userId = await getUserId();

      setUserId(userId);
      await fetchAccounts(userId);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      // TODO: show error here
    }
  }

  async function fetchAccounts(userId) {
    try {
      const accounts = await getAccounts(userId);

      // Redirect to request-permission if user has no accounts
      if (accounts.length === 0) {
        history.push('/request-permission');
        return;
      }

      const scrapeNotUpdated = accounts.every(
        (acc) => acc.lastScrapeAttempt === 0
      );

      setShowScanning(scrapeNotUpdated);

      if (scrapeNotUpdated) {
        setTimeout(async () => {
          await fetchAccounts(userId);
        }, 1000 * 60); // 1 minute
      }
    } catch (error) {
      setShowScanning(false);
    }
  }

  const scanOlderRequest = async () => {
    setShowScanOlderButton(false);
    try {
      setLoading(true);
      await scrapeOlderEmails(userId);
      await updateUserAttributes({ 'custom:scan_older_done': '1' });
      showSuccess({
        message: (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <CheckCircle />
            <h4 className='ml-3 mb-0' style={{ lineHeight: '19px' }}>
              Success! Please wait a few seconds to scan
            </h4>
          </div>
        ),
      });
      setLoading(false);
      setIsOlderScanDone(true);
    } catch (error) {
      // TODO: show error alert here
      setLoading(false);
      showError({
        message: (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <AlertCircle />
            <h4 className='ml-3 mb-0' style={{ lineHeight: '16px' }}>
              File is too large! Maximum size for file upload is 5 MB.
            </h4>
          </div>
        ),
      });
    }
  };

  const updateSelectedItems = (data) => {
    let updatedSelectedProducts = {};
    if (data.key === ALL) {
      console.log(data.items);
      const allLastCall = data.items.filter(
        (item) =>
          item.category === LAST_CALL &&
          selectedProducts.LAST_CALL.findIndex(
            (val) => val._id === item._id
          ) === -1
      );
      const allReturnable = data.items.filter(
        (item) =>
          item.category === RETURNABLE &&
          selectedProducts.RETURNABLE.findIndex(
            (val) => val._id === item._id
          ) === -1
      );
      const allDonate = data.items.filter(
        (item) =>
          item.category === DONATE &&
          selectedProducts.DONATE.findIndex((val) => val._id === item._id) ===
            -1
      );
      const allNotEligible = data.items.filter(
        (item) =>
          item.category === NOT_ELIGIBLE &&
          selectedProducts.NOT_ELIGIBLE.findIndex(
            (val) => val._id === item._id
          ) === -1
      );

      updatedSelectedProducts = {
        [LAST_CALL]: [...selectedProducts.LAST_CALL, ...allLastCall],
        [RETURNABLE]: [...selectedProducts.RETURNABLE, ...allReturnable],
        [DONATE]: [...selectedProducts.DONATE, ...allDonate],
        [NOT_ELIGIBLE]: [...selectedProducts.NOT_ELIGIBLE, ...allNotEligible],
      };
    } else {
      updatedSelectedProducts = selectedProducts;
      updatedSelectedProducts[data.key] = data.items;
    }

    setSelectedProducts(updatedSelectedProducts);

    const cartItems = flatMap(values(updatedSelectedProducts));
    dispatch(setCartItems(cartItems));
  };

  useEffect(() => {
    scrollToTop();
    loadScans();
  }, []);

  const goToAuthorize = () => {
    history.push('/request-permission');
  };

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
      // await updateUserAttributes({ 'custom:scan_older_done': '0' }); // don't delete: helps to bring back 'Scan for older items' button if not-commented
      const user = await getUser();
      setUser(user);
      setShowScanOlderButton(user['custom:scan_older_done'] !== '1');
    })();
  }, []);

  const beyond90days =
    olderScanDone || (user && user['custom:scan_older_done'] == '1');

  /**GET INITIAL SELECTED ITEMS FROM CART */
  useEffect(() => {
    if (items.length > 0) {
      const allLastCall = items.filter(
        (item) =>
          item.category === LAST_CALL &&
          selectedProducts.LAST_CALL.findIndex(
            (val) => val._id === item._id
          ) === -1
      );
      const allReturnable = items.filter(
        (item) =>
          item.category === RETURNABLE &&
          selectedProducts.RETURNABLE.findIndex(
            (val) => val._id === item._id
          ) === -1
      );
      const allDonate = items.filter(
        (item) =>
          item.category === DONATE &&
          selectedProducts.DONATE.findIndex((val) => val._id === item._id) ===
            -1
      );
      const allNotEligible = items.filter(
        (item) =>
          item.category === NOT_ELIGIBLE &&
          selectedProducts.NOT_ELIGIBLE.findIndex(
            (val) => val._id === item._id
          ) === -1
      );

      setSelectedProducts({
        [LAST_CALL]: [...selectedProducts.LAST_CALL, ...allLastCall],
        [RETURNABLE]: [...selectedProducts.RETURNABLE, ...allReturnable],
        [DONATE]: [...selectedProducts.DONATE, ...allDonate],
        [NOT_ELIGIBLE]: [...selectedProducts.NOT_ELIGIBLE, ...allNotEligible],
      });
    }
  }, []);

  return (
    <div id='DashboardPage'>
      <div className='container mt-6 main-mobile-dashboard'>
        <div className='row sched-row'>
          {/* If there are in progress orders */}
          {!isEmpty(orders) && <ScheduledCard orders={orders} />}
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
                    <Spinner className='dashboard-spinner' animation='border' />
                  )}
                </div>
              </>
            )}
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
                        category={`${LAST_CALL}`}
                        updateSelectedItems={updateSelectedItems}
                        selectedProducts={selectedProducts.LAST_CALL}
                      />
                    </div>
                    <div className='mt-4 returnable-items'>
                      <ReturnCategory
                        typeTitle='Returnable Items'
                        userId={userId}
                        size={5}
                        category={RETURNABLE}
                        updateSelectedItems={updateSelectedItems}
                        selectedProducts={selectedProducts.RETURNABLE}
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
                        updateSelectedItems={updateSelectedItems}
                        selectedProducts={selectedProducts.DONATE}
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
                      category={ALL}
                      updateSelectedItems={updateSelectedItems}
                      // selectedProducts={items}
                    />
                  </div>
                )}

                {isEmpty(search) && (
                  <div>
                    {/* <div className='row justify-center mobile-footer-row'>
                      <div className='col-sm-7 text-center'>
                        <div className='text-muted text-center sofia-pro line-height-16 text-bottom-title'>
                          These are all the purchases we found in the past 90
                          days from your address
                        </div>
                      </div>
                    </div> */}
                    <div className='row justify-center mt-3 mobile-footer-row mt-5'>
                      <div className='col-sm-6 text-center'>
                        <div className='text-muted text-center text-cant-find sofia-pro'>
                          Can’t find one?
                          <button
                            className='btn btn-add-product mr-1'
                            onClick={() => setModalProductShow(true)}
                            style={{ padding: '0px' }}
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
                          onClick={goToAuthorize}
                        >
                          Add new email address
                        </button>
                      </div>
                    </div>
                    <AddProductModal
                      show={modalProductShow}
                      onHide={() => setModalProductShow(false)}
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
                                style={{ height: '1.5rem', width: '1.5rem' }}
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
                <RightCard
                  userId={userId}
                  setSelectedProducts={setSelectedProducts}
                  beyond90days={beyond90days}
                />
              </div>
            </>
          )}
        </div>
      </div>
      {isTablet && (
        <>
          <div className='col checkout-card'>
            <RightCard userId={userId} beyond90days={beyond90days} />
          </div>
        </>
      )}
    </div>
  );
}
