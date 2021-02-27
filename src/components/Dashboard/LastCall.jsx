import { isEmpty } from 'lodash';
import React, { useState } from 'react';
import Row from '../Row';
import EmptyScan from './EmptyScan';
import ProductCard from './ProductCard';
import Scanning from './Scanning';
import QuestionMarkSvg from '../../assets/icons/QuestionMark.svg';

function LastCall({ scannedItems }) {
  const [scanning, setScanning] = useState(false);

  const onScanLaunch = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
    }, 3000);
  };

  return (
    <div className='col-sm-12'>
      <h3 className='sofia-pro'>Your online purchases - Last 90 Days</h3>
      <Row className='mb-2'>
        <div className='ml-3 p-0 purchase-type-checkbox-container'>
          <input type='checkbox' />
        </div>
        <h4
          className='sofia-pro purchase-types purchase-type-title mb-0'
          style={{
            display: 'flex',
            alignItems: 'center',
            marginLeft: 16,
            textAlign: 'center',
          }}
        >
          Last call!
        </h4>
        <img
          className='ml-3 mb-2'
          src={QuestionMarkSvg}
          alt=''
          style={{
            opacity: 0.6,
          }}
        />
      </Row>
      {isEmpty(scannedItems) ? (
        <div className='card shadow-sm'>
          <div className='card-body p-4'>
            {scanning && <Scanning />}
            {isEmpty(scannedItems) && !scanning ? (
              <EmptyScan onScanLaunch={onScanLaunch} />
            ) : (
              <></>
            )}
          </div>
        </div>
      ) : (
        [...scannedItems].map((scannedItem) => (
          <ProductCard
            key={scannedItem.productName}
            scannedItem={scannedItem}
          />
        ))
      )}
    </div>
  );
}

export default LastCall;
