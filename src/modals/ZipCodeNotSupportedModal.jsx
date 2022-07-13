import React from 'react';
import { Modal, Button } from 'react-bootstrap';

import { lead } from '../analytics/fbpixels';

const ZipCodeNotSupportedModal = ({ show, onContinue }) => {
  return (
    <Modal
      show={show}
      size='lg'
      aria-labelledby='contained-modal-title-vcenter'
      centered
      backdrop='static'
      keyboard={false}
      animation={false}
      id='CheckZipcodeModal'
    >
      {/* <Modal.Header closeButton onClick={props.onHide}></Modal.Header> */}
      <Modal.Body className='sofia-pro modal-body'>
        <div id='collateUserInfoForm' className='p-5'>
          <p className='unsupported sofia-pro noted-purple'>
            Coming Soon to Your Area
          </p>
          <p className='sofia-pro noted-purple unsupported-mini'>
            We don&apos;t currently service your area yet but you can still use
            our email scanning service for free!
          </p>

          <Button
            className='btn btn-lg btn-block btn-green btn-submit'
            type='submit'
            onClick={() => {
              onContinue();
              process.env.NODE_ENV === 'production' && lead;
            }}
          >
            Continue
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ZipCodeNotSupportedModal;
