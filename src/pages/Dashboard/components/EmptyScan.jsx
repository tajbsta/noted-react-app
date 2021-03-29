import React from 'react';

// Launch Scan Button Page
function EmptyScan({ onScanLaunch }) {
  return (
    <>
      <div className='card-body'>
        <p className='text-center sofia-pro noted-purple text-16 mb-1'>
          No scan yet
        </p>
        <p className='small text-muted mb-1 text-center sofia-pro text-14'>
          Curious to see how much you can earn back and/or donate?
        </p>
        <div
          className='mt-4'
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <button
            className='btn shadow-sm launch-scan-btn btn-green p-0 sofia-pro'
            onClick={onScanLaunch}
          >
            <span className='mt-2'>Launch Scan</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default EmptyScan;
