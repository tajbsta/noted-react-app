import React from 'react';
import UserInfo from '../components/Profile/UserInfo';
import Address from '../components/Profile/Address';
import Payment from '../components/Profile/Payment';
import ReturnHistory from '../components/Profile/ReturnHistory';
import AddressForm from '../components/ViewScan/AddressForm';
import { useFormik } from 'formik';
import { pickUpAddressSchema } from '../models/formSchema';

export default function ProfilePage() {
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

  return (
    <div>
      <div className='container mt-6'>
        <div className='row'>
          <div className='col-sm-3'>
            {/*RIGHT CARD*/}
            <div className='col'>
              <UserInfo />
            </div>
          </div>
          <div className='col-sm-9'>
            {/*LEFT CARD*/}
            <AddressForm
              {...addressFormValues}
              errors={addressFormErrors}
              handleChange={handleAddressChange}
            />
            <Payment />
            <ReturnHistory />
          </div>
        </div>
      </div>
    </div>
  );
}
