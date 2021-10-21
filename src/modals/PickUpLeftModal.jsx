import React, { useEffect, useState } from 'react';
import { Modal, Button, Row, Col } from 'react-bootstrap';

export default function PickUpLeftModal(props) {
  return (
    <Modal
      show={props.show}
      size='lg'
      aria-labelledby='contained-modal-title-vcenter'
      centered
      backdrop='static'
      keyboard={false}
      animation={false}
      id='PickUpLeftModal'
    >
      <Modal.Header closeButton onClick={props.onHide}>
        <h2>You have 1 pick up left!</h2>
      </Modal.Header>
      <Modal.Body className='sofia-pro subscriptions'>
        <Row>
          <h3>Pickup Refill</h3>
          <Col
            sm={12}
            className='p-0 d-flex align-items-center justify-content-between pickups mt-4'
          >
            <span>Three (3) Pickups*</span>
            <span>$39.99</span>
          </Col>
          <Col
            sm={12}
            className='p-0 d-flex align-items-center justify-content-between taxes'
          >
            <span>Taxes</span>
            <span>$0.00</span>
          </Col>
          <Col sm={12} className='p-0 d-flex align-items-center my-3 '>
            <span className='subtle-text'>
              *3 pickups will last for 365 days from date of payment.
            </span>
          </Col>

          <Col
            sm={12}
            className='p-0 d-flex align-items-center justify-content-between mt-3 totalpay'
          >
            <span>Total to pay</span>
            <span>$39.99</span>
          </Col>
        </Row>

        <Row className='mt-5'>
          <Col
            sm={12}
            className='p-0 d-flex align-items-center justify-content-between'
          >
            <h3>Payment Method</h3>
            <div className='edit'>Edit</div>
          </Col>
          <Col className='p-0 d-flex align-items-center mt-4'>
            <div className='dummyCard'></div>
            <span className='cardNumber'>Ending in 9456</span>
          </Col>
          <Col sm={12} className='p-0 address mt-5'>
            <h3>Card Address</h3>
            <div className='mt-2'>
              <span>Alexis Jones</span>
              <span>1 Titans Way</span>
              <span>Nashville, TN 37213</span>
              <span>United States</span>
            </div>
          </Col>
        </Row>

        <Row className='mt-5 button-container'>
          <Button variant='light' size='md' className='mx-5 cancel'>
            Cancel
          </Button>
          <Button variant='primary' size='md' className='mx-5'>
            Pay $39.99
          </Button>
        </Row>
      </Modal.Body>
    </Modal>
  );
}
