import React, { useEffect, useRef, useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { formatPhoneNumber, isFormEmpty } from '../utils/form';
import USA_STATES from '../assets/usa_states.json';
import $ from 'jquery';
import { useSelector } from 'react-redux';

export default function PaymentForm({
  fullName,
  cardNumber,
  expirationMonth,
  expirationYear,
  cvc,
  errors,
  handleChange,
  onDoneClick,
  state,
  zipCode,
  name,
  line1,
  line2,
  city,
  phoneNumber,
  paymentFormValues,
  // phoneNumber,
  // touched,
  // billingAddress,
  // onBtnCheck,
  setShowEditPayment = () => {},
  props,
}) {
  const disableSubmit =
    isFormEmpty({
      fullName,
      cardNumber,
      expirationMonth,
      expirationYear,
      cvc,
    }) || !isFormEmpty({ ...errors });
  const [isMobile, setIsMobile] = useState(false);
  // const { address } = useSelector(({ runtime: { form: { address } } }) => ({
  //   address,
  // }))
  const phoneForm = useRef('');

  // const [paymentInfo, setPaymentInfo] = useState([{
  //   name: address.fullName,

  // }])

  const [focused, setFocused] = useState({
    fullName: false,
    cardNumber: false,
    expirationMonth: false,
    expirationYear: false,
    cvc,
  });
  const [billingAddress, setBillingAddress] = useState(false);

  const { payment } = useSelector(({ runtime: { form: { payment } } }) => ({
    payment,
  }));

  const onFocus = (e) => {
    setFocused({ ...focused, [e.target.name]: true });
  };

  function formatCardNumber(value) {
    return value
      .replace(/[^0-9]/g, '')
      .substr(0, 16)
      .split('')
      .reduce((str, l, i) => {
        return str + (!i || i % 4 ? '' : '-') + l;
      }, '');
  }
  const renderInlineError = (error) => (
    <small className='form-text p-0 m-0 noted-red'>{error}</small>
  );

  const renderInlineValidationError = (fieldName) => {
    const error = errors[fieldName];
    return (
      focused[fieldName] &&
      error && <small className='form-text p-0 m-0 noted-red'>{error}</small>
    );
  };
  useEffect(() => {
    const platform = window.navigator.platform;
    const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];

    if (windowsPlatforms.indexOf(platform) !== -1) {
      // Windows 10 Chrome
      $('.btn-save').css('padding-top', '9px');
      $('.btn-save').css('padding-bottom', '9px');
    }
  }, []);

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

  const onBtnCheck = () => {
    setBillingAddress((prevState) => !prevState);
    if (!billingAddress) {
      // console.log(paymentFormValues)

      name = payment && payment.fullName;
      state = payment && payment.state;
      zipCode = payment && payment.zipCode;
      line1 = payment && payment.line1;
      line2 = payment && payment.line2;
      city = payment && payment.city;
      phoneNumber = payment && formatPhoneNumber(payment.phoneNumber);

      errors.name = null;
      errors.state = null;
      errors.zipCode = null;
      errors.line1 = null;
      errors.line2 = null;
      errors.city = null;
      errors.phoneNumber = null;
      console.log(errors);
    }
  };

  const formatPhone = (e) => {
    e.target.value = formatPhoneNumber(phoneNumber);
  };

  return (
    <div style={{ width: isMobile ? '-webkit-fill-available' : '' }}>
      <div className='container mt-0'>
        <div style={{ margin: isMobile ? 'auto' : '' }}>
          <div className='mt-2' style={{ margin: isMobile ? '16px' : '' }}>
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
                  Payment Method
                </h3>
                <div
                  className='card shadow-sm mb-2 p-3 max-w-840'
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
                            onClick={() => {
                              setShowEditPayment(false);
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
                              value={fullName}
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
                            <Form.Label>Card Number</Form.Label>
                            <Form.Control
                              className='form-control'
                              name='cardNumber'
                              value={formatCardNumber(cardNumber)}
                              onChange={handleChange}
                              maxLength={20}
                              onFocus={onFocus}
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
                                value={expirationMonth}
                                onChange={(e) => {
                                  const re = /^[0-9\b]+$/;
                                  if (
                                    e.target.value === '' ||
                                    re.test(e.target.value)
                                  ) {
                                    handleChange(e);
                                  }
                                }}
                                onFocus={onFocus}
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
                                value={expirationYear}
                                onChange={(e) => {
                                  const re = /^[0-9\b]+$/;
                                  if (
                                    e.target.value === '' ||
                                    re.test(e.target.value)
                                  ) {
                                    handleChange(e);
                                  }
                                }}
                                onFocus={onFocus}
                              />
                            </div>
                            {renderInlineValidationError('expirationYear')}
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
                              value={cvc}
                              onChange={(e) => {
                                const re = /^[0-9\b]+$/;
                                if (
                                  e.target.value === '' ||
                                  re.test(e.target.value)
                                ) {
                                  handleChange(e);
                                }
                              }}
                              onFocus={onFocus}
                              maxLength={4}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      {/* <Row>
                        <Col
                          className="d-flex"
                          style={{ justifyContent: 'flex-end' }}
                        >
                          <Button
                            disabled={disableSubmit}
                            className="mobile-btn-save-payment"
                            type="submit"
                            onClick={onDoneClick}
                          >
                            Save
                          </Button>
                        </Col>
                      </Row> */}
                      <h3
                        style={{
                          fontSize: '18px',
                          lineHeight: '18px',
                          color: '#2E1D3A',
                        }}
                      >
                        Billing Address
                      </h3>
                      <Row
                        className='mx-1 check-component d-flex justify-content-between'
                        id='paymentCheck'
                      >
                        <div className='px-0' style={{ margin: 'auto 0' }}>
                          <Form.Check
                            className='check'
                            checked={billingAddress}
                            onChange={onBtnCheck}
                            label='Same as pickup address'
                          />
                        </div>
                        <div
                          className='btn-container'
                          style={{ height: '40px' }}
                        >
                          {billingAddress && (
                            <Button
                              disabled={disableSubmit}
                              className='btn-save'
                              type='submit'
                              onClick={onDoneClick}
                            >
                              Save
                            </Button>
                          )}
                        </div>
                      </Row>
                      {billingAddress ? (
                        ''
                      ) : (
                        <div
                          className='m-card-body'
                          style={{
                            paddingTop: '7px',
                          }}
                        >
                          <Form.Group>
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control
                              className='form-control'
                              type='name'
                              name='name'
                              value={name}
                              onChange={handleChange}
                              onFocus={onFocus}
                            />
                            {renderInlineValidationError('name')}
                          </Form.Group>

                          <Row>
                            <Col>
                              <Form.Group>
                                <Form.Label>State</Form.Label>
                                <Form.Control
                                  className='form-control'
                                  as='select'
                                  value={state}
                                  name='state'
                                  onChange={handleChange}
                                  placeholder='Select State'
                                  onFocus={onFocus}
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
                                {renderInlineValidationError('state')}
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
                                  value={zipCode}
                                  maxLength={6}
                                />
                                {zipCode &&
                                  zipCode.length > 0 &&
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
                                  // value={line1}
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
                                  value={line2}
                                  name='line2'
                                  onChange={handleChange}
                                  onFocus={onFocus}
                                />
                                {renderInlineValidationError('line2')}
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
                                  value={city}
                                  onChange={handleChange}
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
                                    if (
                                      e.target.value === '' ||
                                      re.test(e.target.value)
                                    ) {
                                      handleChange(e);
                                    }
                                  }}
                                  value={formatPhoneNumber(phoneNumber)}
                                  name='phoneNumber'
                                  maxLength={13}
                                  onFocus={onFocus}
                                  // isInvalid={
                                  //   touched.phoneNumber && !!errors.phoneNumber
                                  // }
                                />
                                {renderInlineValidationError('phoneNumber')}
                              </Form.Group>
                            </Col>
                          </Row>
                          <Row className='mx-1 d-flex flex-row-reverse'>
                            <Button
                              disabled={disableSubmit}
                              className='btn-save'
                              type='submit'
                              onClick={onDoneClick}
                            >
                              Save
                            </Button>
                          </Row>
                        </div>
                      )}
                    </Form>
                  </div>
                </div>
              </>
            )}
            {/* END OF MOBILE VIEW */}

            {!isMobile && (
              <>
                <h3 className='sofia-pro text-18 mb-4'>Payment Method</h3>
                <div className='card shadow-sm mb-2 p-3 max-w-840'>
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
                              onChange={handleChange}
                              onFocus={onFocus}
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
                                maxLength={2}
                                value={expirationMonth}
                                onChange={(e) => {
                                  const re = /^[0-9\b]+$/;
                                  if (
                                    e.target.value === '' ||
                                    re.test(e.target.value)
                                  ) {
                                    handleChange(e);
                                  }
                                }}
                                onFocus={onFocus}
                              />
                              <div className='separator'>
                                <h4>&nbsp;&nbsp;/&nbsp;&nbsp;</h4>
                              </div>
                              <Form.Control
                                className='form-control-sm'
                                name='expirationYear'
                                maxLength={2}
                                value={expirationYear}
                                onChange={(e) => {
                                  const re = /^[0-9\b]+$/;
                                  if (
                                    e.target.value === '' ||
                                    re.test(e.target.value)
                                  ) {
                                    handleChange(e);
                                  }
                                }}
                                onFocus={onFocus}
                              />
                            </div>
                            {renderInlineValidationError('expirationYear')}
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
                              value={formatCardNumber(cardNumber)}
                              onChange={handleChange}
                              maxLength={20}
                              onFocus={onFocus}
                            />
                            {renderInlineValidationError('cardNumber')}
                          </Form.Group>
                        </Col>
                        <Col xs={6} md={3}>
                          <Form.Group>
                            <Form.Label>CVC</Form.Label>
                            <Form.Control
                              className='form-control-sm'
                              name='cvc'
                              value={cvc}
                              onChange={(e) => {
                                const re = /^[0-9\b]+$/;
                                if (
                                  e.target.value === '' ||
                                  re.test(e.target.value)
                                ) {
                                  handleChange(e);
                                }
                              }}
                              onFocus={onFocus}
                              maxLength={4}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <h3
                        style={{
                          fontSize: '18px',
                          lineHeight: '18px',
                          color: '#2E1D3A',
                        }}
                      >
                        Billing Address
                      </h3>
                      <Row
                        className='mx-1 check-component p-0'
                        id='paymentCheck'
                      >
                        <Col lg={6} className='px-0'>
                          <Form.Check
                            className='check'
                            checked={billingAddress}
                            onChange={onBtnCheck}
                            label='Same as pickup address'
                          />
                        </Col>
                        <Col
                          className='btn-container'
                          style={{ height: '40px', margin: 'auto' }}
                        >
                          {billingAddress && (
                            <Button
                              disabled={disableSubmit}
                              className='btn-save'
                              type='submit'
                              onClick={onDoneClick}
                            >
                              Save
                            </Button>
                          )}
                        </Col>
                      </Row>
                      {
                        billingAddress ? (
                          ''
                        ) : (
                          <>
                            <Row>
                              <Col xs={6}>
                                <Form.Group>
                                  <Form.Label>Full Name</Form.Label>
                                  <Form.Control
                                    className='form-control-lg'
                                    type='name'
                                    name='name'
                                    // value={name}
                                    onChange={handleChange}
                                    onFocus={onFocus}
                                  />
                                  {renderInlineValidationError('name')}
                                </Form.Group>
                              </Col>
                              <Col lg={3}>
                                <Form.Group>
                                  <Form.Label>State</Form.Label>
                                  <Form.Control
                                    className='form-control-md'
                                    as='select'
                                    value={state}
                                    name='state'
                                    onChange={handleChange}
                                    placeholder='Select State'
                                    onFocus={onFocus}
                                  >
                                    {[
                                      {
                                        abbreviation: '',
                                        name: 'Select State',
                                      },
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
                                  {renderInlineValidationError('state')}
                                </Form.Group>
                              </Col>
                              <Col xs={6} lg={3}>
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
                                    value={zipCode}
                                    name='zipCode'
                                    maxLength={6}
                                  />
                                  {zipCode &&
                                    zipCode.length > 0 &&
                                    renderInlineError(errors.zipCode)}
                                </Form.Group>
                              </Col>
                            </Row>

                            <Row>
                              <Col xs={6}>
                                <Form.Group>
                                  <Form.Label>Address Line 1</Form.Label>
                                  <Form.Control
                                    className='form-control-lg'
                                    onChange={handleChange}
                                    type='name'
                                    value={line1}
                                    name='line1'
                                    onFocus={onFocus}
                                  />
                                  {renderInlineValidationError('line1')}
                                </Form.Group>
                              </Col>
                              <Col xs={6} md={3}>
                                <Form.Group>
                                  <Form.Label>City</Form.Label>
                                  <Form.Control
                                    className='form-control-md'
                                    type='city'
                                    name='city'
                                    value={city}
                                    onChange={handleChange}
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
                                    onChange={(e) => {
                                      const re = /^[0-9\b]+$/;
                                      if (
                                        e.target.value === '' ||
                                        re.test(e.target.value)
                                      ) {
                                        handleChange(e);
                                      }
                                    }}
                                    value={formatPhoneNumber(phoneNumber)}
                                    name='phoneNumber'
                                    maxLength={13}
                                    onFocus={onFocus}
                                    // isInvalid={
                                    //   touched.phoneNumber &&
                                    //   !!errors.phoneNumber
                                    // }
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
                                    value={line2}
                                    name='line2'
                                    onChange={handleChange}
                                    onFocus={onFocus}
                                  />
                                  {renderInlineValidationError('line2')}
                                </Form.Group>
                              </Col>
                              <Col
                                className='btn-container'
                                style={{ height: '40px', margin: 'auto' }}
                              >
                                <Button
                                  disabled={disableSubmit}
                                  className='btn-save'
                                  type='submit'
                                  onClick={onDoneClick}
                                >
                                  Save
                                </Button>
                              </Col>
                            </Row>
                          </>
                        ) // <Row>
                        //   <Col
                        //     className="btn-container"
                        //     style={{ height: '40px', margin: 'auto' }}
                        //   >
                        //     <Button
                        //       disabled={disableSubmit}
                        //       className="btn-save"
                        //       type="submit"
                        //       onClick={onDoneClick}
                        //     >
                        //       Save
                        //     </Button>
                        //   </Col>
                        // </Row>
                      }
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
