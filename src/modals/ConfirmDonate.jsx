import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

export default function ConfirmDonate(props) {
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(false);

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
    <Modal
      {...props}
      size='lg'
      aria-labelledby='contained-modal-title-vcenter'
      centered
      backdrop='static'
      keyboard={false}
      animation={false}
      id='ConfirmDonate'
    >
      {!isMobile && (
        <Button
          type='button'
          className='close'
          data-dismiss='modal'
          aria-label='Close'
          onClick={props.onHide}
        >
          <span aria-hidden='true'>&times;</span>
        </Button>
      )}
      <Modal.Header>
        <Modal.Title id='contained-modal-title-vcenter'>
          This product will be put under the Donate category
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className='sofia-pro'>
        <div className='d-flex justify-content-center'>
          <p className='sofia-pro info'>
            Please confirm and select products to donate in the checkout
            process.
          </p>
        </div>

        <div className='button-group'>
          <Button className='btn-donate'>Donate</Button>
          <Button className='btn-dont' onClick={props.onHide}>
            Cancel
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}
