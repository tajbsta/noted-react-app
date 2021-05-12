import React, { useEffect, useState } from 'react';
import USA_STATES from '../../../assets/usa_states.json';
import { formatPhoneNumber } from '../../../utils/form';
import { Form, Button, Row, Col, Spinner } from 'react-bootstrap';
import $ from 'jquery';
import { useFormik } from 'formik';
import { pickUpAddressSchema } from '../../../models/formSchema';
import { updateUserAttributes } from '../../../utils/auth';
import { AlertCircle, CheckCircle } from 'react-feather';
import Collapsible from 'react-collapsible';
import { showError, showSuccess } from '../../../library/notifications.library';

export default function BasicInfo({ user }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 991);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  const {
    errors: addressFormErrors,
    handleChange,
    values: addressFormValues,
    touched,
    handleBlur,
  } = useFormik({
    initialValues: {
      fullName: user.name,
      phoneNumber: user['custom:phone'],
      line1: user.address,
      city: user['custom:city'],
      state: user['custom:state'],
      zipCode: user['custom:zipcode'],
    },
    validationSchema: pickUpAddressSchema,
    enableReinitialize: true,
  });

  const renderInlineValidationError = (fieldName) => {
    const error = addressFormErrors[fieldName];
    return (
      touched[fieldName] &&
      error && <small className='form-text p-0 m-0 noted-red'>{error}</small>
    );
  };

  const {
    fullName,
    phoneNumber,
    line1,
    line2,
    city,
    state,
    zipCode,
  } = addressFormValues;

  const updateBasicInfo = async () => {
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
        showError({ message: 'Missing field. Please complete the form.' });
      } else {
        showSuccess({ message: 'Updated address information' });
        setError(false);
        setSuccess(true);
      }
    } catch (err) {
      showSuccess({ message: 'Error updating address information' });
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

  const renderMobileView = () => {
    return (
      <>
        <Collapsible
          open={isOpen}
          onTriggerOpening={() => setIsOpen(true)}
          onTriggerClosing={() => setIsOpen(false)}
          trigger={
            <div className='triggerContainer'>
              <h3 className='sofia-pro text-18 mb-3-profile mb-0 ml-3 triggerText'>
                Basic Information
              </h3>
              <span className='triggerArrow'>{isOpen ? '▲' : '▼'} </span>
            </div>
          }
        >
          <div className='card shadow-sm mt-3 mb-2 p-3 mt-4 max-w-840'>
            <div className='m-card-body'>
              <Form id='Info'>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control
                        className='form-control'
                        type='name'
                        name='fullName'
                        onBlur={handleBlur}
                        value={fullName || ''}
                        {...noBorder}
                        onChange={handleChange}
                      />
                      {renderInlineValidationError('fullName')}
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>State</Form.Label>
                      {isEditing && (
                        <Form.Control
                          className='form-control'
                          as='select'
                          value={state || ''}
                          name='state'
                          onChange={handleChange}
                          placeholder='Select State'
                          onBlur={handleBlur}
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
                      {renderInlineValidationError('state')}

                      {!isEditing && (
                        <Form.Control
                          onBlur={handleBlur}
                          className='form-control'
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
                        onBlur={handleBlur}
                        className='form-control'
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
                      {renderInlineValidationError('zipCode')}
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>Address Line 1</Form.Label>
                      <Form.Control
                        onBlur={handleBlur}
                        className='form-control'
                        type='name'
                        name='line1'
                        onChange={handleChange}
                        value={line1 || ''}
                        {...noBorder}
                      />
                      {renderInlineValidationError('line1')}
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>Address Line 2</Form.Label>
                      <Form.Control
                        onBlur={handleBlur}
                        className='form-control'
                        type='name'
                        value={line2 || ''}
                        name='line2'
                        onChange={handleChange}
                        {...noBorder}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>City</Form.Label>
                      <Form.Control
                        onBlur={handleBlur}
                        className='form-control'
                        type='city'
                        name='city'
                        value={city || ''}
                        onChange={handleChange}
                        {...noBorder}
                      />
                      {renderInlineValidationError('city')}
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label>Phone</Form.Label>
                      <Form.Control
                        onBlur={handleBlur}
                        className='form-control'
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
                      {renderInlineValidationError('phoneNumber')}
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col className='m-btn-col'>
                    {isEditing && (
                      <Button
                        className='m-btn-done'
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
                        className='m-btn-edit'
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
        <hr />
      </>
    );
  };

  const renderDesktopView = () => {
    return (
      <>
        <div className='card shadow-sm mb-2 p-3 max-w-840'>
          <div className='card-body'>
            <Form id='Info'>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      onBlur={handleBlur}
                      className='form-control-lg'
                      type='name'
                      name='fullName'
                      value={fullName || ''}
                      {...noBorder}
                      onChange={handleChange}
                    />
                    {renderInlineValidationError('fullName')}
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>State</Form.Label>
                    {isEditing && (
                      <Form.Control
                        onBlur={handleBlur}
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
                          <option value={abbreviation} key={`${abbreviation}`}>
                            {name}
                          </option>
                        ))}
                      </Form.Control>
                    )}
                    {renderInlineValidationError('state')}

                    {!isEditing && (
                      <Form.Control
                        onBlur={handleBlur}
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
                      onBlur={handleBlur}
                      className='form-control-md'
                      onChange={(e) => {
                        const re = /^[0-9\b]+$/;
                        if (e.target.value === '' || re.test(e.target.value)) {
                          handleChange(e);
                        }
                      }}
                      name='zipCode'
                      type='zip code'
                      value={zipCode || ''}
                      {...noBorder}
                    />
                    {renderInlineValidationError('zipCode')}
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>Address Line 1</Form.Label>
                    <Form.Control
                      onBlur={handleBlur}
                      className='form-control-lg'
                      type='name'
                      name='line1'
                      onChange={handleChange}
                      value={line1 || ''}
                      {...noBorder}
                    />
                    {renderInlineValidationError('line1')}
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>City</Form.Label>
                    <Form.Control
                      onBlur={handleBlur}
                      className='form-control-md'
                      type='city'
                      name='city'
                      value={city || ''}
                      onChange={handleChange}
                      {...noBorder}
                    />
                    {renderInlineValidationError('city')}
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      onBlur={handleBlur}
                      className='form-control-md'
                      type='phone number'
                      onChange={(e) => {
                        const re = /^[0-9\b]+$/;
                        if (e.target.value === '' || re.test(e.target.value)) {
                          handleChange(e);
                        }
                      }}
                      value={formatPhoneNumber(phoneNumber) || ''}
                      name='phoneNumber'
                      maxLength={13}
                      {...noBorder}
                    />
                    {renderInlineValidationError('phoneNumber')}
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col xs={6}>
                  <Form.Group>
                    <Form.Label>Address Line 2</Form.Label>
                    <Form.Control
                      onBlur={handleBlur}
                      className='form-control-lg'
                      type='name'
                      value={line2 || ''}
                      name='line2'
                      onChange={handleChange}
                      {...noBorder}
                    />
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
      </>
    );
  };

  const renderDesktopTitle = () => {
    {
      return (
        !isMobile && (
          <h3 className='sofia-pro text-18 mb-4'>Basic Information</h3>
        )
      );
    }
  };

  return (
    <div id='BasicInfo'>
      {renderDesktopTitle()}
      {success && (
        <div className='alert alert-success max-w-840' role='alert'>
          <div>
            <h4 className='text-center text-alert'>
              <CheckCircle />
              &nbsp;&nbsp;&nbsp;Success
            </h4>
          </div>
        </div>
      )}
      {error && (
        <div className='alert alert-danger max-w-840' role='alert'>
          <div>
            <h4 className='text-center text-alert'>
              <AlertCircle />
              &nbsp;&nbsp;&nbsp;{error}
            </h4>
          </div>
        </div>
      )}
      {/* START OF MOBILE VIEW */}
      {isMobile && renderMobileView()}
      {/* END OF MOBILE VIEW */}
      {!isMobile && renderDesktopView()}
    </div>
  );
}
