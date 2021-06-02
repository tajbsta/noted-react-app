import React, { useEffect, useState } from 'react';
import USA_STATES from '../../../assets/usa_states.json';
import { formatPhoneNumber } from '../../../utils/form';
import { Form, Button, Row, Col, Spinner } from 'react-bootstrap';
import $ from 'jquery';
import AddPickupModal from '../../../modals/AddPickupModal';
import Collapsible from 'react-collapsible';
import { useFormik } from 'formik';
import { pickUpAddressSchema } from '../../../models/formSchema';
import { updateUserAttributes } from '../../../api/auth';
import { CheckCircle } from 'react-feather';
import { showError, showSuccess } from '../../../library/notifications.library';

export default function Address({ user }) {
  const [isEditing, setIsEditing] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

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
      instructions: '',
    },
    validationSchema: pickUpAddressSchema,
  });

  /**
   * Handle focus
   */

  const [focused, setFocused] = useState({
    ...Object.keys((key) => ({ [key]: false })),
  });

  useEffect(() => {
    if (user) {
      setFieldValue('fullName', user.name);
      setFieldValue('phoneNumber', user['custom:phone']);
      setFieldValue('line1', user.address);
      setFieldValue('line2', user['custom:address_2']);
      setFieldValue('city', user['custom:city']);
      setFieldValue('state', user['custom:state']);
      setFieldValue('zipCode', user['custom:zipcode']);
      setFieldValue('instructions', user['custom:pickup_instructions']);
    }
  }, [user]);

  const {
    fullName = '',
    phoneNumber = '',
    line1 = '',
    line2 = '',
    city = '',
    state = '',
    zipCode,
    instructions = '',
  } = addressFormValues;

  const renderInlineValidationError = (fieldName) => {
    const error = errors[fieldName];
    return (
      focused[fieldName] &&
      error && <small className='form-text p-0 m-0 noted-red'>{error}</small>
    );
  };

  const onFocus = (e) => {
    setFocused({ ...focused, [e.target.name]: true });
  };

  const updateAddress = async () => {
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
        'custom:pickup_instructions': instructions,
      };

      await updateUserAttributes(attributes);
      setIsSubmitting(false);

      if (!fullName || !phoneNumber || !city || !line1 || !state || !zipCode) {
        setSuccess(false);
        showError({ message: 'Please complete the form.' });
      } else {
        showSuccess({
          message: (
            <div>
              <CheckCircle />
              &nbsp;&nbsp;Successfully updated!
            </div>
          ),
        });
      }
    } catch (err) {
      showError({ message: 'Error updating information' });

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

  const renderAddressMobileView = () => {
    return (
      <>
        <div className='card shadow-sm mb-2 p-3 max-w-840 mt-4'>
          <div className='m-card-body'>
            <Form id='Info'>
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
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      className='form-control'
                      type='name'
                      name='fullName'
                      value={fullName || ''}
                      {...noBorder}
                      onChange={handleChange}
                      onFocus={onFocus}
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
                        {...noBorder}
                        onFocus={onFocus}
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
                      className='form-control'
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
                      onFocus={onFocus}
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
                      className='form-control'
                      type='name'
                      name='line1'
                      onChange={handleChange}
                      value={line1 || ''}
                      {...noBorder}
                      onFocus={onFocus}
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
                      className='form-control'
                      type='name'
                      value={line2 || ''}
                      name='line2'
                      onChange={handleChange}
                      {...noBorder}
                      onFocus={onFocus}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>City</Form.Label>
                    <Form.Control
                      className='form-control'
                      type='city'
                      name='city'
                      value={city || ''}
                      onChange={handleChange}
                      {...noBorder}
                      onFocus={onFocus}
                    />
                    {renderInlineValidationError('city')}
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      className='form-control'
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
                      onFocus={onFocus}
                    />
                    {renderInlineValidationError('phoneNumber')}
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col className='add-pick-up'>
                  <button
                    className='btn-instructions'
                    onClick={(e) => {
                      e.preventDefault();
                      setModalShow(true);
                    }}
                  >
                    <h4 className='text-instructions'>
                      {instructions.length > 0 ? 'Edit' : 'Add'} pick-up
                      instructions
                    </h4>
                  </button>
                </Col>

                <Col className='m-btn-col'>
                  {isEditing && (
                    <Button
                      className='m-btn-done'
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
      </>
    );
  };

  const renderAddressDesktopView = () => {
    return (
      <>
        <div className='card shadow-sm p-3 max-w-840 mt-4 ml-3'>
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
                      onFocus={onFocus}
                    />

                    {renderInlineValidationError('fullName')}
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
                        {...noBorder}
                        onFocus={onFocus}
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
                        if (e.target.value === '' || re.test(e.target.value)) {
                          handleChange(e);
                        }
                      }}
                      name='zipCode'
                      type='zip code'
                      value={zipCode || ''}
                      {...noBorder}
                      onFocus={onFocus}
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
                      className='form-control-lg'
                      type='name'
                      name='line1'
                      onChange={handleChange}
                      value={line1 || ''}
                      {...noBorder}
                      onFocus={onFocus}
                    />
                    {renderInlineValidationError('line1')}
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
                      onFocus={onFocus}
                    />
                    {renderInlineValidationError('city')}
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
                        if (e.target.value === '' || re.test(e.target.value)) {
                          handleChange(e);
                        }
                      }}
                      value={formatPhoneNumber(phoneNumber) || ''}
                      name='phoneNumber'
                      maxLength={13}
                      {...noBorder}
                      onFocus={onFocus}
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
                      className='form-control-lg'
                      type='name'
                      value={line2 || ''}
                      name='line2'
                      onChange={handleChange}
                      {...noBorder}
                      onFocus={onFocus}
                    />
                  </Form.Group>
                </Col>

                <Col className='add-pick-up'>
                  <button
                    className='btn-instructions'
                    onClick={(e) => {
                      e.preventDefault();
                      setModalShow(true);
                    }}
                  >
                    <h4 className='text-instructions'>
                      {instructions.length > 0 ? 'Edit' : 'Add'} pick-up
                      instructions
                    </h4>
                  </button>
                </Col>

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
      </>
    );
  };

  const renderTrigger = () => {
    return (
      <div className='triggerContainer'>
        <h3 className='sofia-pro text-18 mb-3-profile mb-0 ml-3 triggerText'>
          Pick-up Address
        </h3>

        <span className='triggerArrow'>{isOpen ? '▲' : '▼'} </span>
      </div>
    );
  };

  return (
    <>
      <div id='Address'>
        <Collapsible
          animation={false}
          open={isOpen}
          onTriggerOpening={() => setIsOpen(true)}
          onTriggerClosing={() => setIsOpen(false)}
          trigger={renderTrigger()}
        >
          {isMobile && renderAddressMobileView()}
          {!isMobile && renderAddressDesktopView()}
        </Collapsible>
        <AddPickupModal
          show={modalShow}
          onHide={() => setModalShow(false)}
          setFieldValue={setFieldValue}
          instructions={instructions}
        />
      </div>
    </>
  );
}
