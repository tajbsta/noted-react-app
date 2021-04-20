import React, { useEffect, useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import USA_STATES from '../assets/usa_states.json';
import { isFormEmpty, formatPhoneNumber } from '../utils/form';
import $ from 'jquery';
import { isEmpty, get } from 'lodash';
import AddPickupModal from '../modals/AddPickupModal';

export default function AddressForm({
  fullName = '',
  state = '',
  zipCode = '',
  line1 = '',
  line2 = '',
  city = '',
  phoneNumber = '',
  errors,
  handleChange,
  onDoneClick,
}) {
  const [modalShow, setModalShow] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const disableSubmit =
    isFormEmpty({
      fullName,
      state,
      zipCode,
      line1,
      city,
      phoneNumber,
    }) || !isFormEmpty({ ...errors });

  const renderInlineError = (error) => (
    <small className='form-text p-0 m-0 noted-red'>{error}</small>
  );

  useEffect(() => {
    const platform = window.navigator.platform;
    const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];

    if (windowsPlatforms.indexOf(platform) !== -1) {
      // Windows 10 Chrome
      $('.btn-done').css('padding-top', '9px');
    }
  }, []);

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

  return (
    <div>
      <div className='container mt-0'>
        <div className='row' style={{ margin: isMobile ? 'auto' : '' }}>
          <div
            className='col-sm-9 mt-2'
            style={{ margin: isMobile ? '16px' : '' }}
          >
            {/* START OF MOBILE VIEW */}
            {isMobile && (
              <>
                <h3
                  className='sofia-pro text-18'
                  style={{ marginBottom: '18px' }}
                >
                  Pick-up Details
                </h3>
                <h3
                  className='sofia-pro text-14'
                  style={{ marginBottom: '9px' }}
                >
                  Pick-up Address
                </h3>
                <div
                  className='card shadow-sm mb-2 p-3 max-w-840'
                  style={{ minHeight: '480px' }}
                >
                  <div
                    className='m-card-body'
                    style={{
                      paddingTop: '7px',
                    }}
                  >
                    <Form id='Info'>
                      <Row>
                        <Col>
                          <Button
                            type='button'
                            className='close'
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
                              onChange={handleChange}
                            />
                            {(fullName && fullName.length > 0) ||
                              renderInlineError(errors.fullName)}
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <Form.Group>
                            <Form.Label>State</Form.Label>
                            <Form.Control
                              className='form-control'
                              as='select'
                              value={state || ''}
                              name='state'
                              onChange={handleChange}
                              placeholder='Select State'
                              defaultValue='null'
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
                            {(state && state.length > 0) ||
                              renderInlineError(errors.state)}
                          </Form.Group>
                        </Col>
                        <Col>
                          <Form.Group>
                            <Form.Label>Zip Code</Form.Label>
                            <Form.Control
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
                              className='form-control'
                              type='name'
                              name='line1'
                              onChange={handleChange}
                              value={line1 || ''}
                            />
                            {(line1 && line1.length > 0) ||
                              renderInlineError(errors.line1)}
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
                            />
                            {(city && city.length > 0) ||
                              renderInlineError(errors.city)}
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
                            />
                            {renderInlineError(errors.phoneNumber)}
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row
                        style={{
                          paddingBottom: '27px',
                        }}
                      >
                        <Col
                          className='d-flex'
                          style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <button
                            className='btn mobile-address-form-instructions'
                            onClick={() => setModalShow(true)}
                          >
                            <h4
                              className='text-instructions'
                              style={{ marginBottom: '0px' }}
                            >
                              Add pick-up instructions
                            </h4>
                          </button>
                        </Col>

                        <AddPickupModal
                          show={modalShow}
                          onHide={() => setModalShow(false)}
                        />

                        <Col className='d-flex justify-content-center'>
                          <button
                            disabled={disableSubmit}
                            className='btn mobile-address-form-btn-done'
                            onClick={onDoneClick}
                          >
                            Done
                          </button>
                        </Col>
                      </Row>
                    </Form>
                  </div>
                </div>
              </>
            )}
            {/* END OF MOBILE VIEW */}

            {!isMobile && (
              <>
                <h3 className='sofia-pro text-18 mb-4'>Pick-up Address</h3>
                <div className='card shadow-sm mb-2 p-3 w-840'>
                  <div className='card-body'>
                    <Form
                      id='AddressFormConfirmed'
                      onSubmit={(e) => e.preventDefault()}
                    >
                      <Row>
                        <Col>
                          <Form.Group>
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control
                              isInvalid={errors.fullName}
                              className='form-control-lg'
                              onChange={(e) => {
                                if (/^[a-zA-Z\s]*$/g.test(e.target.value)) {
                                  handleChange(e);
                                }
                              }}
                              type='name'
                              name='fullName'
                              value={fullName || ''}
                            />
                            {!isEmpty(fullName) &&
                              renderInlineError(errors.fullName)}
                          </Form.Group>
                        </Col>
                        <Col>
                          <Form.Group>
                            <Form.Label>State</Form.Label>
                            <Form.Control
                              className='form-control-md'
                              as='select'
                              value={state || ''}
                              name='state'
                              onChange={handleChange}
                              placeholder='Select State'
                              defaultValue='null'
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
                            {!isEmpty(state) && renderInlineError(errors.state)}
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
                              type='zip code'
                              value={zipCode || ''}
                              name='zipCode'
                              maxLength={6}
                            />
                            {!isEmpty(zipCode) &&
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
                              onChange={handleChange}
                              type='name'
                              value={line1 || ''}
                              name='line1'
                            />
                            {!isEmpty(line1) && renderInlineError(errors.line1)}
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
                            />
                            {!isEmpty(city) && renderInlineError(errors.city)}
                          </Form.Group>
                        </Col>
                        <Col>
                          <Form.Group>
                            <Form.Label>Phone</Form.Label>
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
                              value={formatPhoneNumber(phoneNumber) || ''}
                              name='phoneNumber'
                              maxLength={13}
                            />
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
                            />
                          </Form.Group>
                        </Col>

                        <Col className='add-pick-up'>
                          <button
                            className='btn btn-instructions'
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
                          <Button
                            disabled={disableSubmit}
                            className='btn-done'
                            onClick={onDoneClick}
                          >
                            Done
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
