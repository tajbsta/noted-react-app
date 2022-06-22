import React, { useEffect, useState } from 'react';
import { Modal, Button, Row, Col, Spinner } from 'react-bootstrap';
import { getCreditCardType } from '../utils/creditCards';
import { getUserPaymentMethods } from '../api/orderApi';
import { setPayment } from '../actions/cart.action';
import { getUser } from '../api/auth';
import Collapsible from 'react-collapsible';
import LeftArrow from '../assets/icons/RightArrow.svg';
import DownArrow from '../assets/icons/DownArrow.svg';
import PRICING from '../constants/pricing';
import { useDispatch } from 'react-redux';
import AddPaymentForm from '../components/Forms/AddPaymentForm';
import { pickUpRefill, subscriptionUpgrade } from '../api/subscription';
import { showError, showSuccess } from '../library/notifications.library';
import { AlertCircle, CheckCircle } from 'react-feather';
import * as Sentry from '@sentry/react';

export default function PickUpLeftModal({
  setValidPayment,
  order,
  onHide,
  show,
}) {
  const dispatch = useDispatch();
  const [showEditPayment, setShowEditPayment] = useState(false);
  const [IsPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isPaymentFormEmpty, setIsPaymentFormEmpty] = useState(true);
  const [paymentFormValues, setPaymentFormValues] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getCardImage = (payment) => {
    const brand = payment ? payment.card.brand : null;
    const cardType = getCreditCardType(brand);

    const cardImage = cardType.image;
    return cardImage;
  };

  const getCardBrand = (payment) => {
    const brand = payment ? payment.card.brand : null;
    const cardType = getCreditCardType(brand);

    const cardBrand = cardType.text;
    return cardBrand;
  };

  const savePayment = (paymentMethod) => {
    dispatch(setPayment(paymentMethod));
    setPaymentFormValues(paymentMethod);
    setIsPaymentFormEmpty(false);
    setShowEditPayment(false);
    setValidPayment(true);
  };

  const onSubmitClick = async (plan) => {
    setIsLoading(true);
    try {
      if (plan) {
        await subscriptionUpgrade({ plan_name: plan });

        showSuccess({
          message: (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <CheckCircle />
              <h4 className='ml-3 mb-0' style={{ lineHeight: '16px' }}>
                Successfully subscribed, you can check your profile to confirm.
              </h4>
            </div>
          ),
        });
      } else {
        await pickUpRefill();

        showSuccess({
          message: (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <CheckCircle />
              <h4 className='ml-3 mb-0' style={{ lineHeight: '16px' }}>
                Successfully purchased refills, you can check your profile to
                confirm.
              </h4>
            </div>
          ),
        });
      }
    } catch (error) {
      showError({
        message: (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <AlertCircle />
            <h4 className='ml-3 mb-0' style={{ lineHeight: '16px' }}>
              Error! subscription fail!
            </h4>
          </div>
        ),
      });

      Sentry.captureException(error);
    }
  };

  const setDefaults = async () => {
    const [user, paymentMethods] = await Promise.all([
      getUser(),
      getUserPaymentMethods(),
    ]);
    setUserInfo(user);

    // Set payment method default
    const orderPayment = order
      ? order.billing.find((billing) => billing.pricing === PRICING.STANDARD)
      : {};
    const orderPaymentId = orderPayment ? orderPayment.paymentMethodId : null;
    const defaultPaymentId =
      orderPaymentId || user['custom:default_payment'] || null;

    const defaultPaymentMethod = paymentMethods.find(
      (method) => defaultPaymentId && defaultPaymentId === method.id
    );

    if (defaultPaymentMethod) {
      savePayment(defaultPaymentMethod);
    }
  };

  const expirationMonth = paymentFormValues && paymentFormValues.card.exp_month;
  const expirationYear = paymentFormValues && paymentFormValues.card.exp_year;

  useEffect(() => {
    setDefaults();
  }, [show]);

  const Summary = ({ plan }) => {
    return (
      <Row>
        <h3>Pickup Refill</h3>
        <Col
          sm={12}
          className='p-0 d-flex align-items-center justify-content-between pickups mt-4'
        >
          <span> {plan.no_of_pickups} Pickups*</span>
          <span>{plan.price}</span>
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
            *{plan.no_of_pickups} pickups will last for 365 days from date of
            payment.
          </span>
        </Col>

        <Col
          sm={12}
          className='p-0 d-flex align-items-center justify-content-between mt-3 totalpay'
        >
          <span>Total to pay</span>
          <span>{plan.price}</span>
        </Col>
      </Row>
    );
  };

  const ActionButtons = () => {
    return (
      <Row className='mt-5 button-container'>
        <Button
          variant='light'
          size='md'
          className='mx-5 cancel'
          onClick={onHide}
        >
          Cancel
        </Button>

        <Button
          variant='primary'
          size='md'
          className='mx-5'
          onClick={() => onSubmitClick()}
        >
          {isLoading ? (
            <Spinner
              as='span'
              animation='border'
              size='sm'
              role='status'
              aria-hidden='true'
            />
          ) : (
            'Pay $39.99'
          )}
        </Button>
      </Row>
    );
  };

  return (
    <Modal
      show={show}
      size='lg'
      aria-labelledby='contained-modal-title-vcenter'
      centered
      backdrop='static'
      keyboard={false}
      animation={false}
      id='PickUpLeftModal'
    >
      <Modal.Header closeButton onClick={onHide}>
        {userInfo?.['custom:stripe_sub_name'] !== 'Ruby' && (
          <h2>You have 1 pick up left!</h2>
        )}
      </Modal.Header>
      <Modal.Body className={`sofia-pro`}>
        <Summary plan={{ no_of_pickups: 3, price: '$39.99', name: 'Refill' }} />

        <Row className={`mt-5`}>
          {!isPaymentFormEmpty && !showEditPayment ? (
            <>
              <div className='card-body pt-4 pb-3 px-0 m-0'>
                <div className='title-container'>
                  <div className='p-0 d-flex justify-content-between'>
                    <p className='pick-up-message sofia-pro text-14 line-height-16'>
                      Payment method
                    </p>
                    <a
                      className='btn-edit sofia-pro text-14 line-height-16'
                      onClick={() => setShowEditPayment(true)}
                      style={{ cursor: 'pointer' }}
                    >
                      Edit
                    </a>
                  </div>
                </div>
                <div className='payment-details-desktop'>
                  <div className='img-container d-flex align-items-center'>
                    <img
                      className='img-fluid'
                      style={{
                        width: '38px',
                      }}
                      src={getCardImage(paymentFormValues)}
                      alt='...'
                    />
                    <h4 className='m-0 ml-2 text-14 text'>
                      {`ending in ${paymentFormValues.card.last4}`}
                    </h4>
                  </div>
                </div>
              </div>
              {/**
               * PAYMENT DETAILS MOBILE
               */}
              <div
                className='pl-4 pr-4 pb-0 pt-0 payment-details-mobile'
                style={{ cursor: 'pointer' }}
              >
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
          ) : (
            <Col className='p-0'>
              {!showEditPayment && (
                <div className='block d-sm-flex justify-content-between align-items-center'>
                  <p className='m-0'>No Payment Method saved</p>
                  <Button
                    variant='primary'
                    size='md'
                    className='m-0'
                    onClick={() => {
                      setShowEditPayment(true);
                    }}
                  >
                    Add payment method
                  </Button>
                </div>
              )}
              {showEditPayment && (
                <AddPaymentForm
                  close={() => {
                    setShowEditPayment(false);
                  }}
                  isCheckoutFlow={true}
                  savePayment={savePayment}
                />
              )}
            </Col>
          )}
        </Row>

        <ActionButtons />
      </Modal.Body>
    </Modal>
  );
}
