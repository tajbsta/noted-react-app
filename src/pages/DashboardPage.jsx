import { get, isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { storeScan } from '../actions/scans.action';
import ReturnCategory from '../components/Dashboard/ReturnCategory';
import RightCard from '../components/Dashboard/RightCard';
import Scanning from '../components/Dashboard/Scanning';
import { getUserId } from '../utils/auth';
import { getAccounts, startAccountsScan } from '../utils/accountsApi';
import { getProducts } from '../utils/productsApi';
import { clearSearchQuery } from '../actions/runtime.action';
import {
  FOR_DONATION,
  FOR_RETURN,
  LAST_CALL,
} from '../constants/actions/runtime';
import EmptyScan from '../components/Dashboard/EmptyScan';
import ScheduledReturnCard from '../components/Dashboard/ScheduledReturnCard';
import { clearOrder } from '../actions/auth.action';
import AddEmailModal from '../modals/AddEmailModal';

const inDevMode = ['local', 'development'].includes(process.env.NODE_ENV);

function DashboardPage() {
  const history = useHistory();

  const dispatch = useDispatch();
  const { search } = useSelector(({ runtime: { search } }) => ({ search }));

  const [loading, setLoading] = useState(true);
  const [launchScan, setLaunchScan] = useState(false);
  const [userId, setUserId] = useState('');
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [modalShow, setModalShow] = useState(false);

  const customerEmail = get(
    useSelector((state) => state),
    'auth.user.username',
    ''
  );

  const {
    localDonationsCount,
    lastCall,
    forReturn,
    scheduledReturns,
  } = useSelector(
    ({
      runtime: { forDonation, forReturn, lastCall },
      auth: { scheduledReturns },
    }) => ({
      localDonationsCount: forDonation.length,
      forReturn,
      lastCall,
      scheduledReturns,
    })
  );

  const potentialReturnValue = [...forReturn, ...lastCall]
    .map(({ amount }) => parseFloat(amount))
    .reduce((acc, curr) => (acc += curr), 0);

  async function loadScans() {
    dispatch(clearSearchQuery());
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
      if (validAccounts.length === 0) {
        setLaunchScan(true);
        setLoading(false);
        return;
      }

      const products = await getProducts(user);

      setLoading(false);

      setItems([...products]);

      if (!isEmpty(scheduledReturns)) {
        setItems([
          ...products.filter(
            ({ id }) =>
              ![
                ...scheduledReturns
                  .reduce((acc, curr) => acc.items.concat(curr.items))
                  .map(({ id }) => id),
              ].includes(id)
          ),
        ]);
      }
      dispatch(storeScan({ scannedItems: [...products] }));
    } catch (error) {
      setLoading(false);
      // TODO: show error here
    }
  }

  useEffect(() => {
    const filtered = items.filter((scan) => {
      const pattern = new RegExp(search, 'i');
      return (
        get(scan, 'vendorTag', '').match(pattern) ||
        get(scan, 'itemName', '').match(pattern)
      );
    });

    if (search.length > 0) {
      setFilteredItems([...filtered]);
    } else {
      setFilteredItems([]);
    }
  }, [search]);

  useEffect(() => {
    loadScans();
  }, []);

  const onScanLaunch = async () => {
    await startAccountsScan(userId);
    setLaunchScan(false);
  };

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
                  {launchScan && <EmptyScan onScanLaunch={onScanLaunch} />}
                  {!launchScan && <Scanning />}
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
                      />
                    </div>
                    <div className='mt-4 returnable-items'>
                      <ReturnCategory
                        scannedItems={items.slice(5, 9)}
                        typeTitle='Returnable Items'
                        compensationType={FOR_RETURN}
                        disabled={localDonationsCount > 0}
                      />
                    </div>
                    <div>
                      <p className='line-break'>
                        <span></span>
                      </p>
                    </div>
                    <div className='mt-4' unselectable={true}>
                      <ReturnCategory
                        scannedItems={items.slice(10, 14)}
                        typeTitle='Donate'
                        compensationType={FOR_DONATION}
                        disabled={[...lastCall, ...forReturn].length > 0}
                      />
                    </div>
                    <div>
                      <p className='line-break'>
                        <span></span>
                      </p>
                    </div>
                  </>
                )}

                {!isEmpty(search) && !isEmpty(filteredItems) && (
                  <div>
                    <ReturnCategory
                      scannedItems={filteredItems}
                      typeTitle='Select all'
                    />
                  </div>
                )}
                {!isEmpty(search) && isEmpty(filteredItems) && (
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
                    <div className='row justify-center'>
                      <div className='col-sm-7 text-center'>
                        <div className='text-muted text-center sofia-pro line-height-16 text-bottom-title'>
                          These are all the purchases we found in the past 90
                          days from your address {customerEmail}
                        </div>
                      </div>
                    </div>
                    <div className='row justify-center mt-3'>
                      <div className='col-sm-6 text-center'>
                        <div className='text-muted text-center text-cant-find sofia-pro'>
                          Can’t find one?
                          <span className='noted-purple sofia-pro line-height-16'>
                            &nbsp; Add it manually
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className='row justify-center mt-2'>
                      <div className='col-sm-6 text-center'>
                        <button
                          className='btn btn-add-new-email'
                          onClick={() => setModalShow(true)}
                        >
                          <div className='text-center noted-purple sofia-pro line-height-16 text-new-email'>
                            Add new email address
                          </div>
                        </button>
                      </div>
                    </div>
                    <AddEmailModal
                      show={modalShow}
                      onHide={() => setModalShow(false)}
                    />
                    <div className='row justify-center mt-2'>
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
