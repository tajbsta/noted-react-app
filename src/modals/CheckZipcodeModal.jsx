import { isEmpty } from '@aws-amplify/core';
import { useFormik } from 'formik';
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';

import { Modal, Button, Form, Spinner, Row, Col } from 'react-bootstrap';
import { CheckCircle } from 'react-feather';
import { createUnsupportedUser } from '../api/accountsApi';
import { showError, showSuccess } from '../library/notifications.library';
import {
  checkZipcodeSchema,
  collateUserInfoSchema,
} from '../models/formSchema';
import { LEAD } from '../analytics/fbpixels';

export default function CheckZipcodeModal(props) {
  const [zipCode, setZipCode] = useState('');
  const history = useHistory();

  return (
    <div>
      <Modal
        show={props.show}
        size='lg'
        aria-labelledby='contained-modal-title-vcenter'
        centered
        backdrop='static'
        keyboard={false}
        animation={false}
        id='CheckZipcodeModal'
      >
        <Modal.Header closeButton onClick={props.onHide}></Modal.Header>
        <Modal.Body className='sofia-pro modal-body'>
          {!zipCode && (
            <CheckForZipCode
              onHide={props.onHide}
              updateZipCode={setZipCode}
              history={history}
            />
          )}
          {zipCode && (
            <CollateUserInfo
              onHide={props.onHide}
              updateZipCode={setZipCode}
              zipCode={zipCode}
            />
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}

const CheckForZipCode = (props) => {
  const checkZipcodeFormik = useFormik({
    initialValues: {
      zipCode: '',
    },
    validationSchema: checkZipcodeSchema,
  });

  const handleChangeZipCode = (e) => {
    checkZipcodeFormik.setFieldValue('zipCode', e.target.value, true);
  };

  const handleCheckZipcode = async (e) => {
    e.preventDefault();
    const errors = await checkZipcodeFormik.validateForm();

    const errorMessage = Object.values(errors)[0];
    const errorKey = Object.keys(errors)[0];
    const noOfErrors = Object.entries(errors).length;

    if (
      noOfErrors === 1 &&
      errorMessage === 'not available' &&
      errorKey === 'zipCode'
    ) {
      //SHOW FORM
      props.updateZipCode(checkZipcodeFormik.values.zipCode);
      return;
    }

    props.history.push('/checkout');
    props.onHide();
  };

  return (
    <div id='checkForZipForm'>
      <p className='zipcodeText sofia-pro'>What is your zip code?</p>
      <Form onSubmit={handleCheckZipcode}>
        <Form.Group>
          <div>
            <Form.Control
              style={{ maxWidth: 'none' }}
              type='text'
              isValid={checkZipcodeFormik.values.zipCode}
              isInvalid={checkZipcodeFormik.errors.zipCode}
              name='zipCode'
              placeholder='Enter your Zip Code'
              value={checkZipcodeFormik.values.zipCode}
              onChange={handleChangeZipCode}
              required
              minLength={4}
            />
          </div>
        </Form.Group>
        <Button
          className='btn btn-lg btn-block btn-green btn-submit'
          type='submit'
          onClick={() => process.env.NODE_ENV === 'production' && LEAD}
        >
          Continue
        </Button>
      </Form>
    </div>
  );
};

const CollateUserInfo = (props) => {
  const [isSubmittingUserInfo, setIsSubmittingUserInfo] = useState(false);
  const collateUserInfoFormik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      zipCode: '',
    },
    validationSchema: collateUserInfoSchema,
  });

  const handleChangeFirstName = (e) => {
    collateUserInfoFormik.setFieldValue('firstName', e.target.value);
  };

  const handleChangeLastName = (e) => {
    collateUserInfoFormik.setFieldValue('lastName', e.target.value);
  };

  const handleChangeEmail = (e) => {
    collateUserInfoFormik.setFieldValue('email', e.target.value);
  };

  const handleChangeZipCode = (e) => {
    collateUserInfoFormik.setFieldValue('zipCode', e.target.value);
  };

  const handleSubmitUserInfo = async (e) => {
    e.preventDefault();

    const errors = await collateUserInfoFormik.validateForm();

    if (!isEmpty(errors)) {
      return;
    }

    const {
      firstName,
      lastName,
      email,
      zipCode,
    } = collateUserInfoFormik.values;

    const data = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      zipcode: zipCode.trim(),
    };

    setIsSubmittingUserInfo(true);

    try {
      //HANDLE SENDING DATA TO BE HERE
      const response = await createUnsupportedUser(data);
      console.log(response);
      showSuccess({
        message: (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <CheckCircle />
            <h4 className='ml-3 mb-0' style={{ lineHeight: '16px' }}>
              Details submitted successfully. You will be notified as soon as we
              are in your neighbourhood
            </h4>
          </div>
        ),
      });
      setTimeout(() => {
        // window.location.href = 'https://notedreturns.com';
        props.updateZipCode('');
        props.onHide();
      }, 3000);
      setIsSubmittingUserInfo(false);
    } catch (e) {
      setIsSubmittingUserInfo(false);
      showError({
        message:
          'An error occurred while submitting your details, please try again later',
      });
    }

    console.log(data);
  };

  const handleCancel = async () => {
    collateUserInfoFormik.resetForm();
    setIsSubmittingUserInfo(false);
    props.updateZipCode('');
  };

  const renderInlineError = (errors) => (
    <small className='form-text pl-2 p-0 m-0 noted-red'>{errors}</small>
  );

  useEffect(() => {
    collateUserInfoFormik.setFieldValue('zipCode', props.zipCode);
  }, [props.zipCode]);

  return (
    <div id='collateUserInfoForm'>
      <p className='unsupported sofia-pro noted-red'>Unsupported Location</p>
      <p className='sofia-pro noted-purple unsupported-mini'>
        Our service is rapidly expanding to other cities! Stay tuned for
        updates, and we will let you know when we are ready to pick up in your
        area!
      </p>
      <Form onSubmit={handleSubmitUserInfo}>
        <Row>
          <Col>
            <Form.Group>
              <div>
                <Form.Control
                  style={{ maxWidth: 'none' }}
                  type='text'
                  isValid={
                    collateUserInfoFormik.touched.firstName &&
                    isEmpty(collateUserInfoFormik.errors.firstName)
                  }
                  isInvalid={
                    collateUserInfoFormik.touched.firstName &&
                    !isEmpty(collateUserInfoFormik.errors.firstName)
                  }
                  name='firstName'
                  placeholder='First Name'
                  value={collateUserInfoFormik.values.firstName}
                  onBlur={collateUserInfoFormik.handleBlur('firstName')}
                  onChange={handleChangeFirstName}
                  required
                  disabled={isSubmittingUserInfo}
                />
              </div>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <div>
                <Form.Control
                  style={{ maxWidth: 'none' }}
                  type='text'
                  isValid={
                    collateUserInfoFormik.touched.lastName &&
                    isEmpty(collateUserInfoFormik.errors.lastName)
                  }
                  isInvalid={
                    collateUserInfoFormik.touched.lastName &&
                    !isEmpty(collateUserInfoFormik.errors.lastName)
                  }
                  name='lastName'
                  placeholder='Last Name'
                  value={collateUserInfoFormik.values.lastName}
                  onChange={handleChangeLastName}
                  onBlur={collateUserInfoFormik.handleBlur('lastName')}
                  required
                  disabled={isSubmittingUserInfo}
                />
              </div>
            </Form.Group>
          </Col>
        </Row>
        <Form.Group>
          <div className='input-container'>
            <Form.Control
              style={{ maxWidth: 'none' }}
              type='text'
              isValid={
                collateUserInfoFormik.touched.email &&
                isEmpty(collateUserInfoFormik.errors.email)
              }
              isInvalid={
                collateUserInfoFormik.touched.email &&
                !isEmpty(collateUserInfoFormik.errors.email)
              }
              name='email'
              placeholder='Email'
              value={collateUserInfoFormik.values.email}
              onChange={handleChangeEmail}
              onBlur={collateUserInfoFormik.handleBlur('email')}
              required
              disabled={isSubmittingUserInfo}
            />
            {collateUserInfoFormik.touched.email &&
              collateUserInfoFormik.errors.email &&
              renderInlineError(collateUserInfoFormik.errors.email)}
          </div>
        </Form.Group>
        <Form.Group>
          <div>
            <Form.Control
              style={{ maxWidth: 'none' }}
              type='text'
              isValid={
                collateUserInfoFormik.touched.zipCode &&
                isEmpty(collateUserInfoFormik.errors.zipCode)
              }
              isInvalid={
                collateUserInfoFormik.touched.zipCode &&
                !isEmpty(collateUserInfoFormik.errors.zipCode)
              }
              name='zipCode'
              placeholder='Zip Code'
              value={collateUserInfoFormik.values.zipCode}
              onChange={handleChangeZipCode}
              onBlur={collateUserInfoFormik.handleBlur('zipCode')}
              required
              disabled={isSubmittingUserInfo}
            />
            {collateUserInfoFormik.errors.zipCode &&
              renderInlineError(collateUserInfoFormik.errors.zipCode)}
          </div>
        </Form.Group>
        <Button
          className='btn btn-lg btn-block btn-green btn-submit'
          type='submit'
          disabled={isSubmittingUserInfo}
        >
          {isSubmittingUserInfo ? 'Subscribing' : 'Subscribe'}
          {isSubmittingUserInfo && (
            <Spinner
              animation='border'
              size='sm'
              style={{
                color: '#fff',
                opacity: '1',
                marginLeft: '8px',
              }}
              className='spinner'
            />
          )}
        </Button>
        <Button className='btn-cancel btn-lg btn-block' onClick={handleCancel}>
          Cancel
        </Button>
      </Form>
    </div>
  );
};
