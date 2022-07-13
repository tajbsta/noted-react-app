import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Spinner, Button } from 'react-bootstrap';
import { useFormik } from 'formik';
import { AlertCircle, CheckCircle } from 'react-feather';
import { useDispatch } from 'react-redux';

import { newUserSchema } from '../../../models/formSchema';
import { formatPhoneNumber } from '../../../utils/form';
import { showError, showSuccess } from '../../../library/notifications.library';
import { supportedZipcode } from '../../../constants/utils';
import ZipCodeNotSupportedModal from '../../../modals/ZipCodeNotSupportedModal';

import { updateUserAttributes, getUser } from '../../../api/auth';
import { saveUserDataToMailchimp } from '../../../api/userApi';
import { createUnsupportedUser } from '../../../api/accountsApi';
import { setIsInfoAdded } from '../../../actions/auth.action';

const NewUserInfoPage = () => {
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState('');
  const [
    showZipcodeNotSupportedModal,
    setShowZipcodeNotSupportedModal,
  ] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    let isMounted = false;

    const fetchUser = async () => {
      const user = await getUser();
      setEmail(user.email);
    };

    if (!isMounted) {
      fetchUser();
    }

    return () => {
      isMounted = true;
    };
  });

  const {
    errors,
    values,
    setFieldValue,
    touched,
    handleBlur,
    handleSubmit,
    handleChange,
  } = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      zipCode: '',
      phoneNumber: '',
    },
    validationSchema: newUserSchema,
    async onSubmit(values) {
      setIsSubmitting(true);
      const { firstName, lastName, zipCode, phoneNumber } = values;
      const isZipCodeSupported = supportedZipcode.includes(zipCode);

      const data = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        zipcode: zipCode.trim(),
      };

      try {
        await updateUserAttributes({
          'custom:phone': phoneNumber.trim(),
          'custom:zipcode': zipCode.trim(),
          'custom:fullname': `${firstName.trim()} ${lastName.trim()}`,
        });

        await saveUserDataToMailchimp(data);

        if (isZipCodeSupported) {
          setIsSubmitting(false);
          dispatch(setIsInfoAdded(true));
        } else {
          setShowZipcodeNotSupportedModal(true);
          await submitUnsupportedUserToAirtable(data);
        }
      } catch (error) {
        showError({
          message: (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <AlertCircle />
              <h4 className='ml-3 mb-0' style={{ lineHeight: '16px' }}>
                Something went wrong, try again later.
              </h4>
            </div>
          ),
        });
        setIsSubmitting(false);
      }
    },
  });

  const submitUnsupportedUserToAirtable = async (data) => {
    try {
      await createUnsupportedUser(data);
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
    } catch (error) {
      showError({
        message:
          'An error occurred while submitting your details, please try again later',
      });
    }
  };

  return (
    <div id='new-user-info-form'>
      <Form>
        <div className='mb-6'>
          <p className='font-xl text-center' style={{ fontSize: 18 }}>
            Create your profile by filling out the info below!
          </p>
        </div>
        {error && (
          <div className='alert alert-danger' role='alert'>
            <h4 className='text-center text-alert'>{error}</h4>
          </div>
        )}

        <Row>
          <Col>
            <Form.Group>
              <Form.Label>First Name</Form.Label>
              <Form.Control
                className='form-control'
                autoComplete='off'
                type='firstName'
                name='firstName'
                onBlur={handleBlur}
                value={values.firstName}
                onChange={handleChange}
                isInvalid={touched.firstName && errors.firstName}
              />
              <Form.Control.Feedback type='invalid'>
                {errors.firstName}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                className='form-control'
                autoComplete='off'
                type='lastName'
                name='lastName'
                onBlur={handleBlur}
                value={values.lastName}
                onChange={handleChange}
                isInvalid={touched.lastName && errors.lastName}
              />
              <Form.Control.Feedback type='invalid'>
                {errors.lastName}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                className='form-control'
                autoComplete='off'
                type='email'
                name='email'
                onBlur={handleBlur}
                value={email}
                onChange={handleChange}
                isInvalid={touched.email && errors.email}
                disabled
                style={{ background: '#EFEFEF' }}
              />
              <Form.Control.Feedback type='invalid'>
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col sm={6}>
            <Form.Group>
              <Form.Label>Zip Code</Form.Label>
              <Form.Control
                className='form-control'
                autoComplete='off'
                type='name'
                name='zipCode'
                onBlur={handleBlur}
                value={values.zipCode}
                onChange={handleChange}
                isInvalid={touched.zipCode && errors.zipCode}
              />
              <Form.Control.Feedback type='invalid'>
                {errors.zipCode}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col sm={6}>
            <Form.Group>
              <Form.Label>Phone</Form.Label>
              <Form.Control
                className='form-control'
                autoComplete='off'
                type='name'
                name='phoneNumber'
                onBlur={handleBlur}
                onChange={(e) => {
                  const re = /^[0-9\b]+$/;
                  if (e.target.value === '' || re.test(e.target.value)) {
                    setFieldValue('phoneNumber', e.target.value);
                  }
                }}
                value={formatPhoneNumber(values.phoneNumber) || ''}
                maxLength={13}
                isInvalid={touched.phoneNumber && errors.phoneNumber}
              />
              <Form.Control.Feedback type='invalid'>
                {errors.phoneNumber}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Button
          variant='primary'
          className='btn btn-lg btn-block mt-5'
          type='submit'
          onClick={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          {!isSubmitting ? (
            <>Submit</>
          ) : (
            <Spinner
              animation='border'
              size='sm'
              className='spinner btn-spinner'
            />
          )}
        </Button>
      </Form>

      <ZipCodeNotSupportedModal
        show={showZipcodeNotSupportedModal}
        onContinue={() => {
          setShowZipcodeNotSupportedModal(false);
          setIsSubmitting(false);
          dispatch(setIsInfoAdded(true));
        }}
      />
    </div>
  );
};

export default NewUserInfoPage;
