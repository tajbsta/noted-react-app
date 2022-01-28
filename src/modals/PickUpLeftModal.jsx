import React, { useEffect, useState } from 'react';
import { Modal, Button, Row, Col } from 'react-bootstrap';
import { getCreditCardType } from '../utils/creditCards';
import { getUserPaymentMethods } from '../api/orderApi';
import { setPayment } from '../actions/cart.action';
import { getUser } from '../api/auth';
import Collapsible from 'react-collapsible';
import LeftArrow from '../assets/icons/RightArrow.svg';
import DownArrow from '../assets/icons/DownArrow.svg';
import PRICING from '../constants/pricing';
import { useDispatch, useSelector } from 'react-redux';
import AddPaymentForm from '../components/Forms/AddPaymentForm';
import { pickUpRefill } from '../api/subscription';
import SubscriptionCard from '../components/Subscription/SubscriptionCard';

export default function PickUpLeftModal({
  setValidPayment,
  order,
  onHide,
  show,
  plans,
  isAddOrUpgrade,
}) {
  const dispatch = useDispatch();
  const [showEditPayment, setShowEditPayment] = useState(false);
  const [IsPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isPaymentFormEmpty, setIsPaymentFormEmpty] = useState(true);
  const [paymentFormValues, setPaymentFormValues] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [subscriptionSuccess, setSubscriptionSuccess] = useState(false);

  const onSubscriptionSelect = (subscription) => {
    setSelectedPlan(subscription);
  };

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
    // console.log({ orderPaymentId, defaultPaymentId, paymentMethods });

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
  }, []);

  useEffect(() => {
    console.log(paymentFormValues);
    console.log('payment updated');
  }, [paymentFormValues]);

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
        <h2>
          {isAddOrUpgrade
            ? `You have ${userInfo?.['custom:no_of_pickups']} pickups left`
            : 'You have 1 pick up left!'}
        </h2>
      </Modal.Header>
      <Modal.Body
        className={`sofia-pro ${
          isAddOrUpgrade ? 'addOrUpgrade' : 'subscriptions'
        }`}
      >
        {isAddOrUpgrade && (
          <>
            <Row className='subscription-container'>
              <Col sm={4}>
                <SubscriptionCard
                  subscriptionType='ruby'
                  subscriptionDetails={plans.find((p) => p.tag === 'ruby')}
                />
              </Col>
              <Col sm={4}>
                <SubscriptionCard
                  subscriptionType='emerald'
                  subscriptionDetails={plans.find((p) => p.tag === 'emerald')}
                  savings='Save 13%'
                  onButtonClick={() =>
                    onSubscriptionSelect(plans.find((p) => p.tag === 'emerald'))
                  }
                />
              </Col>
              <Col sm={4}>
                <SubscriptionCard
                  recommended={true}
                  subscriptionDetails={plans.find((p) => p.tag === 'diamond')}
                  subscriptionType='diamond'
                  savings='Save 40%'
                  onButtonClick={() =>
                    onSubscriptionSelect(plans.find((p) => p.tag === 'diamond'))
                  }
                />
              </Col>
            </Row>

            <Row>
              <Col className='px-6 py-4'>
                <p className='divider'>or</p>
              </Col>
            </Row>
          </>
        )}

        <Row className={isAddOrUpgrade ? 'refill-addOrUpgrade' : ''}>
          <h3>Pickup Refill</h3>
          <Col
            sm={12}
            className='p-0 d-flex align-items-center justify-content-between pickups mt-4'
          >
            <span>Three (3) Pickups*</span>
            <span>$39.99</span>
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
            <span>$39.99</span>
          </Col>
        </Row>

        <Row className={`mt-5 ${isAddOrUpgrade ? 'refill-addOrUpgrade' : ''}`}>
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
            <Col>
              {!showEditPayment && (
                <Col>
                  No Payment Method saved
                  <Button
                    variant='primary'
                    size='md'
                    className='mx-5'
                    onClick={() => {
                      setShowEditPayment(true);
                    }}
                  >
                    Add payment method
                  </Button>
                </Col>
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

        <Row className='mt-5 button-container'>
          <Button variant='light' size='md' className='mx-5 cancel'>
            Cancel
          </Button>
          {paymentFormValues && (
            <Button
              variant='primary'
              size='md'
              className='mx-5'
              onClick={() => pickUpRefill()}
            >
              Pay $39.99
            </Button>
          )}
        </Row>
      </Modal.Body>
    </Modal>
  );
}
