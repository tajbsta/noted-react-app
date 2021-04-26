import React, { useEffect, useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { isFormEmpty } from '../utils/form';
import $ from 'jquery';
import { isEmpty } from 'lodash-es';

export default function PaymentForm({
  fullName,
  cardNumber,
  expirationMonth,
  expirationYear,
  cvc,
  errors,
  handleChange,
  onDoneClick,
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

  console.log(errors);

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

  return (
    <div style={{ width: isMobile ? '-webkit-fill-available' : '' }}>
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
                              value={fullName || ''}
                              onChange={handleChange}
                            />
                            {!isEmpty(fullName) &&
                              renderInlineError(errors.fullName)}
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
                              onChange={handleChange}
                              maxLength={20}
                            />
                            {!isEmpty(cardNumber) &&
                              renderInlineError(errors.cardNumber)}
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
                                onChange={(e) => {
                                  const re = /^[0-9\b]+$/;
                                  if (
                                    e.target.value === '' ||
                                    re.test(e.target.value)
                                  ) {
                                    handleChange(e);
                                  }
                                }}
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
                                onChange={(e) => {
                                  const re = /^[0-9\b]+$/;
                                  if (
                                    e.target.value === '' ||
                                    re.test(e.target.value)
                                  ) {
                                    handleChange(e);
                                  }
                                }}
                              />
                            </div>
                            {!isEmpty(expirationYear) &&
                              renderInlineError(errors.expirationYear)}
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
                              onChange={(e) => {
                                const re = /^[0-9\b]+$/;
                                if (
                                  e.target.value === '' ||
                                  re.test(e.target.value)
                                ) {
                                  handleChange(e);
                                }
                              }}
                              maxLength={4}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col
                          className='d-flex'
                          style={{ justifyContent: 'flex-end' }}
                        >
                          <Button
                            disabled={disableSubmit}
                            className='mobile-btn-save-payment'
                            type='submit'
                            onClick={onDoneClick}
                          >
                            Save
                          </Button>
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
                <h3 className='sofia-pro text-18 mb-4'>Payment Method</h3>
                <div className='card shadow-sm mb-2 p-3 w-840'>
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
                              value={fullName || ''}
                              onChange={handleChange}
                            />
                            {renderInlineError(errors.fullName)}
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
                                value={expirationMonth || ''}
                                onChange={(e) => {
                                  const re = /^[0-9\b]+$/;
                                  if (
                                    e.target.value === '' ||
                                    re.test(e.target.value)
                                  ) {
                                    handleChange(e);
                                  }
                                }}
                              />
                              <div className='separator'>
                                <h4>&nbsp;&nbsp;/&nbsp;&nbsp;</h4>
                              </div>
                              <Form.Control
                                className='form-control-sm'
                                name='expirationYear'
                                maxLength={2}
                                value={expirationYear || ''}
                                onChange={(e) => {
                                  const re = /^[0-9\b]+$/;
                                  if (
                                    e.target.value === '' ||
                                    re.test(e.target.value)
                                  ) {
                                    handleChange(e);
                                  }
                                }}
                              />
                            </div>
                            {renderInlineError(errors.expirationYear)}
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
                              onChange={handleChange}
                              maxLength={20}
                            />
                            {renderInlineError(errors.cardNumber)}
                          </Form.Group>
                        </Col>
                        <Col xs={6} md={3}>
                          <Form.Group>
                            <Form.Label>CVC</Form.Label>
                            <Form.Control
                              className='form-control-sm'
                              name='cvc'
                              value={cvc || ''}
                              onChange={(e) => {
                                const re = /^[0-9\b]+$/;
                                if (
                                  e.target.value === '' ||
                                  re.test(e.target.value)
                                ) {
                                  handleChange(e);
                                }
                              }}
                              maxLength={4}
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row>
                        <Col className='btn-container'>
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
