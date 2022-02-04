import React, { useEffect, useState } from 'react';
import { Modal, Button, Row, Col } from 'react-bootstrap';

export default function UpgradePlanModal(props) {
  const [showEditPayment, setShowEditPayment] = useState(false);
  const [IsPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isPaymentFormEmpty, setIsPaymentFormEmpty] = useState(true);

  return (
    <Modal
      show={props.show}
      size='lg'
      aria-labelledby='contained-modal-title-vcenter'
      centered
      backdrop='static'
      keyboard={false}
      animation={false}
      id='PickUpLeftModal'
    >
      <Modal.Header closeButton onClick={props.onHide}>
        <h2>You have 1 pick up left!</h2>
      </Modal.Header>
      <Modal.Body className='sofia-pro subscriptions'>
        <Row>
          <h3>Pickup Refill</h3>
          <Col
            sm={12}
            className='p-0 d-flex align-items-center justify-content-between pickups mt-4'
          >
            <span>Three (3) Pickups*</span>
            <span>$19.99</span>
          </Col>
          <Col
            sm={12}
            className='p-0 d-flex align-items-center justify-content-between taxes'
          >
            <span>Taxes</span>
            <span>$0.00</span>
          </Col>
          <Col sm={12} className='p-0 d-flex align-items-center my-3 '>
            <span className='subtle-text'>
              *3 pickups will last for 365 days from date of payment.
            </span>
          </Col>

          <Col
            sm={12}
            className='p-0 d-flex align-items-center justify-content-between mt-3 totalpay'
          >
            <span>Total to pay</span>
            <span>$19.99</span>
          </Col>
        </Row>

        <Row className='mt-5'>
          {/* <Col
            sm={12}
            className='p-0 d-flex align-items-center justify-content-between'
          >
            <h3>Payment Method</h3>
            <div className='edit'>Edit</div>
          </Col>
          <Col className='p-0 d-flex align-items-center mt-4'>
            <div className='dummyCard'></div>
            <span className='cardNumber'>Ending in 9456</span>
          </Col>
          <Col sm={12} className='p-0 address mt-5'>
            <h3>Card Address</h3>
            <div className='mt-2'>
              <span>Alexis Jones</span>
              <span>1 Titans Way</span>
              <span>Nashville, TN 37213</span>
              <span>United States</span>
            </div>
          </Col> */}
          {!isPaymentFormEmpty && !showEditPayment && (
            <>
              <div className='card-body payment-details-card-body pt-4 pb-3 pl-4 m-0 payment-method'>
                <div className='title-container'>
                  <div className='p-0'>
                    <p className='pick-up-message sofia-pro text-14 line-height-16'>
                      Payment method
                    </p>
                  </div>
                  <div>
                    <a
                      className='btn-edit sofia-pro text-14 line-height-16'
                      onClick={() => setShowEditPayment(true)}
                    >
                      Edit
                    </a>
                  </div>
                </div>
                <div className='end'>
                  <div className='img-container'>
                    <img
                      className='img-fluid'
                      style={{
                        width: '38px',
                      }}
                      src={getCardImage(paymentFormValues)}
                      alt='...'
                    />
                  </div>
                  <div>
                    <h4 className='mb-3 text-14 text'>
                      {getCardBrand(paymentFormValues)} ending in{' '}
                      {paymentFormValues.card.last4}
                    </h4>
                    <small className='text-muted'>
                      Expires {`${expirationMonth}/${expirationYear}`}
                    </small>
                  </div>
                </div>

                {/* <h3 className='sofia-pro mb-0 mt-2 mb-2 text-14 ine-height-16 c-add'>
                  Card Address
                </h3>
                <div>
                  <h4 className='p-0 m-0 sofia-pro postal-name'>
                    {paymentFormValues.billing_details.name}
                  </h4>
                  <h4 className='p-0 m-0 sofia-pro line1'>
                    {addressFormValues.line1}
                  </h4>
                  <h4 className='p-0 m-0 sofia-pro line1'>
                    {addressFormValues.line2}
                  </h4>

                  <h4 className='p-0 m-0 sofia-pro postal-address'>
                    {addressFormValues.city}, {addressFormValues.state}{' '}
                    {addressFormValues.zipCode}
                  </h4>
                  <h4 className='p-0 m-0 sofia-pro line1'>
                    United States
                  </h4>
                </div> */}
              </div>
              {/**
               * PAYMENT DETAILS MOBILE
               */}
              <div className='pl-4 pr-4 pb-0 pt-0 payment-details-mobile'>
                <Collapsible
                  open={IsPaymentOpen}
                  onTriggerOpening={() => setIsPaymentOpen(true)}
                  onTriggerClosing={() => setIsPaymentOpen(false)}
                  trigger={
                    <div className='payment-trigger'>
                      <Row
                        className='p-3'
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                        }}
                      >
                        <Col
                          className='p-0'
                          style={{
                            display: 'flex',
                          }}
                        >
                          <div className='img-container payment-card-logo'>
                            <img
                              style={{
                                width: '38px',
                              }}
                              src={getCardImage(paymentFormValues)}
                              alt='...'
                            />
                          </div>
                          <div
                            className='ml-3'
                            style={{
                              marginTop: '5px',
                            }}
                          >
                            <h4 className='text-14 text ending-text mb-0'>
                              {getCardBrand(paymentFormValues)} ending in{' '}
                              {paymentFormValues.card.last4}
                            </h4>
                            <small className='text-muted'>
                              Expires {`${expirationMonth}/${expirationYear}`}
                            </small>
                          </div>
                        </Col>
                        <div
                          className='arrow-container d-flex'
                          style={{
                            alignItems: 'center',
                          }}
                        >
                          {IsPaymentOpen ? (
                            <img src={DownArrow} />
                          ) : (
                            <img src={LeftArrow} />
                          )}
                        </div>
                      </Row>
                    </div>
                  }
                >
                  <div className='card-body payment-details-card-body m-0 p-0'>
                    {/* <div className='text-14 text ending-text'>
                      Card Address
                    </div>
                    <div>
                      <h4 className='p-0 m-0 sofia-pro postal-name'>
                        {paymentFormValues.billing_details.name}
                      </h4>
                      <h4 className='p-0 m-0 sofia-pro line1'>
                        {addressFormValues.line1}
                      </h4>
                      <h4 className='p-0 m-0 sofia-pro line2'>
                        {addressFormValues.line2}
                      </h4>

                      <h4 className='p-0 m-0 sofia-pro postal-address'>
                        {addressFormValues.city},{' '}
                        {addressFormValues.state}{' '}
                        {addressFormValues.zipCode}
                      </h4>
                      <h4 className='p-0 m-0 sofia-pro line1'>
                        United States
                      </h4>
                    </div> */}
                    <div className='address-actions mt-2'>
                      <h4
                        className='text-instructions'
                        onClick={() => setShowEditPayment(true)}
                      >
                        Use different payment method
                      </h4>
                    </div>
                  </div>
                </Collapsible>
              </div>
            </>
          )}
        </Row>

        <Row className='mt-5 button-container'>
          <Button variant='light' size='md' className='mx-5 cancel'>
            Cancel
          </Button>
          <Button variant='primary' size='md' className='mx-5'>
            Pay $19.99
          </Button>
        </Row>
      </Modal.Body>
    </Modal>
  );
}
