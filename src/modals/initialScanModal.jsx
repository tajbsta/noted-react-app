import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import AmazonLogo from '../assets/img/amazon.png';

const initialScanModal = (props) => {
  return (
    <div>
      <Modal
        show={props.show}
        size='lg'
        aria-labelledby='contained-modal-title-vcenter'
        centered
        backdrop='static'
        keyboard={false}
        animation={true}
        id='InitialScanModal'
      >
        <Modal.Header closeButton onClick={props.onHide}></Modal.Header>

        <Modal.Body className='sofia-pro modal-body'>
          <h3>
            <span> Looking for your</span>
            <span>
              <img src={AmazonLogo} alt='amazon' /> orders?
            </span>
          </h3>
          <p>
            We have a Chrome extension for that! Click the link down below to
            install the chrome extension and start returning your Amazon orders
            for noted!
          </p>
          <Button
            className='btn btn-lg btn-block btn-submit'
            type='submit'
            onClick={props.onButtonClick}
          >
            Install Chrome Extension
          </Button>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default initialScanModal;
