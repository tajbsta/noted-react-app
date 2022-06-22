import React, { useState } from 'react';

import { Modal, Button, Spinner } from 'react-bootstrap';
import { showError } from '../library/notifications.library';
import { AlertCircle } from 'react-feather';
import { cancelSubscription } from '../api/subscription';
import moment from 'moment';

export default function CancelSubscriptionModal({ show, onHide, user }) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onCancel = async () => {
    setIsLoading(true);
    try {
      const response = await cancelSubscription();
      if (response.status === 200) {
        setIsSuccess(true);
        setIsLoading(false);
      }
    } catch (error) {
      showError({
        message: (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <AlertCircle />
            <h4 className='ml-3 mb-0' style={{ lineHeight: '16px' }}>
              Error! subscription cancel fail!
            </h4>
          </div>
        ),
      });
      setIsLoading(false);
    }
  };

  const renderSuccess = () => {
    return (
      <Modal.Body className='sofia-pro modal-body'>
        <p className='text-center'>
          Your noted subscription will no longer renewed. You can still use all
          of your remaining credits until{' '}
          {moment
            .unix(user?.['custom:stripe_sub_exp_date'])
            .format('MM/DD/YYYY')}
          .
        </p>
        <Button className='danger block mt-4' onClick={onHide}>
          OK
        </Button>
      </Modal.Body>
    );
  };

  const renderContent = () => {
    return (
      <Modal.Body className='sofia-pro modal-body'>
        <p> Are you sure you want to cancel your subscription?</p>
        <Button
          className='danger block mt-4'
          variant='danger'
          onClick={onCancel}
        >
          {isLoading ? (
            <Spinner
              as='span'
              animation='border'
              size='sm'
              role='status'
              aria-hidden='true'
            />
          ) : (
            'YES'
          )}
        </Button>

        <Button
          className='danger border-0 mt-3'
          variant='outline-success'
          onClick={onHide}
        >
          Nevermind
        </Button>
      </Modal.Body>
    );
  };

  return (
    <div>
      <Modal
        show={show}
        size='md'
        aria-labelledby='contained-modal-title-vcenter'
        centered
        backdrop='static'
        keyboard={false}
        animation={false}
        id='CancelSubscriptionModal'
      >
        <Modal.Header closeButton onClick={onHide}></Modal.Header>
        {isSuccess ? renderSuccess() : renderContent()}
      </Modal>
    </div>
  );
}
