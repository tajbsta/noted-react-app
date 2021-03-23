import React from 'react';
import { Modal, Button } from 'react-bootstrap';

export default function CancelOrderModal(props) {
  return (
    <Modal
      {...props}
      size='lg'
      aria-labelledby='contained-modal-title-vcenter'
      centered
      backdrop='static'
      keyboard={false}
      id='CancelOrderModal'
    >
      <Button
        type='button'
        className='close'
        data-dismiss='modal'
        aria-label='Close'
        onClick={props.onHide}
      >
        <span aria-hidden='true'>&times;</span>
      </Button>
      <Modal.Header>
        <Modal.Title id='contained-modal-title-vcenter'>
          Are you sure you want to cancel this order?
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className='sofia-pro'>
        <div className='d-flex justify-content-center'>
          <p className='sofia-pro info'>
            Canceling pick-ups less than 4h before schedule will result in a $5
            penalty.
          </p>
        </div>
        <div className='d-flex justify-content-center'>
          <a className='sofia-pro view-link'>More info</a>
        </div>
        <div className='button-group'>
          <Button className='btn-cancel' onClick={props.onCancel}>
            Cancel order
          </Button>
          <Button className='btn-dont' onClick={props.onHide}>
            Do not cancel order
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}
