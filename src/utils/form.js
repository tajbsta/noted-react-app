import { isEmpty } from 'lodash-es';

export const formatPhoneNumber = (phoneNumber) => {
  //Filter only numbers from the input
  const cleaned = ('' + phoneNumber).replace(/\D/g, '');

  //Check if the input is of correct length
  let match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3];
  }

  return phoneNumber;
};

export const isFormEmpty = (values) =>
  Object.values(values)
    .map((value) => isEmpty(value))
    .reduce((acc, curr) => acc && curr, true);
