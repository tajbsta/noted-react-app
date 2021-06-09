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
import { updateUserAttributes } from '../../api/auth';
import { showError } from '../../library/notifications.library';
import { orderErrors } from '../../library/errors.library';

export default function AddPaymentForm({
  close,
  refreshPaymentMethods,
  isCheckoutFlow,
  hasDefaultPaymentMethod,
  savePayment,
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
  const [processing, setProcessing] = useState(false);
  const [billingDetails, setBillingDetails] = useState({
    name: '',
  });

  const handleSubmit = async () => {
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

      setProcessing(true);

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

        reset();

        if (!isCheckoutFlow) {
          // Pass payment method id if no default payment method
          refreshPaymentMethods(
            !hasDefaultPaymentMethod ? paymentMethod.id : null
          );
        } else {
          savePayment(paymentMethod);
          close();
        }
      }

      setProcessing(false);
    } catch (error) {
      setProcessing(false);
      showError({
        message: get(
          orderErrors.find(({ code }) => code === error.response.data.details),
          'message',
          'Your request could not be completed because of an error. Please try again later.'
        ),
      });
    }
  };

  const reset = () => {
    setError(null);
    setProcessing(false);
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

  return (
    <div
    // className='card shadow-sm mb-2 p-3 max-w-840'
    // style={{ minHeight: '396px' }}
    >
      <div
        className='m-card-body'
        style={{
          paddingTop: '7px',
        }}
      >
        <Form id='PaymentForm'>
          <Row>
            <Col>
              <Button
                type='button'
                className='btn close'
                data-dismiss='modal'
                aria-label='Close'
                onClick={() => {
                  reset();
                  close();
                }}
              >
                <span
                  aria-hidden='true'
                  style={{
                    color: '#B1ADB2',
                  }}
                >
                  &times;
                </span>
              </Button>
              <Form.Group>
                <Form.Label>Cardholder Name</Form.Label>
                <Form.Control
                  className='form-control'
                  type='name'
                  name='fullName'
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
            <Col className='d-flex' style={{ justifyContent: 'flex-end' }}>
              <Button
                className='mobile-btn-save-payment'
                type='submit'
                disabled={!stripe || !billingDetails.name || processing}
                onClick={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
              >
                {processing ? (
                  <Spinner
                    animation='border'
                    size='sm'
                    className='spinner btn-spinner'
                  />
                ) : (
                  'Save'
                )}
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
}
