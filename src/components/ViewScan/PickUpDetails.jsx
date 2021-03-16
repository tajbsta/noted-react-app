import React, { useState } from 'react';
import EmptyAddress from './EmptyAddress';
import EmptyPayment from './EmptyPayment';
import AddressForm from '../../components/ViewScan/AddressForm';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { isEmpty } from 'lodash-es';
import { formatPhoneNumber, isFormEmpty } from '../../utils/form';

function PickUpDetails() {
  const [emptyAddress, setEmptyAddress] = useState(true);
  const [emptyPayment, setEmptyPayment] = useState(true);
  const [showEditAddress, setShowEditAddress] = useState(false);

  const pickUpAddressSchema = Yup.object({
    fullName: Yup.string().min(2).required('We need your name'),
    state: Yup.number().required('State is required'),
    zipCode: Yup.number().required('Zipcode is required'),
    line1: Yup.string().min(2).required('Line 1 is required'),
    line2: Yup.string().min(2).required('Line 2 is required'),
    phoneNumber: Yup.string().matches(
      /^(\d{3})(\d{3})(\d{4})$/,
      'Phone number is not valid'
    ),
  });

  const { errors, handleChange, values } = useFormik({
    initialValues: {
      fullName: '',
      state: '',
      zipCode: '',
      line1: '',
      line2: '',
      phoneNumber: '',
    },
    validationSchema: pickUpAddressSchema,
  });

  const isAddressFormEmpty = isFormEmpty(values);

  console.log(values);

  return (
    <>
      {!showEditAddress && (
        <h3 className='sofia-pro text-18'>Pick-up details</h3>
      )}

      <div className='row'>
        {showEditAddress && (
          <AddressForm
            {...values}
            errors={errors}
            handleChange={handleChange}
            setShowEditAddress={setShowEditAddress}
          />
        )}

        {/* ADDRESS DETAILS */}

        {!showEditAddress && (
          <>
            <div className='col-sm-4'>
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
                        {values.fullName}
                      </h4>
                      <h4 className='p-0 m-0 sofia-pro line1'>
                        {values.line1}
                      </h4>
                      <h4 className='p-0 m-0 sofia-pro line1'>
                        {values.line2}
                      </h4>
                      <h4 className='p-0 m-0 sofia-pro line1'>
                        {values.state} {values.zipCode}
                      </h4>
                    </div>
                    <p className='sofia-pro mt-3 tel'>
                      Tel: {formatPhoneNumber(values.phoneNumber)}
                    </p>
                    <p className='sofia-pro noted-purple mt-3 btn-add-instructions'>
                      Add pick-up instructions
                    </p>
                  </div>
                )}

                {isAddressFormEmpty && (
                  <EmptyAddress onClick={() => setShowEditAddress(true)} />
                )}
              </div>
            </div>
            {/* PAYMENT DETAILS */}
            <div className='col-sm-4'>
              <div className='card shadow-sm'>
                {!emptyPayment && (
                  <div className='card-body payment-details-card-body pt-4 pb-3 pl-4 m-0'>
                    <div className='title-container'>
                      <div className='p-0'>
                        <p className='pick-up-message sofia-pro text-14 line-height-16'>
                          Payment method
                        </p>
                      </div>
                      <div>
                        <a className='btn-edit sofia-pro text-14 line-height-16'>
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
                      <div className='mb-4 text-14 text'>Ending in 9456</div>
                    </div>
                    <h3 className='sofia-pro mb-0 mt-2 mb-2 text-14 ine-height-16 c-add'>
                      Card Address
                    </h3>
                    <div>
                      <h4 className='p-0 m-0 sofia-pro postal-name'>
                        Alexis Jones
                      </h4>
                      <h4 className='p-0 m-0 sofia-pro postal-address'>
                        1 Titans Way Nashville, TN 37213 United States
                      </h4>
                    </div>
                  </div>
                )}

                {emptyPayment && (
                  <EmptyPayment onClick={() => setEmptyPayment(false)} />
                )}
              </div>
            </div>
            {/* RETURN SCHEDULE */}
            <div className='col-sm-4'>
              <div className='card shadow-sm'>
                <div className='card-body payment-details-card-body pt-4 pb-3 pl-4 m-0'>
                  <div className='title-container'>
                    <div className='p-0'>
                      <p className='pick-up-message sofia-pro text-14 line-height-16'>
                        Pick up
                      </p>
                    </div>
                  </div>
                  <h4 className='sofia-pro mb-4'>Today</h4>
                  <h4 className='p-0 m-0 sofia-pro'>Between 2pm and 3pm</h4>
                  <h4 className='p-0 m-0 sofia-pro mt-2 btn-edit'>Edit</h4>
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
    </>
  );
}

export default PickUpDetails;
