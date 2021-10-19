import React, { useEffect } from 'react';
import { Modal, Row, Col } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { setSubscriptionType } from '../actions/subscription.action';

import SubscriptionCard from '../components/Subscription/SubscriptionCard';

export default function SubscriptionModal(props) {
  const dispatch = useDispatch();
  const { subscriptionType } = useSelector((state) => state.subscription);

  const onSubscriptionSelect = (type) => {
    dispatch(setSubscriptionType(type));
  };

  useEffect(() => {
    dispatch(setSubscriptionType(''));
  }, []);

  return (
    <Modal
      show={props.show}
      size='lg'
      aria-labelledby='contained-modal-title-vcenter'
      centered
      backdrop='static'
      keyboard={false}
      animation={false}
      id='SubscriptionModal'
    >
      <Modal.Header closeButton onClick={props.onClose}>
        <h2>Select your plan</h2>
      </Modal.Header>
      {subscriptionType === '' && (
        <Modal.Body className='sofia-pro subscriptions'>
          <Row className='subscription-container'>
            <Col sm={4}>
              <SubscriptionCard
                subscriptionType='ruby'
                onButtonClick={() => {
                  onSubscriptionSelect('ruby');
                  props.onClose();
                }}
              />
            </Col>
            <Col sm={4}>
              <SubscriptionCard
                subscriptionType='emerald'
                savings='Save 13%'
                onButtonClick={() => onSubscriptionSelect('emarald')}
              />
            </Col>
            <Col sm={4}>
              <SubscriptionCard
                recommended={true}
                subscriptionType='diamond'
                savings='Save 40%'
                onButtonClick={() => onSubscriptionSelect('diamond')}
              />
            </Col>
          </Row>
          <Row className='free-pickup'>
            <Col>
              <p>
                All plans comes with
                <span>1 Free Pick up</span> upon registration.
              </p>
            </Col>
          </Row>
        </Modal.Body>
      )}

      <Modal.Body className='sofia-pro user-details'>
        <>
          <h3>Plan Selected</h3>
          <Row>
            <Col sm={6}>test</Col>
            <Col sm={6}>
              <span>Total</span>
              <span>
                $107.88/year <span>for 12 pick ups</span>{' '}
              </span>
              <span>
                All plans comes with 1 Free Pick up upon registration.
              </span>
            </Col>
          </Row>
        </>

        <></>
      </Modal.Body>
    </Modal>
  );
}
