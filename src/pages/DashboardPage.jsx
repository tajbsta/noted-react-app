import { get, isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { storeScan } from '../actions/scans.action';
import EmptyScan from '../components/Dashboard/EmptyScan';
import ReturnCategory from '../components/Dashboard/ReturnCategory';
import RightCard from '../components/Dashboard/RightCard';
import Scanning from '../components/Dashboard/Scanning';
import { api } from '../utils/api';
import { getUserId } from '../utils/auth';
import Auth from '@aws-amplify/auth';
import { clearSearchQuery, searchScans } from '../actions/runtime.action';

function DashboardPage() {
  const history = useHistory();

  // useEffect(() => {
  //   async function loadAuth() {
  //     const user = await Auth.currentAuthenticatedUser();
  //     console.log(await Auth.userAttributes(user));
  //   }

  //   loadAuth();
  // }, []);

  const dispatch = useDispatch();
  const { search } = useSelector(({ runtime: { search } }) => ({ search }));

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);

  console.log(search);

  const customerEmail = get(
    useSelector((state) => state),
    'auth.user.username',
    ''
  );

  const localScannedItems =
    useSelector((state) => get(state, 'scans', [])) || [];

  async function loadScans() {
    dispatch(clearSearchQuery());
    try {
      setLoading(true);
      const client = await api();
      // const userId = await getUserId();
      const userId = '9dfd011c-6e99-4af1-a4a2-5f207fe2f390';

      const { data } = await client.get(`scans/${userId}`);

      setLoading(false);

      setItems([...data.slice(0, 8)]);
      // dispatch(storeScan({ scannedItems: [...data.slice(0, 8)] }));
    } catch (error) {
      setLoading(false);
      // setIsScanning(true);
      history.push('/scanning');
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
    // setScannedItems([]);
    // setScannedItems([...localScannedItems]);
    // setIsScanning(false);
    // if (isEmpty(localScannedItems)) {
    loadScans();
    // }
  }, []);

  const onScanLaunch = () => {
    loadScans();
  };

  return (
    <div>
      <div className='container mt-6'>
        <div className='row'>
          <div className='col-sm-9 mt-4 w-840 bottom'>
            {loading && (
              <>
                <h3 className='sofia-pro text-16'>
                  Your online purchases - Last 90 Days
                </h3>
                <div className={`card shadow-sm scanned-item-card mb-2 p-5 `}>
                  <Spinner animation='border' />
                </div>
              </>
            )}

            {!loading && items.length === 0 && (
              <>
                <h3 className='sofia-pro text-16'>
                  Your online purchases - Last 90 Days
                </h3>
                <div className={`card shadow-sm scanned-item-card mb-2 p-5 `}>
                  <Scanning />
                </div>
              </>
            )}

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
                        scannedItems={items}
                        typeTitle='Last Call!'
                      />
                    </div>
                    <div className='mt-4 returnable-items'>
                      <ReturnCategory
                        scannedItems={items}
                        typeTitle='Returnable Items'
                      />
                    </div>
                    <div>
                      <p className='line-break'>
                        <span></span>
                      </p>
                    </div>
                    <div className='mt-4'>
                      <ReturnCategory scannedItems={items} typeTitle='Donate' />
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
                      <div className='text-muted text-center sofia-pro line-height-16 text-bottom-title'>
                        No scans found with the keyword &apos;{search}&apos;
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
                        <div className='text-center noted-purple sofia-pro line-height-16 text-new-email'>
                          Add new email address
                        </div>
                      </div>
                    </div>
                    <div className='row justify-center mt-2'>
                      <div className='col-sm-6 text-center'>
                        <a onClick={onScanLaunch}>
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
          <div className='col-sm-3'>
            <RightCard
              totalReturns={items.length * 2}
              potentialReturnValue={
                items
                  .map(({ amount }) => {
                    return Number(amount) | 0;
                  })
                  .reduce((acc, curr) => (acc += curr), 0) * 2
              }
              donations={items.length}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
