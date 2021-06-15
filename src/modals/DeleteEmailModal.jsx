import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { deleteAccount } from '../api/accountsApi';
import { showError } from '../library/notifications.library';

export default function DeleteEmailModal(props) {
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

  const deleteAccountRequest = async () => {
    try {
      setLoading(true);
      const account = props.account;
      await deleteAccount(account.user, account.id);
      props.deletesuccess();
      setLoading(false);
    } catch (error) {
      showError({
        message: 'Error encountered when deleting account',
      });
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
      id='DeleteEmailModal'
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
          Are you sure you want to delete{' '}
          <a className='sofia-pro text-address'>
            {props.account && props.account.email}
          </a>{' '}
          email?
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className='sofia-pro'>
        <div className='d-flex justify-content-center'>
          <p className='sofia-pro info'>
            This will remove all products associated with this email.
          </p>
        </div>

        <div className='button-group'>
          <Button className='btn-cancel' onClick={deleteAccountRequest}>
            Delete Email
          </Button>
          <Button className='btn-dont' onClick={props.onHide}>
            Cancel
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}
