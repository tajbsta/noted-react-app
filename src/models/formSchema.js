import * as Yup from 'yup';

export const pickUpAddressSchema = Yup.object({
  fullName: Yup.string().required('Fill in your name'),
  phoneNumber: Yup.string().matches(
    /^(\d{3})(\d{3})(\d{4})$/,
    'Phone number is not valid'
  ),
  line1: Yup.string().required('Address line 1 is required'),
  city: Yup.string().required('City is required'),
  state: Yup.string().required('State is required'),
  zipCode: Yup.number()
    .min(4, 'Enter a valid zip code')
    .required('Zip code is required'),

});

export const paymentAddressSchema = Yup.object({
  fullName: Yup.string().required('Name on the card'),
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
