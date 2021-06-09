import React, { useEffect, useState } from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap';

export default function DeleteEmailModal({
  show,
  onHide,
  deleteUser,
  loading,
  disableButton,
}) {
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

  return (
    <Modal
      show={show}
      size='lg'
      aria-labelledby='contained-modal-title-vcenter'
      centered
      backdrop='static'
      keyboard={false}
      animation={false}
      id='DeleteEmailModal'
    >
      {!isMobile && (
        <Button
          type='button'
          className='close'
          data-dismiss='modal'
          aria-label='Close'
          onClick={onHide}
        >
          <span aria-hidden='true'>&times;</span>
        </Button>
      )}
      <Modal.Header>
        <Modal.Title id='contained-modal-title-vcenter'>
          Are you sure you want to delete your noted account?
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className='sofia-pro'>
        <div className='d-flex justify-content-center'>
          <p className='sofia-pro info'>
            Once you delete your account, there&apos;s no going back.
          </p>
        </div>

        <div className='button-group'>
          <Button
            className='btn-cancel'
            disabled={loading || disableButton}
            style={{ opacity: loading ? '0.6' : '1' }}
            onClick={deleteUser}
          >
            {loading ? (
              <Spinner style={{ padding: '10px' }} animation='border' />
            ) : (
              'Delete'
            )}
          </Button>
          <Button
            className='btn-dont'
            disabled={loading || disableButton}
            onClick={onHide}
          >
            Cancel
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}
