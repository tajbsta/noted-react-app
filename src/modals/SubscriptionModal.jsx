import React, { useEffect, useState } from 'react';
import { Modal, Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import { useFormik } from 'formik';
import { useSelector, useDispatch } from 'react-redux';
import { setSubscriptionType } from '../actions/subscription.action';

import SubscriptionCard from '../components/Subscription/SubscriptionCard';
import { paymentAddressSchema } from '../models/formSchema';
import DiamondIcon from '../assets/icons/DiamondIcon.svg';
import EmeraldIcon from '../assets/icons/EmeraldIcon.svg';

import { subscribeUser } from '../api/subscription';

export default function SubscriptionModal({ show, onClose, plans }) {
  const dispatch = useDispatch();

  const { subscriptionType } = useSelector((state) => state.subscription);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const initialValues = {
    fullName: '',
    cardNumber: '',
    expirationMonth: '',
    expirationYear: '',
    cvc: '',
    name: '',
    phoneNumber: '',
    line1: '',
    city: '',
    state: '',
    zipCode: '',
    billingAddress: '',
  };

  const onSubscriptionSelect = (subscription) => {
    // dispatch(setSubscriptionType(subscription.tag));
    setSelectedPlan(subscription);
  };

  const {
    errors,
    values,
    setFieldValue,
    touched,
    handleBlur,
    handleSubmit,
  } = useFormik({
    initialValues: {
      ...initialValues,
    },
    validationSchema: paymentAddressSchema,
    onSubmit(values) {
      setIsLoading(true);
      try {
        const {
          cardNumber,
          expirationMonth,
          expirationYear,
          cvc,
          fullName,
        } = values;

        const subscriptionPayload = {
          cardNumber: Number(cardNumber),
          expirationDateMonth: Number(expirationMonth),
          expirationDateYear: Number(expirationYear),
          cvc: Number(cvc),
          cardholderName: fullName,
          no_of_pickups: selectedPlan?.no_of_pickups,
          stripe_plan_id: selectedPlan?.stripe_plan_id,
          plan_name: selectedPlan?.plan_name,
        };

        subscribeUser(subscriptionPayload);
        setIsLoading(false);
        onClose();
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    },
  });

  const renderSubscriptionForm = (subscription) => {
    return (
      <Modal.Body className='sofia-pro subscription-form'>
        <>
          <h3>Plan Selected</h3>
          <Row>
            <Col sm={6} className='d-flex align-items-center'>
              <img
                className='mr-3'
                src={
                  subscription?.tag === 'diamond' ? DiamondIcon : EmeraldIcon
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
                All plans comes with
                <span>1 Free Pick up</span> upon registration.
              </span>
            </Col>
          </Row>
        </>

        <Form>
          <Row>
            <Col sm={6}>
              <h3>Card Information</h3>
            </Col>
          </Row>
          <Row>
            <Col sm={6}>
              <Form.Group>
                <Form.Label>Cardholder Name</Form.Label>
                <Form.Control
                  className='form-control'
                  autoComplete='off'
                  name='fullName'
                  value={values.fullName}
                  onBlur={handleBlur}
                  onChange={(e) => {
                    setFieldValue('fullName', e.target.value);
                  }}
                  isInvalid={touched.fullName && errors.fullName}
                />
                <Form.Control.Feedback type='invalid'>
                  {errors.fullName}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col sm={6} className='credit-card'>
              <Form.Group className='expirationMonth'>
                <Form.Label>Expiration Date</Form.Label>
                <Form.Control
                  className='form-control'
                  autoComplete='off'
                  type='number'
                  name='expirationMonth'
                  maxLength='2'
                  value={values.expirationMonth}
                  onBlur={handleBlur}
                  onChange={(e) => {
                    setFieldValue('expirationMonth', e.target.value);
                  }}
                  isInvalid={touched.expirationMonth && errors.expirationMonth}
                />
                <Form.Control.Feedback type='invalid'>
                  {errors.expirationMonth}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className='expirationYear'>
                <Form.Control
                  style={{ marginTop: 27 }}
                  type='number'
                  className='form-control'
                  autoComplete='off'
                  name='expirationYear'
                  maxLength='2'
                  value={values.expirationYear}
                  onBlur={handleBlur}
                  onChange={(e) => {
                    setFieldValue('expirationYear', e.target.value);
                  }}
                  isInvalid={touched.expirationYear && errors.expirationYear}
                />
                <Form.Control.Feedback type='invalid'>
                  {errors.expirationYear}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col sm={2}></Col>
          </Row>

          <Row>
            <Col sm={6}>
              <Form.Group>
                <Form.Label>Card Number</Form.Label>
                <Form.Control
                  className='form-control'
                  autoComplete='off'
                  type='number'
                  name='cardNumber'
                  value={values.cardNumber}
                  maxLength='16'
                  onBlur={handleBlur}
                  onChange={(e) => {
                    setFieldValue('cardNumber', e.target.value);
                  }}
                  isInvalid={touched.cardNumber && errors.cardNumber}
                />
                <Form.Control.Feedback type='invalid'>
                  {errors.cardNumber}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col sm={2}>
              <Form.Group>
                <Form.Label>CVC</Form.Label>
                <Form.Control
                  className='form-control'
                  autoComplete='off'
                  type='number'
                  name='cvc'
                  maxLength='3'
                  value={values.cvc}
                  onBlur={handleBlur}
                  onChange={(e) => {
                    setFieldValue('cvc', e.target.value);
                  }}
                  isInvalid={touched.cvc && errors.cvc}
                />
                <Form.Control.Feedback type='invalid'>
                  {errors.cvc}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col sm={6}>
              <h3>Billing Address</h3>
            </Col>
          </Row>

          <Row>
            <Col sm={6}>
              <Form.Group className='checkbox'>
                <Form.Check
                  inline
                  label='Same as Shipping Address'
                  name='billingAddress'
                  type='checkbox'
                  value={values.billingAddress}
                  onBlur={handleBlur}
                  onChange={(e) => {
                    setFieldValue('billingAddress', e.target.value);
                  }}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col sm={6}>
              <Form.Group>
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  className='form-control'
                  autoComplete='off'
                  type='name'
                  name='name'
                  onBlur={handleBlur}
                  value={values.name}
                  onChange={(e) => {
                    setFieldValue('name', e.target.value);
                  }}
                  isInvalid={touched.name && errors.name}
                />
                <Form.Control.Feedback type='invalid'>
                  {errors.name}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col sm={3}>
              <Form.Group>
                <Form.Label>State</Form.Label>
                <Form.Control
                  className='form-control'
                  autoComplete='off'
                  type='name'
                  name='state'
                  onBlur={handleBlur}
                  value={values.state}
                  onChange={(e) => {
                    setFieldValue('state', e.target.value);
                  }}
                  isInvalid={touched.state && errors.state}
                />
                <Form.Control.Feedback type='invalid'>
                  {errors.state}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col sm={3}>
              <Form.Group>
                <Form.Label>Zip Code</Form.Label>
                <Form.Control
                  className='form-control'
                  autoComplete='off'
                  type='name'
                  name='zipCode'
                  onBlur={handleBlur}
                  value={values.zipCode}
                  onChange={(e) => {
                    setFieldValue('zipCode', e.target.value);
                  }}
                  isInvalid={touched.zipCode && errors.zipCode}
                />
                <Form.Control.Feedback type='invalid'>
                  {errors.zipCode}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col sm={6}>
              <Form.Group>
                <Form.Label>Address Line 1</Form.Label>
                <Form.Control
                  className='form-control'
                  autoComplete='off'
                  type='name'
                  name='line1'
                  onBlur={handleBlur}
                  value={values.line1}
                  onChange={(e) => {
                    setFieldValue('line1', e.target.value);
                  }}
                  isInvalid={touched.line1 && errors.line1}
                />
                <Form.Control.Feedback type='invalid'>
                  {errors.line1}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col sm={3}>
              <Form.Group>
                <Form.Label>City</Form.Label>
                <Form.Control
                  className='form-control'
                  autoComplete='off'
                  type='name'
                  name='city'
                  onBlur={handleBlur}
                  value={values.city}
                  onChange={(e) => {
                    setFieldValue('city', e.target.value);
                  }}
                  isInvalid={touched.city && errors.city}
                />
                <Form.Control.Feedback type='invalid'>
                  {errors.city}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col sm={3}>
              <Form.Group>
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  className='form-control'
                  autoComplete='off'
                  type='name'
                  name='phoneNumber'
                  onBlur={handleBlur}
                  value={values.phone}
                  onChange={(e) => {
                    setFieldValue('phoneNumber', e.target.value);
                  }}
                  isInvalid={touched.phoneNumber && errors.phoneNumber}
                />
                <Form.Control.Feedback type='invalid'>
                  {errors.phoneNumber}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col sm={6}>
              <Form.Group>
                <Form.Label>Address Line 2</Form.Label>
                <Form.Control
                  className='form-control'
                  autoComplete='off'
                  type='name'
                  name='line2'
                  onBlur={handleBlur}
                  value={values.line2}
                  onChange={(e) => {
                    setFieldValue('line2', e.target.value);
                  }}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className='button-container'>
            <Button
              variant='success'
              size='md'
              block
              type='submit'
              onClick={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
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
                'Subscribe'
              )}
            </Button>
            <Button variant='light' size='md' block>
              Cancel
            </Button>
          </Row>
        </Form>
      </Modal.Body>
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
      <Modal.Header closeButton onClick={onClose}>
        <h2>Select your plan</h2>
      </Modal.Header>
      {!selectedPlan && (
        <>
          {plans.length > 0 && (
            <Modal.Body className='sofia-pro subscriptions'>
              <Row className='subscription-container'>
                <Col sm={4}>
                  <SubscriptionCard
                    subscriptionType='ruby'
                    subscriptionDetails={plans.find((p) => p.tag === 'ruby')}
                    onButtonClick={() => {
                      onSubscriptionSelect(plans.find((p) => p.tag === 'ruby'));
                      onClose();
                    }}
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
                    All plans comes with
                    <span>1 Free Pick up</span> upon registration.
                  </p>
                </Col>
              </Row>
            </Modal.Body>
          )}
        </>
      )}
      {selectedPlan && renderSubscriptionForm(selectedPlan)}
    </Modal>
  );
}
