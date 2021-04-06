import React, { useEffect } from 'react';
import $ from 'jquery';

export default function EmptyAddress(props) {
  useEffect(() => {
    const platform = window.navigator.platform;
    const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];

    if (windowsPlatforms.indexOf(platform) !== -1) {
      // Windows 10 Chrome
      $('.btn-add-empty').css('padding', '8px');
    }
  }, []);

  return (
    <div>
      <div
        id='EmptyState'
        className='card-body payment-details-card-body pb-3 pl-4 m-0'
      >
        <div className='d-flex justify-content-center'>
          <div className='p-0'>
            <p className='empty-header sofia-pro text-14 line-height-16 margin-bottom'>
              Pick-up Address
            </p>
          </div>
        </div>
        <div>
          <h4 className='p-0 m-0 sofia-pro text-center empty-sub'>
            Adding a pick-up address is necessary to proceed.
          </h4>
        </div>
        <div className='btn btn-add-empty text-16' onClick={props.onClick}>
          Add Pick-up Address
        </div>
      </div>
    </div>
  );
}
