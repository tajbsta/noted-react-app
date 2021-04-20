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
} from '../../../models/formSchema.js';
import { get } from 'lodash-es';
import moment from 'moment';
import SchedulingModal from '../../../modals/SchedulingModal';
import { updatePickUpDetails } from '../../../actions/runtime.action';
import { useDispatch } from 'react-redux';

function PickUpDetails({ address, payment, details }) {
  const dispatch = useDispatch();
  const [showEditAddress, setShowEditAddress] = useState(false);
  const [showEditPayment, setShowEditPayment] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const {
    errors: addressFormErrors,
    handleChange: handleAddressChange,
    values: addressFormValues,
  } = useFormik({
    initialValues: {
      fullName: get(address, 'fullName', ''),
      state: get(address, 'state', ''),
      zipCode: get(address, 'zipCode', ''),
      city: get(address, 'city', ''),
      line1: get(address, 'line1', ''),
      line2: get(address, 'line2', ''),
      phoneNumber: get(address, 'phoneNumber', ''),
    },
    validationSchema: pickUpAddressSchema,
  });

  const {
    errors: paymentFormErrors,
    handleChange: handlePaymentChange,
    values: paymentFormValues,
  } = useFormik({
    initialValues: {
      fullName: get(payment, 'fullName', ''),
      cardNumber: get(payment, 'cardNumber', ''),
      expirationMonth: get(payment, 'expirationMonth', ''),
      expirationYear: get(payment, 'expirationYear', ''),
      cvc: get(payment, 'cvc', ''),
    },
    validationSchema: paymentAddressSchema,
  });

  const pickUpDateForm = useFormik({
    initialValues: {
      date: get(details, 'date', null),
      time: get(details, 'time', null),
    },
    validationSchema: pickUpDateSchema,
  });

  const isAddressFormEmpty = isFormEmpty(addressFormValues);
  const isPaymentFormEmpty = isFormEmpty(paymentFormValues);

  const savePickUpDetails = async () => {
    dispatch(
      updatePickUpDetails({
        formData: { ...get(pickUpDateForm, 'values', {}) },
      })
    );
  };

  const openDatePickerModal = () => {
    setIsDatePickerOpen(true);
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
            onDoneClick={() => setShowEditPayment(false)}
          />
        )}
        {showEditAddress && (
          <AddressForm
            {...addressFormValues}
            errors={addressFormErrors}
            handleChange={handleAddressChange}
            onDoneClick={() => setShowEditAddress(false)}
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
                  <div className='title-container'>
                    <div className='p-0'>
                      <p className='pick-up-message sofia-pro text-14 line-height-16'>
                        Pick up
                      </p>
                    </div>
                  </div>
                  <h4 className='sofia-pro mb-4'>
                    {' '}
                    {moment(get(pickUpDateForm, 'values.date', '')).format(
                      'MMMM DD, YYYY'
                    )}
                  </h4>
                  <h4 className='p-0 m-0 sofia-pro'>
                    Between {pickUpDateForm.values.time}
                  </h4>
                  <h4
                    className='p-0 m-0 sofia-pro mt-2 btn-edit'
                    onClick={openDatePickerModal}
                  >
                    Edit
                  </h4>
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
      </div>
      <SchedulingModal
        show={isDatePickerOpen}
        onHide={() => setIsDatePickerOpen(false)}
        form={pickUpDateForm}
        onConfirm={savePickUpDetails}
      />
    </>
  );
}

export default PickUpDetails;
