import * as Yup from 'yup'
import { PASSWORD_REGEX_FORMAT } from '../constants/errors/regexFormats'

export const registerSchema = Yup.object({
  email: Yup.string()
    .email('Enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .required(
      'Your password must be 8-20 characters long and must contain a letter, symbol and a number',
    )
    .matches(PASSWORD_REGEX_FORMAT, {
      message:
        'Your password must be 8-20 characters long and must contain a letter, symbol and a number',
    })
    .resolve(),
})

export const forgotPasswordSchema = Yup.object({
  email: Yup.string()
    .email('Enter a valid email address')
    .required('Email is required'),
})

export const resetPasswordSchema = Yup.object().shape({
  code: Yup.number().min(6, 'Not correct length').required('Code is required'),
  newPassword: Yup.string()
    .required(
      'Your password must be 8-20 characters long and must contain a letter, symbol and a number',
    )
    .matches(PASSWORD_REGEX_FORMAT, {
      message:
        'Your password must be 8-20 characters long and must contain a letter, symbol and a number',
    }),
  confirmNewPassword: Yup.string().when('newPassword', {
    is: (val) => (val && val.length > 0 ? true : false),
    then: Yup.string().oneOf(
      [Yup.ref('newPassword')],
      'Passwords do not match',
    ),
  }),
})

const supportedZipcode = [
  '37201',
  '37014',
  '37202',
  '37024',
  '37203',
  '37027',
  '37204',
  '37046',
  '37205',
  '37062',
  '37206',
  '37064',
  '37207',
  '37065',
  '37208',
  '37067',
  '37209',
  '37068',
  '37210',
  '37069',
  '37211',
  '37135',
  '37212',
  '38476',
  '37213',
  '37179',
  '37214',
  '37071',
  '37215',
  '37087',
  '37216',
  '37088',
  '37217',
  '37090',
  '37218',
  '37121',
  '37219',
  '37122',
  '37220',
  '37136',
  '37221',
  '37184',
  '37222',
  '37223',
  '37224',
  '37225',
  '37226',
  '37227',
  '37228',
  '37229',
  '37230',
  '37235',
  '37238',
  '37239',
  '37242',
  '37243',
  '37244',
  '37245',
  '37247',
  '37248',
  '37249',
]

export const pickUpAddressSchema = Yup.object({
  fullName: Yup.string().required('Fill in your name'),
  phoneNumber: Yup.string().matches(
    /^(\d{3})(\d{3})(\d{4})$/,
    'Not a valid phone number',
  ),
  line1: Yup.string().required('Address line 1 is required'),
  city: Yup.string().required('City is required'),
  state: Yup.string().required('State is required'),
  zipCode: Yup.string()
    .oneOf(supportedZipcode, 'Not yet available in your area')
    .min(4, 'Enter a valid zip code')
    .required('Zip code is required'),
})

export const paymentAddressSchema = Yup.object({
  fullName: Yup.string().required('Name on the card'),
  cardNumber: Yup.string()
    .min(16, 'Enter a valid card number')
    .required('Card number is required'),
  expirationMonth: Yup.number().required('Expiration month is required'),
  expirationYear: Yup.string()
    .min(2, 'Enter a valid expiration year')
    .required('Expiration year is required'),
  cvc: Yup.string()
    .min(3, 'Invalid card security number')
    .required('Line 2 is required'),
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
})

export const pickUpDateSchema = Yup.object({
  date: Yup.string().required('Date is required'),
  time: Yup.string().required('Time is required'),
})

export const addProductSchema = Yup.object({
  productUrl: Yup.string()
    .url('Enter valid url')
    .required('Please enter website'),
  vendorTag: Yup.string().required('Merchant is required'),
  orderDate: Yup.string().required('Order date is required'),
  orderRefNo: Yup.string().required('Order ref # is required'),
  itemName: Yup.string().required('Product name is required'),
  amount: Yup.string().required("Product's amount is required"),
  returnDocument: Yup.object()
    .shape({
      name: Yup.string().required(),
    })
    .label('File'),
})

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
})
