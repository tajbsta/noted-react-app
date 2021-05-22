import React, { useState, useEffect } from 'react';
import EmptyAddress from '../../../components/PickUpDetails/EmptyAddress';
import EmptyPayment from '../../../components/PickUpDetails/EmptyPayment';
import AddressForm from '../../../components/Forms/AddressForm';
import PaymentForm from '../../../components/Forms/PaymentForm';
import AddPickupModal from '../../../modals/AddPickupModal';
import { useFormik } from 'formik';
import { formatPhoneNumber, isFormEmpty } from '../../../utils/form';
import {
  paymentAddressSchema,
  pickUpAddressSchema,
  pickUpDateSchema,
} from '../../../models/formSchema';
import { useDispatch } from 'react-redux';
import {
  updatePaymentInfo,
  updatePickUpDetails,
  updateReturnAddress,
} from '../../../actions/runtime.action';
import SchedulingModal from '../../../modals/SchedulingModal';
import { get } from 'lodash-es';
import moment from 'moment';
import Collapsible from 'react-collapsible';
import LeftArrow from '../../../assets/icons/RightArrow.svg';
import DownArrow from '../../../assets/icons/DownArrow.svg';
import { Col, Row } from 'react-bootstrap';
import { truncateString } from '../../../utils/data';

export default function PickUpDetails({
  setValidAddress,
  // setValidPayment,
  setValidPickUpDetails,
}) {
  const dispatch = useDispatch();
  const [showEditAddress, setShowEditAddress] = useState(false);
  const [showEditPayment, setShowEditPayment] = useState(false);
  const [isDatePickerOpen, setisDatePickerOpen] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [IsAddressOpen, setIsAddressOpen] = useState(false);
  const [IsPaymentOpen, setIsPaymentOpen] = useState(false);

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
      // .filter((addressField, index) => {
      //   return (
      //     addressField === 0 &&
      //     index !== Object.keys(addressFormValues).length - 1
      //   );
      // }).length < 1
    );
  }, [addressFormValues]);

  const {
    errors: paymentFormErrors,
    handleChange: handlePaymentChange,
    values: paymentFormValues,
  } = useFormik({
    initialValues: {
      fullName: '',
      cardNumber: '',
      expirationMonth: '',
      expirationYear: '',
      cvc: '',
      name: '',
      state: '',
      zipCode: '',
      line1: '',
      line2: '',
      city: '',
      phoneNumber: '',
      instructions: '',
    },
    validationSchema: paymentAddressSchema,
    // paymentAddressSchemaBilling,
  });

  // const onBtnCheck = () => {
  //   setBillingAddress((prevState) => !prevState)
  //   if (!billingAddress) {
  //     console.log(payment)
  //     paymentFormValues.name = payment && payment.fullName
  //     paymentFormValues.state = payment && payment.state
  //     paymentFormValues.zipCode = payment && payment.zipCode
  //     paymentFormValues.line1 = payment && payment.line1
  //     paymentFormValues.line2 = payment && payment.line2
  //     paymentFormValues.city = payment && payment.city
  //     paymentFormValues.phoneNumber =
  //       payment && formatPhoneNumber(payment.phoneNumber)

  //     console.log({ ...paymentFormErrors })

  //     paymentFormErrors.name = null
  //     paymentFormErrors.state = null
  //     paymentFormErrors.zipCode = null
  //     paymentFormErrors.line1 = null
  //     paymentFormErrors.line2 = null
  //     paymentFormErrors.city = null
  //     paymentFormErrors.phoneNumber = null
  //   } else {
  //     paymentFormValues.name = ''
  //     paymentFormValues.state = ''
  //     paymentFormValues.zipCode = ''
  //     paymentFormValues.line1 = ''
  //     paymentFormValues.line2 = ''
  //     paymentFormValues.city = ''
  //     paymentFormValues.phoneNumber = ''
  //   }
  // }

  // useEffect(() => {
  //   setValidPayment(
  //     Object.values(paymentFormValues)
  //       .map((paymentField) => {
  //         return paymentField.length
  //       })
  //       .filter((paymentField) => {
  //         return paymentField === 0
  //       }).length < 1,
  //   )
  // }, [paymentFormValues])

  const pickUpDateForm = useFormik({
    initialValues: {
      date: null,
      time: null,
    },
    validationSchema: pickUpDateSchema,
  });

  useEffect(() => {
    setValidPickUpDetails(
      Object.values(pickUpDateForm.values).filter((field) => field === null)
        .length < 1
    );
  }, [pickUpDateForm.values]);

  const isAddressFormEmpty = isFormEmpty(addressFormValues);
  const isPaymentFormEmpty = isFormEmpty(paymentFormValues);

  const savePayment = async () => {
    await dispatch(
      updatePaymentInfo({
        formData: { ...paymentFormValues, errors: paymentFormErrors },
      })
    );
    setShowEditPayment(false);
  };

  const saveAddress = async () => {
    dispatch(
      updateReturnAddress({
        formData: { ...addressFormValues, errors: addressFormErrors },
      })
    );
    setShowEditAddress(false);
  };

  const savePickUpDetails = async () => {
    dispatch(
      updatePickUpDetails({
        formData: { ...get(pickUpDateForm, 'values', {}) },
      })
    );
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
      pickUpDateForm.values.time === 'AM'
        ? '9 A.M. - 12 P.M.'
        : '12 P.M. - 3 P.M.';

    return `Between ${timeText
      .replace('-', 'and')
      .replace(new RegExp(/\./g), '')}`;
  };

  return (
    <>
      {!showEditAddress && !showEditPayment && (
        <h3 className='sofia-pro text-18'>Pick-up details</h3>
      )}

      <div style={{ display: isMobile ? 'block' : 'flex' }}>
        {showEditPayment && (
          <PaymentForm
            {...paymentFormValues}
            // address={payment}
            errors={paymentFormErrors}
            handleChange={handlePaymentChange}
            onDoneClick={savePayment}
            // billingAddress={billingAddress}
            setShowEditPayment={setShowEditPayment}
            // onBtnCheck={onBtnCheck}
          />
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
                {!isAddressFormEmpty && !showEditAddress && (
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
                          Add pick-up instructions
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
                                        : `,${addressFormValues.line1}`}
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
                              <div className='arrow-container'>
                                {IsAddressOpen ? (
                                  <img src={LeftArrow} />
                                ) : (
                                  <img src={DownArrow} />
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
                          <div className='address-actions'>
                            <h4
                              className='text-instructions'
                              onClick={() => setModalShow(true)}
                            >
                              Add pick-up instructions
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
                  show={modalShow}
                  onHide={() => setModalShow(false)}
                />

                {isAddressFormEmpty && (
                  <EmptyAddress onClick={() => setShowEditAddress(true)} />
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
                            src='https://www.svgrepo.com/show/46490/credit-card.svg'
                            alt='...'
                          />
                        </div>
                        <div className='mb-4 text-14 text'>
                          Ending in{' '}
                          {paymentFormValues.cardNumber.substr(
                            paymentFormValues.cardNumber.length - 4
                          )}
                        </div>
                      </div>
                      <h3 className='sofia-pro mb-0 mt-2 mb-2 text-14 ine-height-16 c-add'>
                        Card Address
                      </h3>
                      <div>
                        <h4 className='p-0 m-0 sofia-pro postal-name'>
                          {paymentFormValues.fullName}
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
                                    style={{ width: '38px' }}
                                    src='https://www.svgrepo.com/show/46490/credit-card.svg'
                                    alt='...'
                                  />
                                </div>
                                <div className='text-14 text ml-3 ending-text'>
                                  Ending in{' '}
                                  {paymentFormValues.cardNumber.substr(
                                    paymentFormValues.cardNumber.length - 4
                                  )}
                                </div>
                              </Col>
                              <div className='arrow-container'>
                                {IsPaymentOpen ? (
                                  <img src={LeftArrow} />
                                ) : (
                                  <img src={DownArrow} />
                                )}
                              </div>
                            </Row>
                          </div>
                        }
                      >
                        <div className='card-body payment-details-card-body m-0 p-0'>
                          <div className='text-14 text ending-text'>
                            Card Address
                          </div>
                          <div>
                            <h4 className='p-0 m-0 sofia-pro postal-name'>
                              {paymentFormValues.fullName}
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
                          </div>
                          <div className='address-actions mt-4'>
                            <h4
                              className='text-instructions'
                              onClick={() => setShowEditPayment(true)}
                            >
                              Edit payment method
                            </h4>
                          </div>
                        </div>
                      </Collapsible>
                    </div>
                  </>
                )}

                {isPaymentFormEmpty && (
                  <EmptyPayment onClick={() => setShowEditPayment(true)} />
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

                  {get(pickUpDateForm, 'values.date', null) === null &&
                  get(pickUpDateForm, 'values.time', null) === null ? (
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
                        {moment(get(pickUpDateForm, 'values.date', '')).format(
                          'MMMM DD, YYYY'
                        )}
                      </h4>
                      {/* <h4 className='p-0 m-0 sofia-pro'>
                        Between {get(pickUpDateForm, 'values.time', '')}
                      </h4> */}
                      {renderTime()}
                      <h4
                        className='p-0 m-0 sofia-pro mt-2 btn-edit'
                        onClick={openDatePickerModal}
                      >
                        Edit
                      </h4>
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
          form={pickUpDateForm}
          onConfirm={savePickUpDetails}
        />
      </div>
    </>
  );
}
