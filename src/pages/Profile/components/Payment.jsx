import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { isEmpty } from 'lodash-es';
import { nanoid } from 'nanoid';
import { Form, Button, Row, Col } from 'react-bootstrap';
import Collapsible from 'react-collapsible';
import { useDispatch, useSelector } from 'react-redux';
import {
  savePaymentForm,
  updatePaymentForm,
} from '../../../actions/auth.action';
import { paymentAddressSchema } from '../../../models/formSchema';
import PaymentMethods from './PaymentMethods';

export default function Payment() {
  const dispatch = useDispatch();

  const { paymentMethods } = useSelector(({ auth: { paymentMethods } }) => ({
    paymentMethods,
  }));
  const {
    setFieldValue,
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
      id: '',
    },
    validationSchema: paymentAddressSchema,
    onSubmit: (data) => {
      if (
        !isEmpty(
          paymentMethods.find(
            ({ id: paymentMethodId }) => data.id === paymentMethodId
          )
        )
      ) {
        /***
         * Should only modify payment methods, although this is temporary
         */
        const newPaymentMethods = [...paymentMethods].filter(
          ({ id: paymentMethodId }) => paymentMethodId !== data.id
        );
        dispatch(updatePaymentForm([...newPaymentMethods, data]));
        return resetForm();
      }

      /**
       * If this entry does not exist just add it
       */
      dispatch(
        savePaymentForm({
          ...data,
          id: nanoid(),
        })
      );
      return resetForm();
    },
  });

  const {
    fullName,
    cardNumber,
    expirationMonth,
    expirationYear,
    cvc,
  } = paymentFormValues;

  const [focused, setFocused] = useState({
    ...Object.keys((key) => ({ [key]: false })),
  });

  const renderInlineValidationError = (fieldName) => {
    const error = paymentFormErrors[fieldName];
    return (
      focused[fieldName] &&
      error && <small className='form-text p-0 m-0 noted-red'>{error}</small>
    );
  };

  const onFocus = (e) => {
    setFocused({ ...focused, [e.target.name]: true });
  };

  const [isEditing, setIsEditing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const noBorder = !isEditing
    ? {
        style: {
          border: 'none',
        },
        disabled: true,
      }
    : {};

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 1199);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  function formatCardNumber(value) {
    return value
      .replace(/[^0-9]/g, '')
      .substr(0, 16)
      .split('')
      .reduce((str, l, i) => {
        return str + (!i || i % 4 ? '' : '-') + l;
      }, '');
  }

  const renderPaymentMobileView = () => {
    return (
      <>
        {isEditing && (
          <div
            // className='card shadow-sm mb-2 p-3 max-w-840'
            style={{ minHeight: '396px' }}
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
                        value={fullName}
                        onChange={handlePaymentChange}
                        {...noBorder}
                      />
                      {renderInlineValidationError('fullName')}
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>Card Number</Form.Label>
                      <Form.Control
                        className='form-control'
                        name='cardNumber'
                        value={formatCardNumber(cardNumber) || ''}
                        onChange={handlePaymentChange}
                        {...noBorder}
                        maxLength={20}
                      />
                      {renderInlineValidationError('cardNumber')}
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group style={{ display: 'grid' }}>
                      <Form.Label>Expiration Date</Form.Label>
                      <div
                        className='exp-form'
                        style={{ display: 'inline-flex' }}
                      >
                        <Form.Control
                          className='form-control'
                          name='expirationMonth'
                          maxLength={2}
                          value={expirationMonth || ''}
                          onChange={handlePaymentChange}
                          {...noBorder}
                        />
                        <div
                          className='separator d-flex'
                          style={{ alignItems: 'center' }}
                        >
                          <h4>&nbsp;&nbsp;/&nbsp;&nbsp;</h4>
                        </div>
                        <Form.Control
                          className='form-control'
                          name='expirationYear'
                          maxLength={2}
                          value={expirationYear || ''}
                          onChange={handlePaymentChange}
                          {...noBorder}
                        />
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>CVC</Form.Label>
                      <Form.Control
                        className='form-control'
                        name='cvc'
                        value={cvc || ''}
                        onChange={handlePaymentChange}
                        {...noBorder}
                        maxLength={4}
                      />
                      {renderInlineValidationError('cvc')}
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col
                    className='d-flex'
                    style={{ justifyContent: 'flex-end' }}
                  >
                    {isEditing && (
                      <Button
                        className='mobile-btn-save-payment'
                        type='submit'
                        onClick={(e) => {
                          e.preventDefault();
                          handleSubmit();
                          setIsEditing(false);
                        }}
                      >
                        Save
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
          </div>
        )}
      </>
    );
  };

  const renderPaymentDesktopView = () => {
    return (
      <>
        {isEditing && (
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
                    {renderInlineValidationError('fullName')}
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
                      value={formatCardNumber(cardNumber) || ''}
                      onChange={handlePaymentChange}
                      {...noBorder}
                    />
                    {renderInlineValidationError('cardNumber')}
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
                    {renderInlineValidationError('cvc')}
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
      </>
    );
  };

  const renderPaymentMethods = () => {
    return (
      <PaymentMethods
        setIsEditing={setIsEditing}
        setFieldValue={setFieldValue}
      />
    );
  };

  const renderTrigger = () => {
    return (
      <div className='triggerContainer'>
        <h3 className='sofia-pro text-18 mb-3-profile mb-0 ml-3 triggerText'>
          Payment Method
        </h3>
        <span className='triggerArrow'>{isOpen ? '▲' : '▼'} </span>
      </div>
    );
  };

  /**
   * Elements are now separate functions for ease of folding
   */

  return (
    <>
      <div id='Payment'>
        <Collapsible
          open={isOpen}
          onTriggerOpening={() => setIsOpen(true)}
          onTriggerClosing={() => setIsOpen(false)}
          trigger={renderTrigger()}
          overflowWhenOpen='visible'
        >
          <div className='card shadow-sm p-3 max-w-840 mt-4'>
            {!isEditing && renderPaymentMethods()}
            {/* MOBILE VIEW */}
            {isMobile && renderPaymentMobileView()}

            {/* DESKTOP VIEW */}
            {!isMobile && renderPaymentDesktopView()}
          </div>
        </Collapsible>
      </div>
    </>
  );
}
