import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

export default function AddEmailModal(props) {
  return (
    <div>
      <Modal
        {...props}
        size='lg'
        aria-labelledby='contained-modal-title-vcenter'
        centered
        backdrop='static'
        keyboard={false}
        id='AddEmailModal'
      >
        <Modal.Body className='sofia-pro'>
          <Form>
            <Form.Group controlId='exampleForm.ControlInput1'>
              <Form.Label> Enter New Email</Form.Label>
              <Form.Control type='email' />
            </Form.Group>
          </Form>

          <div className='button-group'>
            <Button className='btn-cancel' onClick={props.onHide}>
              Cancel
            </Button>
            <Button className='btn-add-email' onClick={props.onHide}>
              Add email
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
