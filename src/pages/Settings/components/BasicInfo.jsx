import React, { useEffect, useState } from 'react';
import USA_STATES from '../../../assets/usa_states.json';
import { formatPhoneNumber } from '../../../utils/form';
import { Form, Button, Row, Col, Spinner } from 'react-bootstrap';
import $ from 'jquery';
import { useFormik } from 'formik';
import { pickUpAddressSchema } from '../../../models/formSchema';
import { updateUserAttributes } from '../../../utils/auth';
import { AlertCircle, CheckCircle } from 'react-feather';

export default function BasicInfo({ user }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const {
    errors,
    handleChange,
    setFieldValue,
    values: addressFormValues,
  } = useFormik({
    initialValues: {
      fullName: '',
      state: '',
      zipCode: '',
      line1: '',
      line2: '',
      phoneNumber: '',
    },
    validationSchema: pickUpAddressSchema,
  });

  const renderInlineError = (errors) => (
    <small className='form-text p-0 m-0 noted-red'>{errors}</small>
  );

  useEffect(() => {
    // console.log({ user });

    if (user) {
      setFieldValue('fullName', user.name);
      setFieldValue('phoneNumber', user['custom:phone']);
      setFieldValue('line1', user.address);
      setFieldValue('line2', user['custom:address_2']);
      setFieldValue('zipCode', user['custom:zipcode']);
      setFieldValue('state', user['custom:state']);
    }
  }, [user]);

  const updateBasicInfo = async () => {
    console.log(addressFormValues);
    setError(false);
    setSuccess(false);
    setIsSubmitting(true);

    try {
      const attributes = {
        name: addressFormValues.fullName || '',
        'custom:phone': addressFormValues.phoneNumber || '',
        address: addressFormValues.line1 || '',
        'custom:address_2': addressFormValues.line2 || '',
        'custom:state': addressFormValues.state || '',
        'custom:zipcode': addressFormValues.zipCode || '',
      };

      await updateUserAttributes(attributes);
      setIsSubmitting(false);

      if (
        !addressFormValues.fullName ||
        !addressFormValues.phoneNumber ||
        !addressFormValues.line1 ||
        !addressFormValues.line2 ||
        !addressFormValues.state ||
        !addressFormValues.zipCode
      ) {
        setSuccess(false);
        setError('Missing field. Please complete the form.');
      } else {
        setError(false);
        setSuccess(true);
      }
    } catch (err) {
      console.log(err);
      setSuccess(false);
      setError(true);

      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const platform = window.navigator.platform;
    const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];

    if (windowsPlatforms.indexOf(platform) !== -1) {
      // Windows 10 Chrome
      $('.btn-done').css('padding-bottom', '10px');
    }
  }, []);

  const noBorder = !isEditing
    ? {
        style: {
          border: 'none',
          padding: '0px',
        },
        disabled: true,
      }
    : {};

  console.log(errors.state);

  return (
    <div id='BasicInfo'>
      <h3 className='sofia-pro text-18 mb-4'>Basic Information</h3>
      {success && (
        <div className='alert alert-success w-840' role='alert'>
          <div>
            <h4 className='text-center text-alert'>
              <CheckCircle />
              &nbsp;&nbsp;&nbsp;Success
            </h4>
          </div>
        </div>
      )}
      {error && (
        <div className='alert alert-danger w-840' role='alert'>
          <div>
            <h4 className='text-center text-alert'>
              <AlertCircle />
              &nbsp;&nbsp;&nbsp;{error}
            </h4>
          </div>
        </div>
      )}
      <div className='card shadow-sm mb-2 p-3 w-840'>
        <div className='card-body'>
          <Form id='Info'>
            <Row>
              <Col xs={6}>
                <Form.Group>
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    className='form-control-lg'
                    type='name'
                    name='fullName'
                    value={addressFormValues.fullName || ''}
                    {...noBorder}
                    onChange={handleChange}
                  />
                  {addressFormValues.fullName.length > 0 ||
                    renderInlineError(errors.fullName)}
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>State</Form.Label>
                  {isEditing && (
                    <Form.Control
                      className='form-control-md'
                      as='select'
                      value={addressFormValues.state || ''}
                      name='state'
                      onChange={handleChange}
                      placeholder='Select State'
                      defaultValue='null'
                      {...noBorder}
                    >
                      {[
                        { abbreviation: '', name: 'Select State' },
                        ...USA_STATES,
                      ].map(({ name, abbreviation }) => (
                        <option value={abbreviation} key={`${abbreviation}`}>
                          {name}
                        </option>
                      ))}
                    </Form.Control>
                  )}
                  {addressFormValues.state.length > 0 ||
                    renderInlineError(errors.state)}

                  {!isEditing && (
                    <Form.Control
                      className='form-control-sm'
                      type='zip code'
                      value={addressFormValues.state}
                      {...noBorder}
                    />
                  )}
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Zip Code</Form.Label>
                  <Form.Control
                    className='form-control-sm'
                    onChange={(e) => {
                      const re = /^[0-9\b]+$/;
                      if (e.target.value === '' || re.test(e.target.value)) {
                        handleChange(e);
                      }
                    }}
                    name='zipCode'
                    type='zip code'
                    value={addressFormValues.zipCode || ''}
                    {...noBorder}
                  />
                  {addressFormValues.zipCode.length > 0 ||
                    renderInlineError(errors.zipCode)}
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>Address Line 1</Form.Label>
                  <Form.Control
                    className='form-control-lg'
                    type='name'
                    name='line1'
                    onChange={handleChange}
                    value={addressFormValues.line1 || ''}
                    {...noBorder}
                  />
                  {addressFormValues.line1.length > 0 ||
                    renderInlineError(errors.line1)}
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    className='form-control-lg'
                    type='phone number'
                    onChange={(e) => {
                      const re = /^[0-9\b]+$/;
                      if (e.target.value === '' || re.test(e.target.value)) {
                        handleChange(e);
                      }
                    }}
                    value={
                      formatPhoneNumber(addressFormValues.phoneNumber) || ''
                    }
                    name='phoneNumber'
                    maxLength={13}
                    {...noBorder}
                  />
                  {renderInlineError(errors.phoneNumber)}
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col xs={6}>
                <Form.Group>
                  <Form.Label>Address Line 2</Form.Label>
                  <Form.Control
                    className='form-control-lg'
                    type='name'
                    value={addressFormValues.line2 || ''}
                    name='line2'
                    onChange={handleChange}
                    {...noBorder}
                  />
                  {addressFormValues.line2.length > 0 ||
                    renderInlineError(errors.line2)}
                </Form.Group>
              </Col>

              <Col className='btn-container'>
                {isEditing && (
                  <Button
                    className='btn-done'
                    type='submit'
                    onClick={(e) => {
                      e.preventDefault();
                      setIsEditing(false);
                      updateBasicInfo();
                    }}
                  >
                    Done
                  </Button>
                )}
                {!isEditing && (
                  <Button
                    className='btn-done'
                    type='submit'
                    onClick={(e) => {
                      e.preventDefault();
                      setIsEditing(true);
                    }}
                  >
                    {!isSubmitting ? (
                      'Edit'
                    ) : (
                      <Spinner
                        animation='border'
                        size='sm'
                        className='spinner'
                      />
                    )}
                  </Button>
                )}
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    </div>
  );
}
