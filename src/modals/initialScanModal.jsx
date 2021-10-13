import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Spinner, Row, Col } from 'react-bootstrap';

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
          <h3>Don’t see your order?</h3>
          <p>
            noted is adding more stores to our database every week. In the
            meantime, you can manually add your items for pick-up.{' '}
          </p>
          <Button
            className='btn btn-lg btn-block btn-green btn-submit'
            type='submit'
            onClick={props.onButtonClick}
          >
            Manual Entry
          </Button>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default initialScanModal;
