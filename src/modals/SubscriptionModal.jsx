import React, { useEffect, useState } from 'react';
import { Modal, Row, Col, Form, Button } from 'react-bootstrap';
import { useFormik } from 'formik';
import { useSelector, useDispatch } from 'react-redux';
import { setSubscriptionType } from '../actions/subscription.action';

import SubscriptionCard from '../components/Subscription/SubscriptionCard';
import { paymentAddressSchema } from '../models/formSchema';
import DiamondLogo from '../assets/img/diamond-logo.svg';

export default function SubscriptionModal(props) {
  const dispatch = useDispatch();
  const { subscriptionType } = useSelector((state) => state.subscription);
  const [formState, setFormState] = useState({
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
  });

  const onSubscriptionSelect = (type) => {
    dispatch(setSubscriptionType(type));
  };

  const { errors, values, setFieldValue, touched, handleBlur } = useFormik({
    initialValues: {
      ...formState,
    },
    validationSchema: paymentAddressSchema,
  });

  const renderSubscriptionForm = () => {
    return (
      <Modal.Body className='sofia-pro subscription-form'>
        <>
          <h3>Plan Selected</h3>
          <Row>
            <Col sm={6} className='d-flex align-items-center'>
              <img src={DiamondLogo} />
            </Col>
            <Col sm={6}>
              <span className='totalText'>Total</span>
              <span className='subscriptionPrice'>
                $107.88/year <span>for 12 pick ups</span>
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
                  type='name'
                  name='fullName'
                  value={values.fullName}
                  onBlur={handleBlur}
                  onChange={(e) => {
                    setFieldValue('fullName', e.target.value);
                    setFormState({ ...formState, fullName: values.fullName });
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
                  type='number'
                  name='expirationMonth'
                  maxLength={2}
                  value={values.expirationMonth}
                  onBlur={handleBlur}
                  onChange={(e) => {
                    setFieldValue('expirationMonth', e.target.value);
                    setFormState({
                      ...formState,
                      expirationMonth: values.expirationMonth,
                    });
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
                  className='form-control'
                  type='number'
                  name='expirationYear'
                  maxLength={2}
                  value={values.expirationYear}
                  onBlur={handleBlur}
                  onChange={(e) => {
                    setFieldValue('expirationYear', e.target.value);
                    setFormState({
                      ...formState,
                      expirationYear: values.expirationYear,
                    });
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
                  type='number'
                  name='cardNumber'
                  value={values.cardNumber}
                  onBlur={handleBlur}
                  onChange={(e) => {
                    setFieldValue('cardNumber', e.target.value);
                    setFormState({
                      ...formState,
                      cardNumber: values.cardNumber,
                    });
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
                  type='number'
                  name='cvc'
                  maxLength={3}
                  value={values.cvc}
                  onBlur={handleBlur}
                  onChange={(e) => {
                    setFieldValue('cvc', e.target.value);
                    setFormState({
                      ...formState,
                      cvc: values.cvc,
                    });
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
                    setFormState({
                      ...formState,
                      billingAddress: values.billingAddress,
                    });
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
                  type='name'
                  name='name'
                  onBlur={handleBlur}
                  value={values.name}
                  onChange={(e) => {
                    setFieldValue('name', e.target.value);
                    setFormState({
                      ...formState,
                      name: values.name,
                    });
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
                  type='name'
                  name='state'
                  onBlur={handleBlur}
                  value={values.state}
                  onChange={(e) => {
                    setFieldValue('state', e.target.value);
                    setFormState({
                      ...formState,
                      state: values.state,
                    });
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
                  type='name'
                  name='zipCode'
                  onBlur={handleBlur}
                  value={values.state}
                  onChange={(e) => {
                    setFieldValue('zipCode', e.target.value);
                    setFormState({
                      ...formState,
                      state: values.zipCode,
                    });
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
                  type='name'
                  name='line1'
                  onBlur={handleBlur}
                  value={values.line1}
                  onChange={(e) => {
                    setFieldValue('line1', e.target.value);
                    setFormState({
                      ...formState,
                      state: values.line1,
                    });
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
                  type='name'
                  name='city'
                  onBlur={handleBlur}
                  value={values.state}
                  onChange={(e) => {
                    setFieldValue('city', e.target.value);
                    setFormState({
                      ...formState,
                      state: values.city,
                    });
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
                  type='name'
                  name='phoneNumber'
                  onBlur={handleBlur}
                  value={values.phone}
                  onChange={(e) => {
                    setFieldValue('phoneNumber', e.target.value);
                    setFormState({
                      ...formState,
                      state: values.phoneNumber,
                    });
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
                  type='name'
                  name='line2'
                  onBlur={handleBlur}
                  value={values.line2}
                  onChange={(e) => {
                    setFieldValue('line2', e.target.value);
                    setFormState({
                      ...formState,
                      state: values.line2,
                    });
                  }}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className='button-container'>
            <Button variant='success' size='md' block type='submit'>
              Subscribe
            </Button>
            <Button variant='light' size='md' block onClick={props.onClose}>
              Cancel
            </Button>
          </Row>
        </Form>
      </Modal.Body>
    );
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
      {subscriptionType !== '' &&
        subscriptionType !== 'ruby' &&
        renderSubscriptionForm()}
    </Modal>
  );
}
