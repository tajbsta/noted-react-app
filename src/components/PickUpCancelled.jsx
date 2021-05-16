import React, { useEffect, useState } from 'react';
import Row from './Row';
import $ from 'jquery';
import { useHistory } from 'react-router';
import { useSelector } from 'react-redux';
import { get } from 'lodash-es';
import moment from 'moment';

function PickUpCancelled({ orderId = '' }) {
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
    history.push('/order/:orderId', { scheduledReturnId: orderId });
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
              Your pickup has been successfully cancelled. We&apos;re sorry this
              pickup didn&apos;t work out for you. But we hope we&apos;ll see
              you again...right?
            </p>
          </div>
        </Row>
        {/* <h4 className='p-0 m-0 pick-up-day sofia-pro'>{date}</h4> */}

        <Row>
          {!isMobile && (
            <>
              <div className='mt-3'>
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
            <Row className='mt-3'>
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

export default PickUpCancelled;
