import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Spinner } from 'react-bootstrap';

export default function CancelOrderModal(props) {
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
    <Modal
      {...props}
      size='lg'
      aria-labelledby='contained-modal-title-vcenter'
      centered
      backdrop='static'
      keyboard={false}
      animation={false}
      id='CancelOrderModal'
    >
      {!isMobile && (
        <Button
          type='button'
          className='close'
          data-dismiss='modal'
          aria-label='Close'
          onClick={props.removeCancelOrderModal}
        >
          <span aria-hidden='true'>&times;</span>
        </Button>
      )}
      <Modal.Header>
        <Modal.Title id='contained-modal-title-vcenter'>
          Are you sure you want to cancel this order?
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className='sofia-pro'>
        <div className='d-flex justify-content-center'>
          {props.paymentMethod !== 'subscription' &&
            props.user?.['custom:stripe_sub_name'] === 'Ruby' && (
              <p className='sofia-pro info'>
                Canceling pick-ups less than 24h before schedule will result in
                a $4.99 penalty.
              </p>
            )}

          {props.paymentMethod === 'subscription' &&
            (props.user?.['custom:stripe_sub_name'] === 'Ruby' ||
              props.user?.['custom:stripe_sub_name'] === 'Emerald') && (
              <p className='sofia-pro info'>
                Canceling pick-ups less than 24h before schedule will not refund
                your pickup credit.
              </p>
            )}

          {props.paymentMethod === 'subscription' &&
            props.user?.['custom:stripe_sub_name'] === 'Diamond' && (
              <p className='sofia-pro info'>
                Canceling pick-ups less than 1h before schedule will not refund
                your pickup credit.
              </p>
            )}
        </div>
        {/* <div className='d-flex justify-content-center'>
          <a className='sofia-pro view-link'>More info</a>
        </div> */}
        <div className='button-group'>
          <Button
            className='btn-cancel'
            onClick={() => {
              props.ConfirmCancellation();
            }}
            disabled={props.loading}
          >
            {props.loading && (
              <Spinner
                animation='border'
                size='sm'
                className='mr-3 spinner btn-spinner'
              />
            )}
            {props.loading ? 'Canceling' : 'Cancel order'}
          </Button>
          <Button className='btn-dont' onClick={props.removeCancelOrderModal}>
            Do not cancel order
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}
