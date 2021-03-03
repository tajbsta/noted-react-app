import { isEmpty } from 'lodash';
import React, { useState } from 'react';
import Donate from '../components/Dashboard/Donate';
import EmptyScan from '../components/Dashboard/EmptyScan';
import LastCall from '../components/Dashboard/LastCall';
import Returnable from '../components/Dashboard/Returnable';
import RightCard from '../components/Dashboard/RightCard';
import Scanning from '../components/Dashboard/Scanning';
import { scanned } from '../_mock';

function DashboardPage() {
  const [scanning, setScanning] = useState(false);

  const [scannedItems, settScannedItems] = useState([]);
  const onScanLaunch = () => {
    setScanning(true);
    setTimeout(() => {
      settScannedItems([...scanned]);
      setScanning(false);
    }, 3000);
  };

  return (
    <div id="DashboardPage">
      <div className='container mt-6'>
        <div
          className='row'
          // style={{
          //   minWidth: '89vw',
          // }}
        >
          <div className='col-sm-8 mt-4 w-840'>
            {isEmpty(scannedItems) && !scanning && (
              <>
                <h3 className='sofia-pro text-16'>
                  Your online purchases - Last 90 Days
                </h3>
                <div className={`card shadow-sm scanned-item-card mb-2 p-5 `}>
                  <EmptyScan onScanLaunch={onScanLaunch} />
                </div>
              </>
            )}
            {scanning && (
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
            {!isEmpty(scannedItems) && (
              <>
                <h3 className='sofia-pro mt-0 ml-3'>
                  Your online purchases - Last 90 Days
                </h3>
                <div className='col-sm-12'>
                  <LastCall
                    scannedItems={scannedItems.slice(0, 3)}
                    typeTitle='Last Call!'
                  />
                </div>
                <div className='col-sm-12 mt-4'>
                  <LastCall
                    scannedItems={scannedItems.slice(3, 6)}
                    typeTitle='Returnable Items'
                  />
                </div>
                <div className='col-sm-12 mt-4'>
                  <LastCall
                    scannedItems={scannedItems.slice(0, 3)}
                    typeTitle='Donate'
                  />
                </div>

                <div>
                  <div className='row justify-center'>
                    <div className='col-sm-7 text-center'>
                      <div className='text-muted text-center'>
                        These are all the purchases we found in the past 90 days
                        from your address alexijones@gmail.com
                      </div>
                    </div>
                  </div>
                  <div className='row justify-center mt-3'>
                    <div className='col-sm-6 text-center'>
                      <div className='text-muted text-center'>
                        Can’t find one?
                        <span className='noted-purple'>Add it manually</span>
                      </div>
                    </div>
                  </div>
                  <div className='row justify-center mt-2'>
                    <div className='col-sm-6 text-center'>
                      <div className='text-center noted-purple'>
                        Add new email address
                      </div>
                    </div>
                  </div>
                  <div className='row justify-center mt-2'>
                    <div className='col-sm-6 text-center'>
                      <div className='text-center noted-purple'>
                        Scan for older items
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className='col-sm-3'>
            <RightCard scannedItems={scannedItems} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
