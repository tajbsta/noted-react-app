import React, { useState, useEffect } from 'react';
import { Button, Modal, Row, Col } from 'react-bootstrap';
import { useDispatch } from 'react-redux';

import SubscriptionCard from '../components/Subscription/SubscriptionCard';

import DiamondIcon from '../assets/icons/DiamondIcon.svg';
import EmeraldIcon from '../assets/icons/EmeraldIcon.svg';
import StripeForm from '../components/Forms/StripeForm';
import { setPayment } from '../actions/cart.action';
import { subscribeUserToRuby } from '../api/subscription';
import { AlertCircle } from 'react-feather';
import { showError } from '../library/notifications.library';
import * as Sentry from '@sentry/react';

export default function SubscriptionModal({ show, onClose, plans }) {
  const dispatch = useDispatch();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [subscriptionSuccess, setSubscriptionSuccess] = useState(false);

  const onSubscriptionSelect = (subscription) => {
    setSelectedPlan(subscription);
  };

  const savePayment = (paymentMethod) => {
    dispatch(setPayment(paymentMethod));
  };

  const onModalClose = () => {
    setSelectedPlan(null);
    setSubscriptionSuccess(false);
    onClose();
  };

  const onRubyClick = async () => {
    onSubscriptionSelect(plans.find((p) => p.tag === 'ruby'));

    try {
      const resp = await subscribeUserToRuby(false);
      if (resp.status === 201) {
        onClose();
      }
    } catch (error) {
      showError({
        message: (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <AlertCircle />
            <h4 className='ml-3 mb-0' style={{ lineHeight: '16px' }}>
              Error! subscription fail!
            </h4>
          </div>
        ),
      });
      Sentry.captureException(error);
    }
  };

  useEffect(() => {
    if (subscriptionSuccess) {
      console.log('success');
    }
  }, [subscriptionSuccess]);

  const renderSubscriptionForm = (subscription) => {
    console.log(subscription);
    if (subscription.plan_name === 'Ruby') return;
    return (
      <>
        <Modal.Header closeButton onClick={onModalClose}>
          {subscriptionSuccess && (
            <h3>
              <strong>Thank You</strong>
            </h3>
          )}
        </Modal.Header>
        {subscriptionSuccess ? (
          <Modal.Body className='sofia-pro subscription-form'>
            <Row>
              <Col
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <h3>
                  <strong>Your subscription is successful and complete!</strong>
                </h3>

                <Button
                  style={{
                    background: '#570097',
                    marginTop: 30,
                    maxWidth: 232,
                  }}
                  size='md'
                  block
                  onClick={onModalClose}
                >
                  Continue
                </Button>
              </Col>
            </Row>
          </Modal.Body>
        ) : (
          <Modal.Body className='sofia-pro subscription-form'>
            <>
              <h3>Plan Selected</h3>
              <Row>
                <Col sm={6} className='d-flex align-items-center'>
                  <img
                    className='mr-3'
                    src={
                      subscription?.tag === 'diamond'
                        ? DiamondIcon
                        : EmeraldIcon
                    }
                  />
                  <p className='m-0 subscription-name'>
                    {subscription?.tag === 'diamond' ? 'Diamond' : 'Emerald'}
                  </p>
                </Col>
                <Col sm={6}>
                  <span className='totalText'>Total</span>
                  <span className='subscriptionPrice'>
                    {subscription?.price}/{subscription?.duration}{' '}
                    <span>{subscription?.description}</span>
                  </span>
                  <span className='subscriptionDetails'>
                    All plans come with
                    <span>1 Free Pick up</span> upon registration.
                  </span>
                </Col>
              </Row>
            </>

            <Row>
              <Col sm={6}>
                <h3>Card Information</h3>
              </Col>
            </Row>
            <StripeForm
              isCheckoutFlow={true}
              savePayment={savePayment}
              subscription={subscription}
              onClose={onModalClose}
              isSuccess={setSubscriptionSuccess}
            />
          </Modal.Body>
        )}
      </>
    );
  };

  return (
    <Modal
      show={show}
      size='lg'
      aria-labelledby='contained-modal-title-vcenter'
      centered
      backdrop='static'
      keyboard={false}
      animation={false}
      id='SubscriptionModal'
    >
      {!selectedPlan && (
        <>
          <Modal.Header closeButton onClick={onModalClose}>
            <h2>Select your plan</h2>
          </Modal.Header>
          {plans?.length > 0 && (
            <Modal.Body className='sofia-pro subscriptions'>
              <Row className='subscription-container'>
                <Col sm={4}>
                  <SubscriptionCard
                    subscriptionType='ruby'
                    subscriptionDetails={plans.find((p) => p.tag === 'ruby')}
                    onButtonClick={onRubyClick}
                  />
                </Col>
                <Col sm={4}>
                  <SubscriptionCard
                    subscriptionType='emerald'
                    subscriptionDetails={plans.find((p) => p.tag === 'emerald')}
                    savings='Save 13%'
                    onButtonClick={() =>
                      onSubscriptionSelect(
                        plans.find((p) => p.tag === 'emerald')
                      )
                    }
                  />
                </Col>
                <Col sm={4}>
                  <SubscriptionCard
                    recommended={true}
                    subscriptionDetails={plans.find((p) => p.tag === 'diamond')}
                    subscriptionType='diamond'
                    savings='Save 40%'
                    onButtonClick={() =>
                      onSubscriptionSelect(
                        plans.find((p) => p.tag === 'diamond')
                      )
                    }
                  />
                </Col>
              </Row>
              <Row className='free-pickup'>
                <Col>
                  <p>
                    All plans come with
                    <span>1 Free Pick up</span> upon registration.
                  </p>
                </Col>
              </Row>
            </Modal.Body>
          )}
        </>
      )}
      {selectedPlan &&
        selectedPlan !== 'Ruby' &&
        renderSubscriptionForm(selectedPlan)}
    </Modal>
  );
}
