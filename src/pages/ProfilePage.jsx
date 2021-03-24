import React, { useState } from 'react';
import UserInfo from '../components/Profile/UserInfo';
import Address from '../components/Profile/Address';
import Payment from '../components/Profile/Payment';
import ReturnHistory from '../components/Profile/ReturnHistory';
import { useFormik } from 'formik';
import {
  paymentAddressSchema,
  pickUpAddressSchema,
} from '../models/formSchema';
import BasicInfo from '../components/Settings/BasicInfo';

export default function ProfilePage() {
  /**
   * @STATES
   * @returns component states
   */
  const [showEditPayment, setShowEditPayment] = useState(true);

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
      line2: '',
      phoneNumber: '',
    },
    validationSchema: pickUpAddressSchema,
  });

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

  return (
    <div id='Profile'>
      <div className='container mt-6'>
        <div className='row'>
          <div className='col-sm-3'>
            {/*LEFT CARD*/}
            <div className='col'>
              <UserInfo />
            </div>
          </div>
          <div className='col-sm-9'>
            <BasicInfo
              {...addressFormValues}
              handleChange={handleAddressChange}
            />
            {showEditPayment && (
              <div className='mt-5'>
                <Payment
                  {...paymentFormValues}
                  handleChange={handlePaymentChange}
                />
              </div>
            )}
            <ReturnHistory />
          </div>
        </div>
      </div>
    </div>
  );
}
