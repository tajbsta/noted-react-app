import React from 'react';
import ScanningIcon from './../../../assets/icons/Scanning.svg';
import CustomRow from '../../../components/Row';

const DashboardScan = () => {
  return (
    <div id='ScanningUpdate'>
      <div className='card-body'>
        <CustomRow marginBottom={2}>
          <div
            className='col-12'
            style={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <img src={ScanningIcon} />
          </div>
        </CustomRow>
        <p className='text-center sofia-pro noted-purple text-18 text-subtitle'>
          Scan running...
        </p>
        <p className='small text-muted mb-1 text-center text-16 sofia-pro'>
          Go have some coffee - we&apos;ll email ya when it&apos;s done!
        </p>
      </div>
    </div>
  );
};

export default DashboardScan;
