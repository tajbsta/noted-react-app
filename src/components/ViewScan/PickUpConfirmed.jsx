import React, { useState, useEffect } from 'react';
import Row from '../Row';
import $ from 'jquery';

function PickUpConfirmed() {
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    const platform = window.navigator.platform;
    const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];

    if (windowsPlatforms.indexOf(platform) !== -1) {
      // Windows 10 Chrome
      $('.back-to-products-btn').css('padding-top', '9px');
    }
  }, []);
  return (
    <div className='card shadow-sm w-840 card-height'>
      <div className='card-body pt-4 pb-3 pl-4 m-0'>
        <Row>
          <div className='col-sm-12 p-0'>
            <p className='request-msg text-16 sofia-pro'>
              Your pick-up request has been received and a member of noted’s
              pick-up team will arrive at your address on:
            </p>
          </div>
        </Row>
        <h4 className='p-0 m-0 pick-up-day sofia-pro'>Today</h4>
        <Row>
          <h5 className='sofia-pro pick-up-time'>Between 2pm and 3pm</h5>
        </Row>

        <Row>
          <div className='col-sm-9 p-0'>
            <p className='sofia-pro mb-0 text-14'>
              We have sent you a confirmation by email.
            </p>
            <p className='sofia-pro text-14'>
              If you wish to cancel or modify this order:
              <span className='ml-1 noted-purple sofia-pro pick-up-edit-or-btn text-14'>
                Edit order
              </span>
            </p>
          </div>
          <div className='col-sm-3'>
            <button className='btn btn-green back-to-products-btn'>
              <span className='sofia-pro mb-0 back-to-products-text '>
                Back to My Products
              </span>
            </button>
          </div>
        </Row>
      </div>
    </div>
  );
}

export default PickUpConfirmed;
