import { isEmpty } from '@aws-amplify/core';
import { useFormik } from 'formik';
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { Modal, Button, Form, Spinner, Row, Col, Card } from 'react-bootstrap';
import { CheckCircle } from 'react-feather';
import { createUnsupportedUser } from '../api/accountsApi';
import { showError, showSuccess } from '../library/notifications.library';
import SubscriptionCard from '../components/Subscription/SubscriptionCard';

export default function SubscriptionModal(props) {
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
      <Modal.Header closeButton onClick={() => {}}>
        <h2>Select your plan</h2>
      </Modal.Header>
      <Modal.Body className='sofia-pro'>
        <Row className='subscription-container'>
          <Col sm={4}>
            <SubscriptionCard subscriptionType='ruby' />
          </Col>
          <Col sm={4}>
            <SubscriptionCard subscriptionType='emerald' savings='Save 13%' />
          </Col>
          <Col sm={4}>
            <SubscriptionCard
              recommended={true}
              subscriptionType='diamond'
              savings='Save 40%'
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
    </Modal>
  );
}
