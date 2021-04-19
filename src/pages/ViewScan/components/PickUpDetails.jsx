import React, { useState } from 'react';
import EmptyAddress from '../../../components/EmptyAddress';
import EmptyPayment from '../../../components/EmptyPayment';
import AddressForm from '../../../components/AddressForm';
import PaymentForm from '../../../components/PaymentForm';
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
  updateReturnAdddress,
} from '../../../actions/runtime.action';
import SchedulingModal from '../../../modals/SchedulingModal';
import { get } from 'lodash-es';
import moment from 'moment';
import Collapsible from 'react-collapsible';
import LeftArrow from '../../../assets/icons/RightArrow.svg';
import DownArrow from '../../../assets/icons/DownArrow.svg';
import { Col, Row } from 'react-bootstrap';

function PickUpDetails() {
  /**
   * @UTILITY
   * @returns misc hooks
   */
  const dispatch = useDispatch();

  /**
   * @STATES
   * @returns component states
   */
  const [showEditAddress, setShowEditAddress] = useState(false);
  const [showEditPayment, setShowEditPayment] = useState(false);
  const [isDatePickerOpen, setisDatePickerOpen] = useState(false);
  const [modalShow, setModalShow] = useState(false);

  const [IsAddressOpen, setIsAddressOpen] = useState(false);
  const [IsPaymentOpen, setIsPaymentOpen] = useState(false);
  const [IsScheduleOpen, setIsScheduleOpen] = useState(false);
  /**
   * @FORMSTATE by FORMIK
   * @returns customer address
   */
  const {
    errors: addressFormErrors,
    handleChange: handleAddressChange,
    values: addressFormValues,
  } = useFormik({
    initialValues: {
      fullName: '',
      state: '',
      zipCode: '',
      line1: '',
      city: '',
      phoneNumber: '',
    },
    validationSchema: pickUpAddressSchema,
  });

  /**
   * @FORMSTATE by FORMIK
   * @returns payment
   */
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
    },
    validationSchema: paymentAddressSchema,
  });
  /**
   * @FORMSTATE by FORMIK
   * @returns pickup date
   */
  const pickUpDateForm = useFormik({
    initialValues: {
      date: null,
      time: null,
    },
    validationSchema: pickUpDateSchema,
  });

  /**
   * @VALIDATION
   * @returns boolean of validation
   */
  const isAddressFormEmpty = isFormEmpty(addressFormValues);
  const isPaymentFormEmpty = isFormEmpty(paymentFormValues);

  /**
   * @FUNCTION
   * @submits payment form state
   */
  const savePayment = async () => {
    dispatch(
      updatePaymentInfo({
        formData: { ...paymentFormValues, errors: paymentFormErrors },
      })
    );
    setShowEditPayment(false);
  };

  /**
   * @FUNCTION
   * @submits address form state
   */
  const saveAddress = async () => {
    dispatch(
      updateReturnAdddress({
        formData: { ...addressFormValues, errors: addressFormErrors },
      })
    );
    setShowEditAddress(false);
  };

  /**
   * @FUNCTION
   * @submits address form state
   */
  const savePickUpDetails = async () => {
    dispatch(
      updatePickUpDetails({
        formData: { ...get(pickUpDateForm, 'values', {}) },
      })
    );
  };

  /**
   * @FUNCTION
   * @opens date picker modal
   */
  const openDatePickerModal = () => {
    setisDatePickerOpen(true);
  };

  return (
    <>
      {!showEditAddress && !showEditPayment && (
        <h3 className='sofia-pro text-18'>Pick-up details</h3>
      )}

      <div className='row'>
        {showEditPayment && (
          <PaymentForm
            {...paymentFormValues}
            errors={paymentFormErrors}
            handleChange={handlePaymentChange}
            onDoneClick={savePayment}
          />
        )}
        {showEditAddress && (
          <AddressForm
            {...addressFormValues}
            errors={addressFormErrors}
            handleChange={handleAddressChange}
            onDoneClick={saveAddress}
          />
        )}

        {/* ADDRESS DETAILS */}

        {!showEditAddress && !showEditPayment && (
          <>
            {/***
             * MOBILE TITLE
             */}

            <div className='col-sm-4'>
              <div className='title-container pick-up-address-title-mobile'>
                <div className='p-0'>
                  <p className='pick-up-message sofia-pro text-14 line-height-16 mb-0'>
                    Pick-up Address
                  </p>
                </div>
              </div>

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
                    <div className='pick-up-address-mobile pl-3 pr-4 pb-0 pt-1'>
                      <Collapsible
                        open={IsAddressOpen}
                        onTriggerOpening={() => setIsAddressOpen(true)}
                        onTriggerClosing={() => setIsAddressOpen(false)}
                        trigger={
                          <div>
                            <Row
                              className='p-3 mt-2'
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                              }}
                            >
                              <Col className='p-0'>
                                <h4 className='p-0 m-0 sofia-pro postal-name'>
                                  {addressFormValues.fullName},{' '}
                                  {addressFormValues.line1}
                                </h4>
                                {IsAddressOpen && (
                                  <div>
                                    <h4 className='p-0 m-0 sofia-pro postal-name'>
                                      {addressFormValues.city},{' '}
                                      {addressFormValues.state}{' '}
                                      {addressFormValues.zipCode}
                                    </h4>
                                    <h4 className='p-0 m-0 sofia-pro postal-name'>
                                      United States
                                    </h4>
                                  </div>
                                )}
                                <p
                                  className='sofia-pro p-0 mb-0 tel'
                                  style={{
                                    marginTop: `${IsAddressOpen ? '20px' : ''}`,
                                    transition: 'margin 0.5s',
                                  }}
                                >
                                  Tel:{' '}
                                  {formatPhoneNumber(
                                    addressFormValues.phoneNumber
                                  )}
                                </p>
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
                        <div className='card-body payment-details-card-body m-0 p-0'>
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
                  show={modalShow}
                  onHide={() => setModalShow(false)}
                />

                {isAddressFormEmpty && (
                  <EmptyAddress onClick={() => setShowEditAddress(true)} />
                )}
              </div>
            </div>
            {/* PAYMENT DETAILS */}
            <div className='col-sm-4'>
              <div className='title-container payment-method-title-mobile mt-4'>
                <div className='p-0'>
                  <p className='pick-up-message sofia-pro text-14 line-height-16 mb-0'>
                    Payment Method
                  </p>
                </div>
              </div>
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

                        <h4 className='p-0 m-0 sofia-pro postal-address'>
                          {addressFormValues.line2} {addressFormValues.state}{' '}
                          {addressFormValues.zipCode}
                        </h4>
                      </div>
                    </div>
                    {/**
                     * PAYMENT DETAILS MOBILE
                     */}
                    <div className='pl-3 pr-4 pb-0 pt-0'>
                      <Collapsible
                        open={IsPaymentOpen}
                        onTriggerOpening={() => setIsPaymentOpen(true)}
                        onTriggerClosing={() => setIsPaymentOpen(false)}
                        trigger={
                          <div>
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
                              <Col xs={1}>
                                <div className='arrow-container'>
                                  {IsPaymentOpen ? (
                                    <img src={LeftArrow} />
                                  ) : (
                                    <img src={DownArrow} />
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </div>
                        }
                      >
                        <div className='card-body payment-details-card-body m-0 payment-details-mobile p-0'>
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

                            <h4 className='p-0 m-0 sofia-pro postal-address'>
                              {addressFormValues.line2}{' '}
                              {addressFormValues.state}{' '}
                              {addressFormValues.zipCode}
                            </h4>
                          </div>
                          <div className='address-actions'>
                            <h4
                              className='text-instructions'
                              onClick={() => setModalShow(true)}
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
            <div className='col-sm-4'>
              <div className='title-container payment-method-title-mobile mt-4'>
                <div className='p-0'>
                  <p className='pick-up-message sofia-pro text-14 line-height-16 mb-0'>
                    Pick up
                  </p>
                </div>
              </div>

              <div className='card shadow-sm'>
                <div className='card-body payment-details-card-body pt-4 pb-3 pl-4 m-0 return-schedule'>
                  <div className='title-container'>
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
                      <h4 className='p-0 m-0 sofia-pro'>
                        Between {get(pickUpDateForm, 'values.time', '')}
                      </h4>
                      <h4
                        className='p-0 m-0 sofia-pro mt-2 btn-edit'
                        onClick={openDatePickerModal}
                      >
                        Edit
                      </h4>
                    </>
                  )}
                  <hr />
                  <a className='btn-edit p-0 m-0 sofia-pro noted-purple mt-2 text-14 line-height-16'>
                    Schedule another date
                  </a>
                  <h5 className='sofia-pro text-muted text-price-sched text-14'>
                    (-$10.99)
                  </h5>
                </div>
                {/**
                 * RETURN SCHEDULE MOBILE VIEW
                 */}
                <div className='pl-3 pr-4 pb-0 pt-0'>
                  <Collapsible
                    open={IsScheduleOpen}
                    onTriggerOpening={() => setIsScheduleOpen(true)}
                    onTriggerClosing={() => setIsScheduleOpen(false)}
                    trigger={
                      <Row>
                        <Col>
                          <div className='text-14 text ending-text'>
                            {get(pickUpDateForm, 'values.date', null) ===
                              null &&
                            get(pickUpDateForm, 'values.time', null) ===
                              null ? (
                              <>
                                <h4 className='p-0 ml-3 mt-3 sofia-pro'>
                                  No date selected
                                </h4>
                              </>
                            ) : (
                              <>
                                <Row>
                                  <h4 className='sofia-pro mb-4 mt-4 ml-3'>
                                    {moment(
                                      get(pickUpDateForm, 'values.date', '')
                                    ).format('MMMM DD, YYYY')}
                                  </h4>
                                </Row>
                              </>
                            )}
                          </div>
                        </Col>
                        <Col xs={1}>
                          <div className='arrow-container mt-2'>
                            {IsScheduleOpen ? (
                              <img src={LeftArrow} />
                            ) : (
                              <img src={DownArrow} />
                            )}
                          </div>
                        </Col>
                      </Row>
                    }
                  >
                    <div className='card-body payment-details-card-body m-0 payment-details-mobile p-0'>
                      {get(pickUpDateForm, 'values.date', null) === null &&
                      get(pickUpDateForm, 'values.time', null) === null ? (
                        <>
                          <h4 className='p-0 m-0 sofia-pro'>
                            No date selected
                          </h4>
                          <h4
                            className='p-0 m-0 sofia-pro mt-2 btn-edit'
                            onClick={openDatePickerModal}
                          >
                            Select date
                          </h4>
                        </>
                      ) : (
                        <>
                          <h4 className='p-0 m-0 sofia-pro'>
                            Between {get(pickUpDateForm, 'values.time', '')}
                          </h4>
                          <h4
                            className='p-0 m-0 sofia-pro mt-2 btn-edit'
                            onClick={openDatePickerModal}
                          >
                            Edit
                          </h4>
                        </>
                      )}
                      <hr />
                      <a className='btn-edit p-0 m-0 sofia-pro noted-purple mt-2 text-14 line-height-16'>
                        Schedule another date
                      </a>
                      <h5 className='sofia-pro text-muted text-price-sched text-14 pb-3'>
                        (-$10.99)
                      </h5>
                    </div>
                  </Collapsible>
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

export default PickUpDetails;
