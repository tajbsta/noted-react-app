import React, { useEffect, useState } from 'react';
import Row from './Row';
import $ from 'jquery';
import { useHistory } from 'react-router';
import { useSelector } from 'react-redux';
import { get } from 'lodash-es';
import moment from 'moment';

function PickUpConfirmed({ orderId = '' }) {
  const history = useHistory();
  const [currentOrder, setCurrentOrder] = useState({});
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const platform = window.navigator.platform;
    const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];

    if (windowsPlatforms.indexOf(platform) !== -1) {
      // Windows 10 Chrome
      $('.back-to-products-btn').css('padding-top', '9px');
    }
  }, []);

  const { scheduledReturns } = useSelector(
    ({ auth: { scheduledReturns } }) => ({
      scheduledReturns,
    })
  );

  const scheduledReturn = scheduledReturns.find(({ id }) => orderId === id);

  useEffect(() => {
    /**
     * @FUNCTION load order here
     */
    const scheduledReturn = scheduledReturns.find(({ id }) => orderId === id);
    setCurrentOrder(scheduledReturn);
  }, []);

  const date = moment(get(scheduledReturn, 'details.date', '')).format(
    'MMMM DD, YYYY'
  );

  const time = get(scheduledReturn, 'details.time', '');

  const onEdit = () => {
    history.push('/view-return', { scheduledReturnId: orderId });
  };

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 991);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  return (
    <div className='card shadow-sm max-w-840 card-height'>
      <div className='card-body pt-4 pb-3 pl-4 m-0'>
        <Row>
          <div className='col-sm-12 p-0'>
            <p className='request-msg text-16 sofia-pro'>
              Your pick-up request has been received and a member of noted’s
              pick-up team will arrive at your address on:
            </p>
          </div>
        </Row>
        <h4 className='p-0 m-0 pick-up-day sofia-pro'>{date}</h4>
        <Row>
          <h5 className='sofia-pro pick-up-time'>
            Between {time.replace('-', 'and')}
          </h5>
        </Row>

        <Row>
          <div className='col-sm-9 p-0'>
            <p className='sofia-pro mb-0 text-14'>
              We have sent you a confirmation by email.
            </p>
            <p
              className='sofia-pro text-14'
              style={{ marginBottom: isMobile ? '32px' : '' }}
            >
              If you wish to cancel or modify this order:
              <span
                className='ml-1 noted-purple sofia-pro pick-up-edit-or-btn text-14'
                onClick={onEdit}
              >
                Edit order
              </span>
            </p>
          </div>
          {!isMobile && (
            <>
              <div className='col-sm-3'>
                <button
                  className='btn btn-green back-to-products-btn'
                  onClick={() => history.push('/dashboard')}
                >
                  <span className='sofia-pro mb-0 back-to-products-text '>
                    Back to My Products
                  </span>
                </button>
              </div>
            </>
          )}
        </Row>
        {isMobile && (
          <>
            <Row>
              <button
                className='btn btn-green'
                onClick={() => history.push('/dashboard')}
              >
                <span className='sofia-pro mb-0 back-to-products-text '>
                  Back to My Products
                </span>
              </button>
            </Row>
          </>
        )}
      </div>
    </div>
  );
}

export default PickUpConfirmed;
