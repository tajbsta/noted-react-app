import { isEmpty, values, flatMap } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ReturnCategory from '../../components/ReturnCategory';
import RightCard from './components/RightCard';
import { getUserId, getUser } from '../../utils/auth';
import { getAccounts } from '../../utils/accountsApi';
import { clearSearchQuery } from '../../actions/runtime.action';
import { setCartItems } from '../../actions/cart.action';
import { LAST_CALL, RETURNABLE, DONATE } from '../../constants/actions/runtime';
import AddProductModal from '../../modals/AddProductModal';
import ScheduledCard from './components/ScheduledCard';
import Scanning from './components/Scanning';
import { scrollToTop } from '../../utils/window';

const inDevMode = ['local', 'development'].includes(process.env.NODE_ENV);

function DashboardPage() {
  const history = useHistory();
  const dispatch = useDispatch();
  const { search, scheduledReturns } = useSelector(
    ({ runtime: { search }, auth: { scheduledReturns } }) => ({
      search,
      scheduledReturns,
    })
  );
  const [loading, setLoading] = useState(true);
  const [showScanning, setShowScanning] = useState(false);
  const [userId, setUserId] = useState('');
  const [modalEmailShow, setModalEmailShow] = useState(false);
  const [modalProductShow, setModalProductShow] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState({
    [LAST_CALL]: [],
    [RETURNABLE]: [],
    [DONATE]: [],
  });
  const [isMobile, setIsMobile] = useState(false);

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

  const updateSelectedItems = (data) => {
    const updatedSelectedProducts = selectedProducts;

    updatedSelectedProducts[data.key] = data.items;

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

  return (
    <div id='DashboardPage'>
      <div className='container mt-6 main-mobile-dashboard'>
        <div className='row sched-row'>
          {/**
           * should only appear if there are scheduled returns
           */}

          {!isEmpty(scheduledReturns) && <ScheduledCard />}
        </div>
        <div className='row ipad-row'>
          <div className='col-sm-9 mt-4 w-840 bottom'>
            {' '}
            {/* {loading && (
              <>
                <div id='loader-con'>
                  <h3 className='sofia-pro text-16'>
                    Your online purchases - Last 90 Days
                  </h3>
                  <div className='card shadow-sm scanned-item-card mb-2 p-5 spinner-container'>
                    <Spinner className='dashboard-spinner' animation='border' />
                  </div>
                </div>
              </>
            )} */}
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
                        category={LAST_CALL}
                        updateSelectedItems={updateSelectedItems}
                      />
                    </div>
                    <div className='mt-4 returnable-items'>
                      <ReturnCategory
                        typeTitle='Returnable Items'
                        userId={userId}
                        size={5}
                        category={RETURNABLE}
                        updateSelectedItems={updateSelectedItems}
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
                      updateSelectedItems={updateSelectedItems}
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
                            className='btn btn-add-product'
                            onClick={() => setModalProductShow(true)}
                            style={{ padding: '0px' }}
                          >
                            <div className='noted-purple sofia-pro line-height-16 text-add'>
                              &nbsp; Add it manually
                            </div>
                          </button>
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

                    <div className='row justify-center mt-2 mobile-footer-row'>
                      <div className='col-sm-6 text-center'>
                        <button className='btn btn-footer'>
                          <div className='text-center noted-purple sofia-pro line-height-16 text-new-email'>
                            Scan for older items
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
          <div className='col-sm-3 checkout-card'>
            <RightCard userId={userId} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
