import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { CheckCircle } from 'react-feather';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import { unsetUser } from '../../../actions/auth.action';
import { unsetScan } from '../../../actions/scans.action';

export default function PassChangeSuccessModal(props) {
  const history = useHistory();
  const dispatch = useDispatch();

  const logout = async () => {
    dispatch(await unsetUser());
    dispatch(await unsetScan());
    Auth.signOut()
      .then(async () => {
        setTimeout(() => {
          history.push('/login');
        }, 400);
      })
      .catch((error) => {
        console.log('Error Signing Out: ', error);
      });
  };

  return (
    <Modal
      {...props}
      size='lg'
      aria-labelledby='contained-modal-title-vcenter'
      centered
      backdrop='static'
      keyboard={false}
      id='PassChangeSuccessModal'
    >
      <Modal.Header>
        <Modal.Title id='contained-modal-title-vcenter'>
          Password Changed Successfully!
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className='sofia-pro'>
        <div className='d-flex justify-content-center'>
          <CheckCircle className='check-icon' />
          <p className='sofia-pro info'>
            Please log in with your new password.
          </p>
        </div>
        <div className='button-group'>
          <Button className='btn-ok' onClick={logout}>
            OK
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}
