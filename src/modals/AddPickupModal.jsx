import React, { useState } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import { AlertCircle } from 'react-feather';
import { updateUserAttributes } from '../api/auth';
import { showError, showSuccess } from '../library/notifications.library';

export default function AddPickupModal(props) {
  const [loading, setLoading] = useState(false);
  const updatePickUpInstructions = async () => {
    try {
      setLoading(true);
      await updateUserAttributes({
        'custom:pickup_instructions': props.instructions,
      });
      await props.onHide();
      showSuccess({
        message: 'Successfully updated pick-up instructions',
      });
    } catch (error) {
      setLoading(false);
      showError({
        message: (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <AlertCircle />
            <h4 className='ml-3 mb-0' style={{ lineHeight: '16px' }}>
              Error! Pick-up instruction is still the same
            </h4>
          </div>
        ),
      });
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
