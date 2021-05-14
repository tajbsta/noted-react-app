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
                placeholder='- To ensure minimal wait time please call 30 to 60 minutes before
            arriving and provide the sales order number. Otherwise, the regular
            pick-up process might take approximately up to an hour to complete.
            (305) 471-4706 Option 0.
            - Upon arriving please present the copy of your sales order at the
            front desk, if the sales order is not available the person whose
            name the sales order is under must be present and would be able to
            pick up with an valid ID.
            '
                value={props.instructions}
                onChange={(e) => {
                  props.setFieldValue('instructions', e.target.value);
                }}
              />
            </Form.Group>
            <div className='button-group'>
              <Button className='btn-save' onClick={props.onHide}>
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
