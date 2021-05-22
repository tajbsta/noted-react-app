import React, { useState } from 'react';
import { Form, Button, Row, Col, Spinner } from 'react-bootstrap';
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { savePaymentMethod } from '../../utils/orderApi';

const ErrorMessage = ({ children }) => (
  <div className='ErrorMessage' role='alert'>
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

export default function AddPaymentForm({ close, refreshPaymentMethods }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
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
    if (!stripe || !elements) {
      return;
    }

    if (error) {
      elements.getElement('cardNumber').focus();
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
      reset();
      refreshPaymentMethods();
    }

    setProcessing(false);
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
                    console.log('CardNumberElement [change]', event);
                    setError(event.error);
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
                    console.log('CardNumberElement [change]', event);
                    setError(event.error);
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
                    console.log('CardNumberElement [change]', event);
                    setError(event.error);
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
            {error && <ErrorMessage>{error.message}</ErrorMessage>}
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
