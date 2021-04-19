import React, { useState, useEffect } from 'react';
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
  const [isMobile, setIsMobile] = useState(false);

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
            <div className='col-sm-4'>
              {isMobile && (
                <p className='mobile-form-title first-title'>Pick-up Address</p>
              )}
              <div className='card shadow-sm'>
                {!isAddressFormEmpty && !showEditAddress && (
                  <div className='card-body payment-details-card-body pt-4 pb-3 pl-4 m-0'>
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
                      <h4 className='p-0 m-0 sofia-pro line1'>United States</h4>
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
              {isMobile && <p className='mobile-form-title'>Payment method</p>}
              <div className='card shadow-sm'>
                {!isPaymentFormEmpty && !showEditPayment && (
                  <div className='card-body payment-details-card-body pt-4 pb-3 pl-4 m-0'>
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
                )}

                {isPaymentFormEmpty && (
                  <EmptyPayment onClick={() => setShowEditPayment(true)} />
                )}
              </div>
            </div>
            {/* RETURN SCHEDULE */}
            <div className='col-sm-4'>
              {isMobile && <p className='mobile-form-title'>Pick up</p>}
              <div className='card shadow-sm'>
                <div className='card-body payment-details-card-body pt-4 pb-3 pl-4 m-0'>
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
