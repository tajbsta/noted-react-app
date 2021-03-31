import * as Yup from 'yup';

export const pickUpAddressSchema = Yup.object({
  fullName: Yup.string().required('We need your name'),
  state: Yup.string().required('State is required'),
  zipCode: Yup.number()
    .min(4, 'Enter a valid zip code')
    .required('Zip code is required'),
  line1: Yup.string().required('Line 1 is required'),
  line2: Yup.string().required('Line 2 is required'),
  phoneNumber: Yup.string().matches(
    /^(\d{3})(\d{3})(\d{4})$/,
    'Phone number is not valid'
  ),
});

export const paymentAddressSchema = Yup.object({
  fullName: Yup.string().required('We need your name'),
  cardNumber: Yup.string()
    .min(19, 'Enter a valid card number')
    .required('Card number is required'),
  expirationMonth: Yup.number().required('Expiration month is required'),
  expirationYear: Yup.string()
    .min(2, 'Enter a valid expiration year')
    .required('Expiration year is required'),
  cvc: Yup.string()
    .min(3, 'Invalid card security number')
    .required('Line 2 is required'),
});

export const pickUpDateSchema = Yup.object({
  date: Yup.string().required('Date is required'),
  time: Yup.string().required('Time is Required'),
});
