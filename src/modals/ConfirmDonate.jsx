import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { DONATE } from '../constants/actions/runtime';
import { setCategory } from '../utils/productsApi';

export default function ConfirmDonate(props) {
  const { item, toggleSelected } = props;

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

  const onConfirm = async () => {
    setLoading(true);
    const productId = item._id;
    try {
      const { data } = await setCategory(productId, DONATE);
      if (data.status === 'success') {
        /**
         * pop modal first
         */
        props.onHide();
        /**
         * set cart items
         */
        await toggleSelected({ transferred: true, ...item });
      }
    } catch (error) {
      /**
       * We need a show error here,
       * @question should hide or throw error with modal on
       */
    } finally {
      setLoading(false);
    }
  };

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
            Are you sure you want to continue? This is a irreversible change.
          </p>
        </div>

        <div className='button-group'>
          <Button className='btn-donate' onClick={onConfirm} disabled={loading}>
            Yes, Donate it!
          </Button>
          <Button className='btn-dont' onClick={props.onHide}>
            Cancel
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}
