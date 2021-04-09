import { get, isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { storeScan } from '../../actions/scans.action';
import ReturnCategory from '../../components/ReturnCategory';
import RightCard from './components/RightCard';
import Scanning from './components/Scanning';
import { getUserId, getUser } from '../../utils/auth';
import { getAccounts, startAccountsScan } from '../../utils/accountsApi';
import { getProducts } from '../../utils/productsApi';
import { clearSearchQuery } from '../../actions/runtime.action';
import {
  FOR_DONATION,
  FOR_RETURN,
  LAST_CALL,
} from '../../constants/actions/runtime';
import ScheduledReturnCard from '../../components/ScheduledReturnCard';
import { clearOrder } from '../../actions/auth.action';
import AddEmailModal from '../../modals/AddEmailModal';
import AddProductModal from '../../modals/AddProductModal';

const inDevMode = ['local', 'development'].includes(process.env.NODE_ENV);

function DashboardPage() {
  const history = useHistory();

  const dispatch = useDispatch();
  const { search } = useSelector(({ runtime: { search } }) => ({ search }));

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState('');
  const [modalEmailShow, setModalEmailShow] = useState(false);
  const [modalProductShow, setModalProductShow] = useState(false);

  const [lastCallSelected, setLastCallSelected] = useState([]);
  const [returnableSelected, setReturnableSelected] = useState([]);
  const [donations, setDonationsSelected] = useState([]);
  // const [items, setItems] = useState([]);
  const {
    localDonationsCount,
    lastCall,
    forReturn,
    scheduledReturns,
    scans: items,
  } = useSelector(
    ({
      runtime: { forDonation, forReturn, lastCall },
      auth: { scheduledReturns },
      scans,
    }) => ({
      localDonationsCount: forDonation.length,
      forReturn,
      lastCall,
      scheduledReturns,
      scans,
    })
  );

  const potentialReturnValue = [...forReturn, ...lastCall]
    .map(({ amount }) => parseFloat(amount))
    .reduce((acc, curr) => (acc += curr), 0);

  async function loadScans() {
    // dispatch(clearSearchQuery());
    try {
      setLoading(true);
      const user = await getUserId();
      const accounts = await getAccounts(user);

      setUserId(user);

      // Redirect to request-permission if user has no accounts
      if (accounts.length === 0) {
        history.push('/request-permission');
        return;
      }

      const validAccounts = accounts.filter((acc) => acc.valid === 1);

      // Redirect to scanning if user has no active gmail account
      // if (validAccounts.length === 0) {
      //   setLaunchScan(true);
      //   setLoading(false);
      //   return;
      // }

      const products = await getProducts(user);

      setLoading(false);
      // dispatch(storeScan({ scannedItems: [...products] }));
      // setItems(products);
    } catch (error) {
      setLoading(false);
      // TODO: show error here
    }
  }

  useEffect(() => {
    loadScans();
  }, []);

  useEffect(() => {
    (async () => {
      const user = await getUser();
      setUser(user);
    })();
  }, []);

  return (
    <div>
      <div className='container mt-6 main-mobile-dashboard'>
        <div className='row'>
          <div className='col-sm-9 mt-4 w-840 bottom'>
            {loading && (
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
            )}

            {!loading && items.length === 0 && (
              <>
                <h3 className='sofia-pro text-16'>
                  Your online purchases - Last 90 Days
                </h3>
                <div className='card shadow-sm scanned-item-card mb-2 p-5'>
                  <Scanning />
                </div>
              </>
            )}

            {/* IF YOU HAVE SCHEDULED RETURNS */}

            <>
              {!loading && isEmpty(search) && !isEmpty(scheduledReturns) && (
                <>
                  <h3 className='sofia-pro mt-0 ml-3 text-18 text-list'>
                    Your scheduled returns{' '}
                    {inDevMode && (
                      // THIS ONLY SHOWS WHEN ENV IS SET TO development
                      <button
                        className='btn btn-primary'
                        onClick={() => dispatch(clearOrder())}
                      >
                        Clear Orders (DEV)
                      </button>
                    )}
                  </h3>
                  <div>
                    {scheduledReturns.map((scheduleReturn) => {
                      const items = get(scheduleReturn, 'items', []);
                      return items.map((item) => (
                        <ScheduledReturnCard
                          scheduledReturnId={scheduleReturn.id}
                          scannedItem={item}
                          key={item.id}
                          selectable={false}
                          clickable={false}
                        />
                      ));
                    })}
                  </div>

                  <hr className='scheduled-line-break'></hr>
                </>
              )}
            </>

            {/*CONTAINS ALL SCANS LEFT CARD OF DASHBOARD PAGE*/}
            {!loading && items.length > 0 && (
              <>
                <h3 className='sofia-pro mt-0 ml-3 text-18 text-list'>
                  {isEmpty(search)
                    ? 'Your online purchases - Last 90 Days'
                    : 'Search Results'}
                </h3>
                {isEmpty(search) && (
                  <>
                    <div>
                      <ReturnCategory
                        scannedItems={items.slice(0, 4)}
                        typeTitle='Last Call!'
                        compensationType={LAST_CALL}
                        disabled={localDonationsCount > 0}
                        selected={lastCallSelected}
                        setSelected={setLastCallSelected}
                      />
                    </div>
                    <div className='mt-4 returnable-items'>
                      <ReturnCategory
                        scannedItems={items.slice(5, 9)}
                        typeTitle='Returnable Items'
                        compensationType={FOR_RETURN}
                        disabled={localDonationsCount > 0}
                        selected={returnableSelected}
                        setSelected={setReturnableSelected}
                      />
                    </div>
                    <div>
                      <p className='line-break'>
                        <span></span>
                      </p>
                    </div>
                    <div className='mt-4' unselectable='one'>
                      <ReturnCategory
                        scannedItems={items.slice(10, 14)}
                        typeTitle='Donate'
                        compensationType={FOR_DONATION}
                        disabled={[...lastCall, ...forReturn].length > 0}
                        setSelected={setDonationsSelected}
                        selected={donations}
                      />
                    </div>
                    <div>
                      <p className='line-break'>
                        <span></span>
                      </p>
                    </div>
                  </>
                )}

                {/* {!isEmpty(search) && !isEmpty(filteredItems) && (
                  <div>
                    <ReturnCategory
                      scannedItems={filteredItems}
                      typeTitle='Select all'
                    />
                  </div>
                )} */}
                {!isEmpty(search) && (
                  <div className='row justify-center'>
                    <div className='col-sm-7 text-center'>
                      <div className='text-center sofia-pro empty-search'>
                        No results found.
                      </div>
                    </div>
                  </div>
                )}

                {isEmpty(search) && (
                  <div>
                    <div className='row justify-center mobile-footer-row'>
                      <div className='col-sm-7 text-center'>
                        <div className='text-muted text-center sofia-pro line-height-16 text-bottom-title'>
                          These are all the purchases we found in the past 90
                          days from your address {user && user.email}
                        </div>
                      </div>
                    </div>
                    <div className='row justify-center mt-3 mobile-footer-row'>
                      <div className='col-sm-6 text-center'>
                        <div className='text-muted text-center text-cant-find sofia-pro'>
                          Can’t find one?
                          <button
                            className='btn btn-add-product'
                            onClick={() => setModalProductShow(true)}
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
                          className='btn btn-add-new-email'
                          onClick={() => setModalEmailShow(true)}
                        >
                          <div className='text-center noted-purple sofia-pro line-height-16 text-new-email'>
                            Add new email address
                          </div>
                        </button>
                      </div>
                    </div>
                    {/* MODALS */}
                    <AddProductModal
                      show={modalProductShow}
                      onHide={() => setModalProductShow(false)}
                    />
                    <AddEmailModal
                      show={modalEmailShow}
                      onHide={() => setModalEmailShow(false)}
                    />
                    <div className='row justify-center mt-2 mobile-footer-row'>
                      <div className='col-sm-6 text-center'>
                        <a>
                          <div className='text-center noted-purple line-height-16 sofia-pro'>
                            Scan for older items
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
          <div className='col-sm-3 checkout-card'>
            <RightCard
              totalReturns={[...forReturn, ...lastCall].length}
              potentialReturnValue={potentialReturnValue}
              donations={localDonationsCount}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
