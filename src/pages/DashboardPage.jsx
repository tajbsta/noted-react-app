
import React, { useState } from 'react';
import Donate from '../components/Dashboard/Donate';
import LastCall from '../components/Dashboard/LastCall';
import Returnable from '../components/Dashboard/Returnable';
import RightCard from '../components/Dashboard/RightCard';
import { lastCallMockdata, returnableMockData } from '../_mock';

function DashboardPage() {
  const [scannedItems] = useState([...lastCallMockdata, ...returnableMockData]);

  return (
    <div>
      <div className='container mt-6'>
        <div
          className='row'
          style={{
            minWidth: '89vw',
          }}
        >
          <div className='col-sm-8'>
            {/*CONTAINS ALL SCANS LEFT CARD OF DASHBOARD PAGE*/}
            <LastCall scannedItems={scannedItems} />
            <Returnable scannedItems={scannedItems} />
            <Donate scannedItems={scannedItems} />

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