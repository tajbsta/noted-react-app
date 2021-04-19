import { useFormik } from 'formik';
import { isEmpty } from 'lodash-es';
import React, { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import Collapsible from 'react-collapsible';
import { useDispatch, useSelector } from 'react-redux';
import { savePaymentForm } from '../../../actions/auth.action';
import { paymentAddressSchema } from '../../../models/formSchema';
import PaymentMethods from '../../Settings/components/PaymentMethods';

export default function Payment() {
  const dispatch = useDispatch();
  const { paymentMethods } = useSelector(({ auth: { paymentMethods } }) => ({
    paymentMethods,
  }));
  const {
    errors: paymentFormErrors,
    handleChange: handlePaymentChange,
    values: paymentFormValues,
    handleSubmit,
    resetForm,
  } = useFormik({
    initialValues: {
      fullName: '',
      cardNumber: '',
      expirationMonth: '',
      expirationYear: '',
      cvc: '',
    },
    validationSchema: paymentAddressSchema,
    onSubmit: (data) => {
      dispatch(savePaymentForm(data));
      resetForm();
    },
  });

  const {
    fullName,
    cardNumber,
    expirationMonth,
    expirationYear,
    cvc,
  } = paymentFormValues;

  const [isEditing, setIsEditing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const noBorder = !isEditing
    ? {
        style: {
          border: 'none',
        },
        disabled: true,
      }
    : {};

  return (
    <div id='Payment'>
      <div className='row'>
        <Collapsible
          open={isOpen}
          onTriggerOpening={() => setIsOpen(true)}
          onTriggerClosing={() => setIsOpen(false)}
          trigger={
            <div className='triggerContainer'>
              <h3 className='sofia-pro text-18 mb-3-profile mb-0 ml-3 triggerText'>
                Payment Method
              </h3>
              <span className='triggerArrow'>{isOpen ? '▲' : '▼'} </span>
            </div>
          }
          overflowWhenOpen='visible'
        >
          <div className='card shadow-sm p-3 w-840 mt-4 ml-3'>
            {!isEditing && !isEmpty(paymentMethods) && (
              <PaymentMethods setIsEditing={setIsEditing} />
            )}
            {(isEditing || isEmpty(paymentMethods)) && (
              <div className='card-body'>
                <Form id='PaymentForm'>
                  <Row>
                    <Col xs={6}>
                      <Form.Group>
                        <Form.Label>Cardholder Name</Form.Label>
                        <Form.Control
                          className='form-control-lg'
                          type='name'
                          name='fullName'
                          value={fullName}
                          onChange={handlePaymentChange}
                          {...noBorder}
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group>
                        <Form.Label>Expiration Date</Form.Label>
                        <div className='exp-form'>
                          <Form.Control
                            className='form-control-sm'
                            name='expirationMonth'
                            value={expirationMonth}
                            onChange={handlePaymentChange}
                            {...noBorder}
                          />
                          <div className='separator'>
                            <h4>&nbsp;&nbsp;/&nbsp;&nbsp;</h4>
                          </div>
                          <Form.Control
                            className='form-control-sm'
                            name='expirationYear'
                            value={expirationYear}
                            onChange={handlePaymentChange}
                            {...noBorder}
                          />
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col xs={6}>
                      <Form.Group>
                        <Form.Label>Card Number</Form.Label>
                        <Form.Control
                          className='form-control-lg'
                          name='cardNumber'
                          value={cardNumber}
                          onChange={handlePaymentChange}
                          {...noBorder}
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={6} md={3}>
                      <Form.Group>
                        <Form.Label>CVC</Form.Label>
                        <Form.Control
                          className='form-control-sm'
                          type='phone number'
                          name='cvc'
                          value={cvc}
                          onChange={handlePaymentChange}
                          {...noBorder}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col className='btn-container'>
                      {isEditing && (
                        <Button
                          className='btn-save'
                          type='submit'
                          onClick={(e) => {
                            e.preventDefault();

                            handleSubmit();

                            setIsEditing(false);
                          }}
                        >
                          Done
                        </Button>
                      )}
                      {!isEditing && (
                        <Button
                          className='btn-save'
                          type='submit'
                          onClick={(e) => {
                            e.preventDefault();
                            setIsEditing(true);
                          }}
                        >
                          Edit
                        </Button>
                      )}
                    </Col>
                  </Row>
                </Form>
              </div>
            )}
          </div>
        </Collapsible>
      </div>
    </div>
  );
}
