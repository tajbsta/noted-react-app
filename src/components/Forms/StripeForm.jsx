import React, { useEffect, useState } from 'react';
import { Form, Button, Row, Col, Spinner } from 'react-bootstrap';
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { get } from 'lodash';
import { savePaymentMethod } from '../../api/orderApi';
import { subscribeUser } from '../../api/subscription';
import { updateUserAttributes } from '../../api/auth';
import { showError } from '../../library/notifications.library';
import { orderErrors } from '../../library/errors.library';
import * as Sentry from '@sentry/react';
import { useFormik } from 'formik';
import { pickUpAddressSchema } from '../../models/formSchema';
import { AlertCircle } from 'react-feather';

export default function StripeForm({
  isCheckoutFlow,
  hasDefaultPaymentMethod,
  savePayment,
  subscription,
  onClose,
  isSuccess,
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState({
    card: null,
    expiry: null,
    cvc: null,
  });
  const [isMobile, setIsMobile] = useState(false);
  const [cardComplete, setCardComplete] = useState({
    card: false,
    expiry: false,
    cvc: false,
  });
  const [billingDetails, setBillingDetails] = useState({
    name: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const reset = () => {
    setError(null);
    setIsLoading(false);
    setCardComplete({
      card: false,
      expiry: false,
      cvc: false,
    });
    setBillingDetails({
      name: '',
    });
  };

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 540);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  const ErrorMessage = ({ children }) => (
    <div className={`ErrorMessage ${isMobile ? 'mb-4' : ''}`} role='alert'>
      <svg width='16' height='16' viewBox='0 0 17 17'>
        <path
          fill='#FFF'
          d='M8.5,17 C3.80557963,17 0,13.1944204 0,8.5 C0,3.80557963 3.80557963,0 8.5,0 C13.1944204,0 17,3.80557963 17,8.5 C17,13.1944204 13.1944204,17 8.5,17 Z'
        />
        <path
          fill='#2e1d3a'
          d='M8.5,7.29791847 L6.12604076,4.92395924 C5.79409512,4.59201359 5.25590488,4.59201359 4.92395924,4.92395924 C4.59201359,5.25590488 4.59201359,5.79409512 4.92395924,6.12604076 L7.29791847,8.5 L4.92395924,10.8739592 C4.59201359,11.2059049 4.59201359,11.7440951 4.92395924,12.0760408 C5.25590488,12.4079864 5.79409512,12.4079864 6.12604076,12.0760408 L8.5,9.70208153 L10.8739592,12.0760408 C11.2059049,12.4079864 11.7440951,12.4079864 12.0760408,12.0760408 C12.4079864,11.7440951 12.4079864,11.2059049 12.0760408,10.8739592 L9.70208153,8.5 L12.0760408,6.12604076 C12.4079864,5.79409512 12.4079864,5.25590488 12.0760408,4.92395924 C11.7440951,4.59201359 11.2059049,4.59201359 10.8739592,4.92395924 L8.5,7.29791847 L8.5,7.29791847 Z'
        />
      </svg>
      {children}
    </div>
  );

  const initialValues = {
    fullName: '',
    phoneNumber: '',
    line1: '',
    city: '',
    state: '',
    zipCode: '',
    billingAddress: false,
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
    validationSchema: pickUpAddressSchema,
    onSubmit(values) {
      setIsLoading(true);
      try {
        if (!stripe || !elements) {
          return;
        }

        if (error.card || error.expiry || error.cvc) {
          return;
        }

        if (!cardComplete.card || !cardComplete.expiry || !cardComplete.cvc) {
          return;
        }

        const subscribeUserToPlan = async () => {
          const payload = await stripe.createPaymentMethod({
            type: 'card',
            card: elements.getElement(CardNumberElement),
            billing_details: billingDetails,
          });

          if (payload.error) {
            setError(payload.error);
          } else {
            const paymentMethod = payload.paymentMethod;
            await savePaymentMethod(paymentMethod.id);

            // Set payment method as default if 1st payment method added or if created in the checkout flow
            if (!hasDefaultPaymentMethod || isCheckoutFlow) {
              await updateUserAttributes({
                'custom:default_payment': paymentMethod.id,
              });
            }

            const subscriptionPayload = {
              plan_name: subscription.plan_name,
              paymentMethodId: paymentMethod.id,
              zipcode: values.zipCode,
              addressLine1: values.line1,
              addressLine2: values.line2,
              city: values.city,
              state: values.state,
              fullName: values.fullName,
              phone: values.phoneNumber,
            };

            const response = await subscribeUser(subscriptionPayload);

            if (!response) {
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
            } else {
              isSuccess(true);
              reset();
            }

            if (isCheckoutFlow) {
              savePayment(paymentMethod);
            }
          }
          setIsLoading(false);
        };

        subscribeUserToPlan();
      } catch (error) {
        setIsLoading(false);
        showError({
          message: get(
            orderErrors.find(
              ({ code }) => code === error.response.data.details
            ),
            'message',
            'Your request could not be completed because of an error. Please try again later.'
          ),
        });

        Sentry.captureException(error);
      }
    },
  });

  return (
    <div>
      <div
        className='m-card-body'
        style={{
          paddingTop: '7px',
        }}
      >
        <Form id='PaymentForm'>
          <Row>
            <Col>
              <Form.Group>
                <Form.Label>Cardholder Name</Form.Label>
                <Form.Control
                  className='form-control'
                  type='name'
                  name='cardHolderName'
                  value={billingDetails.name}
                  onChange={(e) => {
                    setBillingDetails({
                      ...billingDetails,
                      name: e.target.value,
                    });
                  }}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group>
                <Form.Label>Card Number</Form.Label>
                <CardNumberElement
                  options={{
                    showIcon: true,
                  }}
                  className='form-control'
                  onChange={(event) => {
                    setError({
                      ...error,
                      card: event.error,
                    });

                    setCardComplete({
                      ...cardComplete,
                      card: event.complete,
                    });
                  }}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group style={{ display: 'grid' }}>
                <Form.Label>Expiration Date</Form.Label>
                <CardExpiryElement
                  className='form-control'
                  onChange={(event) => {
                    setError({
                      ...error,
                      expiry: event.error,
                    });
                    setCardComplete({
                      ...cardComplete,
                      expiry: event.complete,
                    });
                  }}
                />
              </Form.Group>
            </Col>

            <Col>
              <Form.Group>
                <Form.Label>CVC</Form.Label>
                <CardCvcElement
                  className='form-control'
                  onChange={(event) => {
                    setError({
                      ...error,
                      cvc: event.error,
                    });
                    setCardComplete({
                      ...cardComplete,
                      cvc: event.complete,
                    });
                  }}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className='justify-content-center noted-red'>
            {error && error.card && (
              <ErrorMessage>{error.card.message}</ErrorMessage>
            )}
            {error && error.expiry && (
              <ErrorMessage>{error.expiry.message}</ErrorMessage>
            )}
            {error && error.cvc && (
              <ErrorMessage>{error.cvc.message}</ErrorMessage>
            )}
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
                  name='fullName'
                  onBlur={handleBlur}
                  value={values.name}
                  onChange={(e) => {
                    setFieldValue('fullName', e.target.value);
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
            <Button variant='light' size='md' block onClick={onClose}>
              Cancel
            </Button>
          </Row>
        </Form>
      </div>
    </div>
  );
}
