import React, { useState } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import { updateUserAttributes } from '../api/auth';

export default function AddPickupModal(props) {
  const [loading, setLoading] = useState(false);
  const updatePickUpInstructions = async () => {
    try {
      setLoading(true);
      await updateUserAttributes({
        'custom:pickup_instructions': props.instructions,
      });
      await props.onHide();
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

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
              <Button
                className='btn-save'
                onClick={updatePickUpInstructions}
                disabled={loading}
              >
                {loading ? (
                  <Spinner
                    animation='border'
                    size='sm'
                    className='spinner btn-spinner'
                  />
                ) : (
                  'Save'
                )}
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
