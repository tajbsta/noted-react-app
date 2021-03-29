import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import EmptyScan from '../components/Dashboard/EmptyScan';
import RightCard from '../components/Dashboard/RightCard';
import Scanning from '../components/Dashboard/Scanning';

function ScanningPage() {
  const history = useHistory();
  const [scanning, setScanning] = useState(false);

  const onScanLaunch = async () => {
    try {
      setScanning(true);
      // const id = await startScan();

      setTimeout(() => {
        history.push('/dashboard');
      }, 5000);
    } catch (error) {
      console.log(error.message);
      // TODO: Display error
      setScanning(false);
    }
  };

  return (
    <div id='ScanningPage'>
      <div className='container mt-6'>
        <div className='row'>
          <div className='col-sm-9 mt-4 w-840 bottom'>
            {!scanning && (
              <>
                <h3 className='sofia-pro text-18 mb-4'>
                  Your online purchases - Last 90 Days
                </h3>
                <div className='card shadow-sm scanned-item-card mb-2 p-3'>
                  <EmptyScan onScanLaunch={onScanLaunch} />
                </div>
              </>
            )}
            {scanning && (
              <>
                <h3 className='sofia-pro text-18 mb-4'>
                  Your online purchases - Last 90 Days
                </h3>
                <div className='card shadow-sm scanned-item-card mb-2 p-4'>
                  <Scanning />
                </div>
              </>
            )}
          </div>
          <div className='col-sm-3'>
            <RightCard
              totalReturns={0}
              potentialReturnValue={0}
              donations={0}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScanningPage;
