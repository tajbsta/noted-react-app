import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

export default function AddPickupModal(props) {
  return (
    <div>
      <Modal
        {...props}
        size='lg'
        aria-labelledby='contained-modal-title-vcenter'
        centered
        backdrop='static'
        keyboard={false}
        animation={false}
        id='AddPickupModal'
      >
        <div className='header'>
          <Modal.Title>Add Pick-up instructions</Modal.Title>
          <Button
            className='clear'
            onClick={() => {
              props.setFieldValue('instructions', '');
            }}
          >
            Clear Instructions
          </Button>
        </div>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Control
                as='textarea'
                rows={8}
                value={props.instructions}
                onChange={(e) => {
                  props.setFieldValue('instructions', e.target.value);
                }}
              />
            </Form.Group>
            <div className='button-group'>
              <Button className='btn-save' onClick={props.onDoneClick}>
                Save
              </Button>
              <Button className='btn btn-cancel' onClick={props.onHide}>
                <h4 className='text-cancel'>Cancel</h4>
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
