import React from 'react';
import ScanningIcon from '../../../assets/icons/Scanning.svg';
import Row from '../../../components/Row';

export default function Scanning() {
  return (
    <>
      <div className='card-body'>
        <Row marginBottom={2}>
          <div
            className='col-12'
            style={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <img src={ScanningIcon} />
          </div>
        </Row>
        <p className='text-center sofia-pro noted-purple text-16 text-subtitle'>
          Scan running...
        </p>
        <p className='small text-muted mb-1 text-center text-14 sofia-pro'>
          Go have some coffee - we&apos;ll email ya when it&apos;s done!
        </p>
      </div>
    </>
  );
}
