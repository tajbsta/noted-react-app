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

  const btnTextStyle = {
    marginLeft: '24px',
    marginRight: '24px',
    color: '#F8EFFF',
  };

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 639);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  return (
    <div className='row'>
      <button
        className='btn btn-md mb-2 col-sm-12 pick-up-btn d-flex'
        disabled={disabled}
        style={{
          justifyContent: 'space-between',
          alignItems: 'center',
          letterSpacing: 1,
          background,
          opacity,
        }}
        onClick={onClick}
      >
        <span style={btnTextStyle} className='text-16 sofia-pro'>
          Pickup
        </span>
        <span style={btnTextStyle} className='text-16 sofia-pro'>
          ${price || ''}
        </span>
      </button>
    </div>
  );
}

export default PickUpButton;
