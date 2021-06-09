import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { timeout } from '../../../utils/time';
import EmptyAddress from '../../../components/PickUpDetails/EmptyAddress';
import EmptyPayment from '../../../components/PickUpDetails/EmptyPayment';
import AddressForm from '../../../components/Forms/AddressForm';
import AddPaymentForm from '../../../components/Forms/AddPaymentForm';
import { getCreditCardType } from '../../../utils/creditCards';
import { getUserPaymentMethods } from '../../../api/orderApi';
import { getUser } from '../../../api/auth';
import AddPickupModal from '../../../modals/AddPickupModal';
import { useFormik } from 'formik';
import { formatPhoneNumber, isFormEmpty } from '../../../utils/form';
import {
  pickUpAddressSchema,
  pickUpDateSchema,
} from '../../../models/formSchema';
import { useDispatch } from 'react-redux';
import {
  setPickupAddress,
  setPayment,
  setPickupDetails,
} from '../../../actions/cart.action';
import SchedulingModal from '../../../modals/SchedulingModal';
import { get } from 'lodash-es';
import moment from 'moment';
import Collapsible from 'react-collapsible';
import LeftArrow from '../../../assets/icons/RightArrow.svg';
import DownArrow from '../../../assets/icons/DownArrow.svg';
import { Col, Row } from 'react-bootstrap';
import { truncateString } from '../../../utils/data';
import PRICING from '../../../constants/pricing';

export default function PickUpDetails({
  setValidAddress,
  setValidPayment,
  setValidPickUpDetails,
  order,
}) {
  const {
    location: { pathname },
  } = useHistory();
  const dispatch = useDispatch();
  const [showEditAddress, setShowEditAddress] = useState(false);
  const [showEditPayment, setShowEditPayment] = useState(false);
  const [isDatePickerOpen, setisDatePickerOpen] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [IsAddressOpen, setIsAddressOpen] = useState(false);
  const [IsPaymentOpen, setIsPaymentOpen] = useState(false);
  const [paymentFormValues, setPaymentFormValues] = useState(null);
  const [isAddressFormEmpty, setIsAddressFormEmpty] = useState(true);
  const [isPaymentFormEmpty, setIsPaymentFormEmpty] = useState(true);
  const [loading, setLoading] = useState(false);

  const initialCheckoutView = ['/checkout'];
  const {
    errors: addressFormErrors,
    handleChange: handleAddressChange,
    values: addressFormValues,
    setFieldValue,
  } = useFormik({
    initialValues: {
      fullName: '',
      state: '',
      zipCode: '',
      line1: '',
      city: '',
      phoneNumber: '',
      instructions: '',
    },
    validationSchema: pickUpAddressSchema,
  });

  useEffect(() => {
    setValidAddress(
      Object.values(addressFormValues).map((addressField) => {
        return addressField.length;
      })
    );
  }, [addressFormValues]);

  const {
    errors: pickupDateFormErrors,
    handleChange: handlePickupDateChange,
    values: pickUpDateFormValues,
    setFieldValue: pickupDateSetFieldValue,
  } = useFormik({
    initialValues: {
      date: null,
      time: null,
    },
    validationSchema: pickUpDateSchema,
    // enableReinitialize: true,
  });

  useEffect(() => {
    setValidPickUpDetails(
      Object.values(pickUpDateFormValues).filter((field) => field === null)
        .length < 1
    );
  }, [pickUpDateFormValues]);

  const savePayment = (paymentMethod) => {
    dispatch(setPayment(paymentMethod));
    setPaymentFormValues(paymentMethod);
    setIsPaymentFormEmpty(false);
    setShowEditPayment(false);
    setValidPayment(true);
  };

  const saveAddress = async () => {
    dispatch(
      setPickupAddress({ ...addressFormValues, errors: addressFormErrors })
    );
    setShowEditAddress(false);
    setModalShow(false);
    setIsAddressFormEmpty(isFormEmpty(addressFormValues));
  };

  const savePickUpDetails = async ({ date, time }) => {
    //
    // console.log('⊂(・ヮ・⊂)', { date, time });
    dispatch(setPickupDetails({ date, time }));
  };

  const openDatePickerModal = () => {
    setisDatePickerOpen(true);
  };

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 1023);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  const renderTime = () => {
    const timeText =
      pickUpDateFormValues.time === 'AM'
        ? '9 A.M. - 12 P.M.'
        : '12 P.M. - 3 P.M.';

    return `Between ${timeText
      .replace('-', 'and')
      .replace(new RegExp(/\./g), '')}`;
  };

  const setDefaults = async () => {
    const [user, paymentMethods] = await Promise.all([
      getUser(),
      getUserPaymentMethods(),
    ]);

    // Set default address
    addressFormValues.fullName = (order ? order.fullName : user.name) || '';
    addressFormValues.state =
      (order ? order.state : user['custom:state']) || '';
    addressFormValues.zipCode =
      (order ? order.zipcode : user['custom:zipcode']) || '';
    addressFormValues.line1 = (order ? order.addressLine1 : user.address) || '';
    addressFormValues.line2 =
      (order ? order.addressLine2 : user.address_2) || '';
    addressFormValues.city = (order ? order.city : user['custom:city']) || '';
    addressFormValues.phoneNumber =
      (order ? order.phone : user['custom:phone']) || '';
    addressFormValues.instructions =
      (order ? order.pickupInstruction : user['custom:pickup_instructions']) ||
      '';

    saveAddress();

    // Set default pickup details
    const defaultPickup = {
      date: order ? order.pickupDate : null,
      time: order ? order.pickupTime : null,
    };
    pickupDateSetFieldValue('date', defaultPickup.date);
    pickupDateSetFieldValue('time', defaultPickup.time);

    savePickUpDetails(defaultPickup);

    // console.log(order);
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
    // console.log({
    //   defaultPaymentMethod,
    // });
    if (defaultPaymentMethod) {
      savePayment(defaultPaymentMethod);
    }
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

  const expirationMonth = paymentFormValues && paymentFormValues.card.exp_month;
  const expirationYear = paymentFormValues && paymentFormValues.card.exp_year;

  useEffect(() => {
    setDefaults();
  }, []);

  // Loader to hide delay
  async function renderSpinner() {
    setLoading(true);
    await timeout(300);
  }

  const renderStopSpinner = () => {
    setLoading(false);
  };

  return (
    <>
      {!showEditAddress && !showEditPayment && (
        <h3 className='sofia-pro text-18 ml-3'>Pick-up Details</h3>
      )}

      <div style={{ display: isMobile ? 'block' : 'flex' }}>
        {showEditPayment && (
          <>
            <div style={{ width: '-webkit-fill-available' }}>
              <div className='container mt-0'>
                <div
                  style={{
                    marginLeft: isMobile ? '16px' : '',
                    marginRight: isMobile ? '16px' : '',
                  }}
                >
                  {isMobile && (
                    <h3
                      className='sofia-pro text-18'
                      style={{ marginBottom: '18px' }}
                    >
                      Pick-up Details
                    </h3>
                  )}
                  <div className='mt-2'>
                    <h4
                      className={`sofia-pro mb-0 ${
                        isMobile ? 'text-14' : 'text-16'
                      }`}
                    >
                      Payment Method
                    </h4>
                  </div>
                  <div className='card shadow-sm p-4 max-w-840 mt-3'>
                    <AddPaymentForm
                      close={() => {
                        setShowEditPayment(false);
                      }}
                      isCheckoutFlow={true}
                      savePayment={savePayment}
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        {showEditAddress && (
          <AddressForm
            {...addressFormValues}
            errors={addressFormErrors}
            handleChange={handleAddressChange}
            onDoneClick={saveAddress}
            setFieldValue={setFieldValue}
            setShowEditAddress={setShowEditAddress}
          />
        )}

        {/* ADDRESS DETAILS */}
        {!showEditAddress && !showEditPayment && (
          <>
            <div className={isMobile ? 'col-sm-12' : 'col-sm-4'}>
              {isMobile && (
                <p className='mobile-form-title first-title'>Pick-up Address</p>
              )}
              <div className='card shadow-sm'>
                {!addressFormValues.line1 == '' && !showEditAddress && (
                  <>
                    <div className='card-body payment-details-card-body pt-4 pb-3 pl-4 m-0 pick-up-address'>
                      <div className='title-container'>
                        <div className='p-0'>
                          <p className='pick-up-message sofia-pro text-14 line-height-16'>
                            Pick-up Address
                          </p>
                        </div>
                        <div>
                          <a
                            className='btn-edit sofia-pro text-14 line-height-16'
                            onClick={() => setShowEditAddress(true)}
                          >
                            Edit
                          </a>
                        </div>
                      </div>
                      <div>
                        <h4 className='p-0 m-0 sofia-pro postal-name'>
                          {addressFormValues.fullName}
                        </h4>
                        <h4 className='p-0 m-0 sofia-pro line1'>
                          {addressFormValues.line1}
                        </h4>
                        <h4 className='p-0 m-0 sofia-pro line1'>
                          {addressFormValues.line2}
                        </h4>
                        <h4 className='p-0 m-0 sofia-pro line1'>
                          {addressFormValues.city}, {addressFormValues.state}{' '}
                          {addressFormValues.zipCode}
                        </h4>
                        <h4 className='p-0 m-0 sofia-pro line1'>
                          United States
                        </h4>
                      </div>
                      <p className='sofia-pro mt-3 tel'>
                        Tel: {formatPhoneNumber(addressFormValues.phoneNumber)}
                      </p>
                      <button
                        className='btn btn-instructions'
                        onClick={() => setModalShow(true)}
                      >
                        <h4 className='text-instructions'>
                          {order ? 'Edit' : 'Add'} pick-up instructions
                        </h4>
                      </button>
                    </div>

                    {/***
                     * Mobile pickup address
                     */}
                    <div className='pick-up-address-mobile pl-4 pr-4 pb-0 pt-1'>
                      <Collapsible
                        open={IsAddressOpen}
                        onTriggerOpening={() => setIsAddressOpen(true)}
                        onTriggerClosing={() => setIsAddressOpen(false)}
                        trigger={
                          <div>
                            <Row
                              className='p-3'
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                              }}
                            >
                              <Col className='p-0'>
                                <h4 className='p-0 m-0 sofia-pro postal-name pt-1 pb-1'>
                                  {addressFormValues.fullName}
                                  {!IsAddressOpen && (
                                    <>
                                      {addressFormValues.line1.length > 12
                                        ? `,${truncateString(
                                            addressFormValues.line1,
                                            12
                                          )}`
                                        : `, ${addressFormValues.line1}`}
                                    </>
                                  )}
                                </h4>
                                {!IsAddressOpen && (
                                  <p className='sofia-pro p-0 mb-0 tel mt-0 pb-1'>
                                    Tel:{' '}
                                    {formatPhoneNumber(
                                      addressFormValues.phoneNumber
                                    )}
                                  </p>
                                )}
                              </Col>
                              <div
                                className='arrow-container d-flex'
                                style={{ alignItems: 'center' }}
                              >
                                {IsAddressOpen ? (
                                  <img src={DownArrow} />
                                ) : (
                                  <img src={LeftArrow} />
                                )}
                              </div>
                            </Row>
                          </div>
                        }
                      >
                        <div className='card-body payment-details-card-body mt-2 mb-2 p-0'>
                          {IsAddressOpen && (
                            <div>
                              <h4 className='p-0 m-0 sofia-pro postal-name pt-1 pb-1'>
                                {addressFormValues.line1}
                              </h4>
                              {addressFormValues.line2 ? (
                                <h4 className='p-0 m-0 sofia-pro postal-name pt-1 pb-1'>
                                  {addressFormValues.line2}
                                </h4>
                              ) : (
                                ''
                              )}
                              <h4 className='p-0 m-0 sofia-pro postal-name pt-1 pb-1'>
                                {addressFormValues.city},{' '}
                                {addressFormValues.state}{' '}
                                {addressFormValues.zipCode}
                              </h4>
                              <h4 className='p-0 m-0 sofia-pro postal-name pt-1 pb-1'>
                                United States
                              </h4>
                              <p className='sofia-pro p-0 mb-0 tel mt-0 pb-1'>
                                Tel:{' '}
                                {formatPhoneNumber(
                                  addressFormValues.phoneNumber
                                )}
                              </p>
                            </div>
                          )}
                          <div className='address-actions mt-2'>
                            <h4
                              className='text-instructions'
                              onClick={() => setModalShow(true)}
                            >
                              {order ? 'Edit' : 'Add'} pick-up instructions
                            </h4>
                            <a
                              className='btn-edit sofia-pro text-14 line-height-16'
                              onClick={() => setShowEditAddress(true)}
                            >
                              Edit
                            </a>
                          </div>
                        </div>
                      </Collapsible>
                    </div>
                  </>
                )}

                <AddPickupModal
                  instructions={addressFormValues.instructions}
                  setFieldValue={setFieldValue}
                  onDoneClick={saveAddress}
                  show={modalShow}
                  onHide={() => setModalShow(false)}
                />

                {addressFormValues.line1 == '' && (
                  <EmptyAddress
                    loading={loading}
                    renderSpinner={renderSpinner}
                    renderStopSpinner={renderStopSpinner}
                    onClick={() => setShowEditAddress(true)}
                  />
                )}
              </div>
            </div>
            {/* PAYMENT DETAILS */}
            <div className={isMobile ? 'col-sm-12' : 'col-sm-4'}>
              {isMobile && (
                <p className='mobile-form-title mt-4'>Payment method</p>
              )}
              <div className='card shadow-sm'>
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
                            style={{ width: '38px' }}
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
                                    style={{ width: '38px' }}
                                    src={getCardImage(paymentFormValues)}
                                    alt='...'
                                  />
                                </div>
                                <div
                                  className='ml-3'
                                  style={{ marginTop: '5px' }}
                                >
                                  <h4 className='text-14 text ending-text mb-0'>
                                    {getCardBrand(paymentFormValues)} ending in{' '}
                                    {paymentFormValues.card.last4}
                                  </h4>
                                  <small className='text-muted'>
                                    Expires{' '}
                                    {`${expirationMonth}/${expirationYear}`}
                                  </small>
                                </div>
                              </Col>
                              <div
                                className='arrow-container d-flex'
                                style={{ alignItems: 'center' }}
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

                {isPaymentFormEmpty && (
                  <EmptyPayment
                    loading={loading}
                    renderSpinner={renderSpinner}
                    renderStopSpinner={renderStopSpinner}
                    onClick={() => setShowEditPayment(true)}
                  />
                )}
              </div>
            </div>
            {/* RETURN SCHEDULE */}
            <div className={isMobile ? 'col-sm-12' : 'col-sm-4'}>
              {isMobile && <p className='mobile-form-title mt-4'>Pick up</p>}
              <div className='card shadow-sm'>
                <div className='card-body payment-details-card-body pt-4 pb-3 pl-4 m-0 return-schedule'>
                  <div
                    className='title-container'
                    style={{ display: isMobile ? 'none' : '' }}
                  >
                    <div className='p-0'>
                      <p className='pick-up-message sofia-pro text-14 line-height-16'>
                        Pick up
                      </p>
                    </div>
                  </div>
                  {get(pickUpDateFormValues, 'date', null) === null &&
                  get(pickUpDateFormValues, 'time', null) === null ? (
                    <>
                      <h4 className='p-0 m-0 sofia-pro'>No date selected</h4>
                      <h4
                        className='p-0 m-0 sofia-pro mt-2 btn-edit'
                        onClick={openDatePickerModal}
                      >
                        Select date
                      </h4>
                    </>
                  ) : (
                    <>
                      <h4 className='sofia-pro mb-4'>
                        {moment(get(pickUpDateFormValues, 'date', '')).format(
                          'MMMM DD, YYYY'
                        )}
                      </h4>
                      {renderTime()}
                      <button
                        className='btn p-0 sofia-pro btn-edit'
                        style={{ display: 'block' }}
                        onClick={openDatePickerModal}
                      >
                        Edit
                      </button>
                      {!initialCheckoutView.includes(pathname) && (
                        <>
                          <hr
                            style={{
                              borderTop: '1px solid #E8E7E9',
                              marginTop: '0px',
                            }}
                          />
                          <h4
                            className='p-0 m-0 sofia-pro mt-2'
                            style={{ color: '#570097' }}
                          >
                            Schedule another date
                          </h4>
                          <h4
                            className='p-0 m-0 sofia-pro'
                            style={{ color: '#2E1D3A', opacity: '0.6' }}
                          >
                            (-$5.00)
                          </h4>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
        <SchedulingModal
          show={isDatePickerOpen}
          onHide={() => setisDatePickerOpen(false)}
          pickUpDateFormValues={pickUpDateFormValues}
          onConfirm={(pickupDate, pickupTime) => {
            pickupDateSetFieldValue('date', pickupDate);
            pickupDateSetFieldValue('time', pickupTime);
            savePickUpDetails({
              date: pickupDate,
              time: pickupTime,
            });
          }}
        />
      </div>
    </>
  );
}
