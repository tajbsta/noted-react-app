import * as Yup from 'yup';
import { PASSWORD_REGEX_FORMAT } from '../constants/errors/regexFormats'

export const registerSchema = Yup.object({
  email: Yup.string()
    .email('Enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .required(
      'Your password must be 8-20 characters long and must contain a letter, symbol and a number'
    )
    .matches(PASSWORD_REGEX_FORMAT, {
      message:
        'Your password must be 8-20 characters long and must contain a letter, symbol and a number',
    })
    .resolve(),
});

export const forgotPasswordSchema = Yup.object({
  email: Yup.string()
    .email('Enter a valid email address')
    .required('Email is required'),
});

export const resetPasswordSchema = Yup.object().shape({
  code: Yup.number()
    .min(6, 'Not correct length')
    .required('Code is required'),
  newPassword: Yup.string()
    .required(
      'Your password must be 8-20 characters long and must contain a letter, symbol and a number'
    )
    .matches(PASSWORD_REGEX_FORMAT, {
      message:
        'Your password must be 8-20 characters long and must contain a letter, symbol and a number',
    }),
  confirmNewPassword: Yup.string().when('newPassword', {
    is: (val) => (val && val.length > 0 ? true : false),
    then: Yup.string().oneOf(
      [Yup.ref('newPassword')],
      'Passwords do not match'
    ),
  }),
});


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
  time: Yup.string().required('Time is required'),
});


export const addProductSchema = Yup.object({
  productUrl: Yup.string()
    .url('Enter valid url')
    .required('Please enter website'),
  vendorTag: Yup.string().required('Merchant is required'),
  orderDate: Yup.string().required('Order date is required'),
  orderRefNo: Yup.string().required('Order ref # is required'),
  itemName: Yup.string().required('Product name is required'),
  amount: Yup.number().required('Product\'s amount is required'),
  returnDocument: Yup.object().shape({
    name: Yup.string().required()
  }).label('File')
});

export const editProductSchema = Yup.object({
  productUrl: Yup.string()
    .url('Enter valid url')
    .required('Please enter website'),
  vendorTag: Yup.string().required('Merchant is required'),
  orderDate: Yup.string().required('Order date is required'),
  orderRefNo: Yup.string().required('Order ref # is required'),
  itemName: Yup.string().required('Product name is required'),
  amount: Yup.number().required('Product\'s amount is required'),
  returnDocument: Yup.object().shape({
    name: Yup.string().required()
  }).label('File')
});