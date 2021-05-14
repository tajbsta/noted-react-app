import React from 'react';

export default function OnHoverScheduledReturn({ timeLeft, onClick }) {
  return (
    <div>
      <div id='OnHoverProductCard'>
        <div className='container-3 text-left'>
          <p className='text-14 sofia-pro line-height-16 text-score'>
            {timeLeft}
          </p>
          <button className='btn-policy sofia-pro btn' onClick={onClick}>
            Cancel or modify
          </button>
        </div>
      </div>
    </div>
  );
}
