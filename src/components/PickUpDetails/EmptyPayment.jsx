import React, { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';

export default function EmptyPayment(props) {
  const { renderSpinner = () => {}, renderStopSpinner = () => {} } = props;
  const [isMobile, setIsMobile] = useState(false);

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

  // To hide delay
  useEffect(() => {
    renderSpinner();
    setTimeout(() => {
      renderStopSpinner();
    }, 1500);
  }, []);

  return (
    <div>
      <div
        id='EmptyState'
        className='card-body payment-details-card-body pb-3 pl-4 m-0'
      >
        {props.loading && (
          <div
            className={`d-flex justify-content-center ${
              !isMobile ? 'mt-5' : ''
            }`}
          >
            <Spinner
              animation='border'
              size='md'
              style={{
                color: '#570097',
                opacity: '0.6',
              }}
              className='spinner'
            />
          </div>
        )}
        {!props.loading && (
          <>
            <div
              className='justify-content-center'
              style={{ display: isMobile ? 'none' : 'flex' }}
            >
              <div className='p-0'>
                <p className='empty-header sofia-pro text-14 line-height-16 margin-bottom'>
                  Payment Method
                </p>
              </div>
            </div>
            <div>
              <h4 className='p-0 m-0 sofia-pro text-center empty-sub'>
                Adding a payment method is necessary to proceed
              </h4>
            </div>
            <div className='d-flex justify-content-center'>
              <button className='btn btn-add-empty' onClick={props.onClick}>
                Add Payment Method
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
