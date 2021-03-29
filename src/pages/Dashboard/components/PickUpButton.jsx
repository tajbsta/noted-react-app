/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';

function PickUpButton({
  disabled,
  leadingText = '',
  backgroundColor: background,
  textColor: color,
  price,
  timeWindow,
  opacity,
  onClick,
}) {
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 639);
    }
    handleResize(); // Run on load to set the default value
    window.addEventListener('resize', handleResize);
    // Clean up event listener
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  return (
    <div className='row'>
      <button
        className='btn btn-md mb-2 col-sm-12 pick-up-btn'
        disabled={disabled}
        style={{
          alignSelf: 'center',
          letterSpacing: 1,
          background,
          opacity,
        }}
        onClick={onClick}
      >
        <div className='row'>
          <div
            className={!isMobile ? 'col-sm-8' : 'ml-3'}
            style={{
              display: 'flex',
              justifyItems: 'center',
              alignItems: 'center',
            }}
          >
            <p
              className='mt-0 mb-0 ml-3 pick-up-btn-lead'
              style={{
                fontWeight: '500',
                fontSize: 16,
                color,
              }}
            >
              {leadingText || ''}
            </p>
          </div>
          <div className={!isMobile ? 'col-sm-4 small' : 'd-none'}>
            <p
              className='mt-0 mb-0'
              style={{
                fontSize: 13,
                color,
              }}
            >
              ${price || ''}
            </p>
            {timeWindow && (
              <p
                className='mt-0 mb-0 h5'
                style={{
                  color,
                }}
              >
                {timeWindow}
              </p>
            )}
          </div>
        </div>
      </button>
    </div>
  );
}

export default PickUpButton;
