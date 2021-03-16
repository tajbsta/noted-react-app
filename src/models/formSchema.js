import * as Yup from 'yup';

export const pickUpAddressSchema = Yup.object({
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

export const paymentAddressSchema = Yup.object({
  fullName: Yup.string().min(2).required('We need your name'),
  cardNumber: Yup.number().required('Card number is required'),
  expirationMonth: Yup.number()
    .min(2)
    .max(2)
    .required('Expiration month is required'),
  expirationYear: Yup.string()
    .min(2)
    .max(2)
    .required('Expiration year is required'),
  cvc: Yup.string()
    .min(3, 'Invalid card security number')
    .required('Line 2 is required'),
});
