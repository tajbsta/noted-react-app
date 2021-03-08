import { get, isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { storeScan } from '../actions/scans.action';
import EmptyScan from '../components/Dashboard/EmptyScan';
import RightCard from '../components/Dashboard/RightCard';
import Scanning from '../components/Dashboard/Scanning';
import api from '../utils/api';

function ScanningPage() {
  const history = useHistory();
  const dispatch = useDispatch();
  const [scanning, setScanning] = useState(false);
  const [scannedItems, settScannedItems] = useState([]);

  async function loadScans() {
    setScanning(true);
    api
      .get('scans/8a57189b-7814-4203-8dc0-35e6f428e046')
      .then(({ data }) => {
        settScannedItems([...data.slice(0, 5)]);
        dispatch(storeScan({ scannedItems: [...data.slice(0, 5)] }));
        setScanning(false);
        history.push('/dashboard');
      })
      .catch((err) => {
        setScanning(false);
      });
  }

  const onScanLaunch = () => {
    loadScans();
  };

  return (
    <div>
      <div className='container mt-6'>
        <div className='row'>
          <div className='col-sm-9 mt-4 w-840 bottom'>
            {!scanning && (
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
          </div>
          <div className='col-sm-3'>
            <RightCard scannedItems={scannedItems} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScanningPage;
