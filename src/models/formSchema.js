import * as Yup from 'yup';
import { PASSWORD_REGEX_FORMAT } from '../constants/errors/regexFormats';
import { supportedZipcode } from '../constants/utils';

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
  code: Yup.number().min(6, 'Not correct length').required('Code is required'),
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
    'Not a valid phone number'
  ),
  line1: Yup.string().required('Address line 1 is required'),
  city: Yup.string().required('City is required'),
  state: Yup.string().required('State is required'),
  zipCode: Yup.string()
    .oneOf(supportedZipcode, 'Not yet available in your area')
    .min(4, 'Enter a valid zip code')
    .required('Zip code is required'),
});

export const paymentAddressSchema = Yup.object({
  fullName: Yup.string().required('Cardholder name is required'),
  cardNumber: Yup.string()
    .matches(/^[0-9]+$/gi, 'Must be a Number')
    .max(16, 'Enter a valid card number')
    .min(16, 'Enter a valid card number')
    .required('Card number is required'),
  expirationMonth: Yup.string()
    .matches(/^[0-9]+$/gi, 'Must be a Number')
    .max(2, 'Enter a valid expiration month')
    .required('Expiration month is required'),
  expirationYear: Yup.string()
    .matches(/^[0-9]+$/gi, 'Must be a Number')
    .max(2, 'Enter a valid expiration year')
    .required('Expiration year is required'),
  cvc: Yup.string()
    .matches(/^[0-9]+$/gi, 'Must be a Number')
    .min(3, 'Enter a valid security number')
    .max(3, 'Enter a valid security number')
    .required('CVC is required'),
  name: Yup.string().required('Full Name is required'),
  phoneNumber: Yup.string()
    .required('Phone is required')
    .matches(/^(\d{3})(\d{3})(\d{4})$/, 'Not a valid phone number')
    .max(10, 'Invalid Phone'),
  line1: Yup.string().required('Address line 1 is required'),
  city: Yup.string().required('City is required'),
  state: Yup.string().required('State is required'),
  zipCode: Yup.string()
    .min(4, 'Enter a valid zip code')
    .required('Zip code is required'),
});

export const pickUpDateSchema = Yup.object({
  date: Yup.string().required('Date is required'),
  time: Yup.string().required('Time is required'),
});

export const addProductSchema = Yup.object({
  orderDate: Yup.string().required('Order date is required'),
  orderRef: Yup.string().required('Order ref # is required'),
  name: Yup.string().required('Product name is required'),
  price: Yup.string().required("Product's price is required"),
});

export const addProductStandardSchema = Yup.object({
  vendorTag: Yup.string().required('Merchant is required'),
  orderDate: Yup.string().required('Order date is required'),
  orderRef: Yup.string().required('Order ref # is required'),
  itemName: Yup.string().required('Product name is required'),
  amount: Yup.string().required("Product's amount is required"),
  returnDocuments: Yup.array().min(
    1,
    'Please upload a receipt for this product.'
  ),
});

export const addProductDonationSchema = Yup.object({
  itemName: Yup.string().required('Product name is required'),
  organisation: Yup.string().required('Please select an organisation'),
  amount: Yup.string().required("Product's amount is required"),
  itemImages: Yup.array().min(1, 'Please upload a receipt for this product.'),
});

export const editProductSchema = Yup.object({
  productUrl: Yup.string()
    .url('Enter valid url')
    .required('Please enter website'),
  vendorTag: Yup.string().required('Merchant is required'),
  orderDate: Yup.string().required('Order date is required'),
  orderRefNo: Yup.string().required('Order ref # is required'),
  itemName: Yup.string().required('Product name is required'),
  amount: Yup.number().required("Product's amount is required"),
  returnDocument: Yup.object()
    .shape({
      name: Yup.string().required(),
    })
    .label('File'),
});

export const selectDonationOrgSchema = Yup.object({
  donationOrg: Yup.string().required(
    'Please select a charity before confirming order.'
  ),
});

export const checkZipcodeSchema = Yup.object({
  zipCode: Yup.string()
    .oneOf(supportedZipcode, 'not available')
    .min(4, 'Enter a valid zip code')
    .required('Zip code is required'),
});

export const collateUserInfoSchema = Yup.object({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string()
    .email('Enter a valid email address')
    .required('Email is required'),
  zipCode: Yup.string()
    .min(4, 'Enter a valid zip code')
    .required('Zip code is required'),
});

export const addVendorSchema = Yup.object({
  image: Yup.string().required('Vendor Logo is required'),
  vendorName: Yup.string().required('Vendor Name is required'),
  vendorAddress: Yup.string().required('Vendor Address is required'),
  vendorWebsite: Yup.string().required('Vendor Website is required'),
});
