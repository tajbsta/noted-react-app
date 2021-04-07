import React, { useEffect, useState } from 'react';
import USA_STATES from '../../../assets/usa_states.json';
import { formatPhoneNumber } from '../../../utils/form';
import { Form, Button, Row, Col, Spinner } from 'react-bootstrap';
import $ from 'jquery';
import AddPickupModal from '../../../modals/AddPickupModal';
import Collapsible from 'react-collapsible';
import { useFormik } from 'formik';
import { pickUpAddressSchema } from '../../../models/formSchema';
import { updateUserAttributes } from '../../../utils/auth';
import { AlertCircle, CheckCircle } from 'react-feather';

export default function Address({ user }) {
  const [isEditing, setIsEditing] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
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
      phoneNumber: '',
      line1: '',
      city: '',
      state: '',
      zipCode: '',
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
      setFieldValue('city', user['custom:city']);
      setFieldValue('state', user['custom:state']);
      setFieldValue('zipCode', user['custom:zipcode']);
    }
  }, [user]);

  const fullName = addressFormValues.fullName;
  const phoneNumber = addressFormValues.phoneNumber;
  const line1 = addressFormValues.line1;
  const line2 = addressFormValues.line2;
  const city = addressFormValues.city;
  const state = addressFormValues.state;
  const zipCode = addressFormValues.zipCode;

  const updateAddress = async () => {
    console.log(addressFormValues);
    setError(false);
    setSuccess(false);
    setIsSubmitting(true);

    try {
      const attributes = {
        name: fullName || '',
        'custom:phone': phoneNumber || '',
        address: line1 || '',
        'custom:address_2': line2 || '',
        'custom:city': city || '',
        'custom:state': state || '',
        'custom:zipcode': zipCode || '',
      };

      await updateUserAttributes(attributes);
      setIsSubmitting(false);

      if (!fullName || !phoneNumber || !city || !line1 || !state || !zipCode) {
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

  return (
    <div id='Address'>
      <div className='row'>
        <Collapsible
          open={isOpen}
          onTriggerOpening={() => setIsOpen(true)}
          onTriggerClosing={() => setIsOpen(false)}
          trigger={
            <div className='triggerContainer'>
              <h3 className='sofia-pro text-18 mb-3-profile mb-0 ml-3 triggerText'>
                Pick-up Address
              </h3>

              <span className='triggerArrow'>{isOpen ? '▲' : '▼'} </span>
            </div>
          }
        >
          <div className='alert-container'>
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
          </div>
          <div className='card shadow-sm p-3 w-840 mt-4 ml-3'>
            <div className='card-body'>
              <Form id='Address'>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control
                        className='form-control-lg'
                        type='name'
                        name='fullName'
                        value={fullName || ''}
                        {...noBorder}
                        onChange={handleChange}
                      />
                      {(fullName && fullName.length > 0) ||
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
                          value={state || ''}
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
                            <option
                              value={abbreviation}
                              key={`${abbreviation}`}
                            >
                              {name}
                            </option>
                          ))}
                        </Form.Control>
                      )}
                      {(state && state.length > 0) ||
                        renderInlineError(errors.state)}

                      {!isEditing && (
                        <Form.Control
                          className='form-control-sm'
                          type='zip code'
                          value={state}
                          {...noBorder}
                        />
                      )}
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label>Zip Code</Form.Label>
                      <Form.Control
                        className='form-control-md'
                        onChange={(e) => {
                          const re = /^[0-9\b]+$/;
                          if (
                            e.target.value === '' ||
                            re.test(e.target.value)
                          ) {
                            handleChange(e);
                          }
                        }}
                        name='zipCode'
                        type='zip code'
                        value={zipCode || ''}
                        {...noBorder}
                      />
                      {(zipCode && zipCode.length > 0) ||
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
                        value={line1 || ''}
                        {...noBorder}
                      />
                      {(line1 && line1.length > 0) ||
                        renderInlineError(errors.line1)}
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label>City</Form.Label>
                      <Form.Control
                        className='form-control-md'
                        type='city'
                        name='city'
                        value={city || ''}
                        onChange={handleChange}
                        {...noBorder}
                      />
                      {(city && city.length > 0) ||
                        renderInlineError(errors.city)}
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label>Phone</Form.Label>
                      <Form.Control
                        className='form-control-md'
                        type='phone number'
                        onChange={(e) => {
                          const re = /^[0-9\b]+$/;
                          if (
                            e.target.value === '' ||
                            re.test(e.target.value)
                          ) {
                            handleChange(e);
                          }
                        }}
                        value={formatPhoneNumber(phoneNumber) || ''}
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
                        value={line2 || ''}
                        name='line2'
                        onChange={handleChange}
                        {...noBorder}
                      />
                    </Form.Group>
                  </Col>

                  <Col className='add-pick-up'>
                    <button
                      className='btn-instructions'
                      onClick={() => setModalShow(true)}
                    >
                      <h4 className='text-instructions'>
                        Add pick-up instructions
                      </h4>
                    </button>
                  </Col>

                  <AddPickupModal
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                  />

                  <Col className='btn-container'>
                    {isEditing && (
                      <Button
                        className='btn-done'
                        type='submit'
                        onClick={(e) => {
                          e.preventDefault();
                          setIsEditing(false);
                          updateAddress();
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
        </Collapsible>
      </div>
    </div>
  );
}
