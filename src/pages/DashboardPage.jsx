import { get, isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { storeScan } from '../actions/scans.action';
import EmptyScan from '../components/Dashboard/EmptyScan';
import ReturnCategory from '../components/Dashboard/ReturnCategory';
import RightCard from '../components/Dashboard/RightCard';
import Scanning from '../components/Dashboard/Scanning';
import { api } from '../utils/api';
import Auth from '@aws-amplify/auth';
import { clearSearchQuery, searchScans } from '../actions/runtime.action';

function DashboardPage() {
  const history = useHistory();

  useEffect(() => {
    async function loadAuth() {
      const user = await Auth.currentAuthenticatedUser();
      console.log(await Auth.userAttributes(user));
    }

    loadAuth();
  }, []);

  const dispatch = useDispatch();
  const { search } = useSelector(({ runtime: { search } }) => ({ search }));

  const [scanning, setScanning] = useState(false);
  const [scannedItems, setScannedItems] = useState([]);
  const [searchedScans, setSearchedScans] = useState([]);

  const customerEmail = get(
    useSelector((state) => state),
    'auth.user.username',
    ''
  );

  useEffect(() => {
    console.log('SEARCH', search);
    const filtered = scannedItems.filter((scan) => {
      const pattern = new RegExp(search, 'i');
      return (
        get(scan, 'vendorTag', '').match(pattern) ||
        get(scan, 'itemName', '').match(pattern)
      );
    });

    console.log(filtered);

    setSearchedScans([...filtered]);
  }, [search]);

  const localScannedItems =
    useSelector((state) => get(state, 'scans', [])) || [];

  async function loadScans() {
    dispatch(clearSearchQuery());
    try {
      setScanning(true);
      const client = await api();

      const { data } = await client.get(
        `scans/9dfd011c-6e99-4af1-a4a2-5f207fe2f390`
      );

      setScannedItems([...data.slice(0, 8)]);
      dispatch(storeScan({ scannedItems: [...data.slice(0, 8)] }));

      setScanning(isEmpty(data));
    } catch (error) {
      setScanning(true);
      // history.push("/scanning");
    }
  }

  useEffect(() => {
    setScannedItems([]);
    setScannedItems([...localScannedItems]);
    setScanning(false);
    if (isEmpty(localScannedItems)) {
      loadScans();
    }
  }, []);

  const onScanLaunch = () => {
    loadScans();
  };

  return (
    <div>
      <div className='container mt-6'>
        <div className='row'>
          <div className='col-sm-9 mt-4 w-840 bottom'>
            {/* {isEmpty(scannedItems) && !scanning && (
              <>
                <h3 className="sofia-pro text-16">
                  Your online purchases - Last 90 Days
                </h3>
                <div className={`card shadow-sm scanned-item-card mb-2 p-5 `}>
                  <EmptyScan onScanLaunch={onScanLaunch} />
                </div>
              </>
            )} */}
            {(scanning || (isEmpty(scannedItems) && !scanning)) && (
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
            {!isEmpty(scannedItems) && isEmpty(searchedScans) && (
              <>
                <h3 className='sofia-pro mt-0 ml-3 text-18 text-list'>
                  Your online purchases - Last 90 Days
                </h3>
                <div>
                  <ReturnCategory
                    scannedItems={scannedItems}
                    typeTitle='Last Call!'
                  />
                </div>
                <div className='mt-4 returnable-items'>
                  <ReturnCategory
                    scannedItems={scannedItems}
                    typeTitle='Returnable Items'
                  />
                </div>
                <div>
                  <p className='line-break'>
                    <span></span>
                  </p>
                </div>
                <div className='mt-4'>
                  <ReturnCategory
                    scannedItems={scannedItems}
                    typeTitle='Donate'
                  />
                </div>
                <div>
                  <p className='line-break'>
                    <span></span>
                  </p>
                </div>
                <div>
                  <div className='row justify-center'>
                    <div className='col-sm-7 text-center'>
                      <div className='text-muted text-center sofia-pro line-height-16 text-bottom-title'>
                        These are all the purchases we found in the past 90 days
                        from your address {customerEmail}
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
              </>
            )}
            {/* RENDERS SEARCH RESULTS */}
            {!isEmpty(searchedScans) && (
              <>
                <h3 className='sofia-pro mt-0 ml-3 text-18 text-list'>
                  Search Results
                </h3>
                <div>
                  <ReturnCategory scannedItems={searchedScans} />
                </div>
                <div>
                  <div className='row justify-center'>
                    <div className='col-sm-7 text-center'>
                      <div className='text-muted text-center sofia-pro line-height-16 text-bottom-title'>
                        These are all the purchases we found in the past 90 days
                        from your address {customerEmail}
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
              </>
            )}
          </div>
          <div className='col-sm-3'>
            <RightCard
              totalReturns={scannedItems.length * 2}
              potentialReturnValue={
                scannedItems
                  .map(({ amount }) => {
                    return Number(amount) | 0;
                  })
                  .reduce((acc, curr) => (acc += curr), 0) * 2
              }
              donations={0}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
