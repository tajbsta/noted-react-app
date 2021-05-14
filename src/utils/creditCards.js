import MastercardSvg from '../assets/img/mastercard.svg';
import VisaCardSvg from '../assets/img/visa.svg';

const creditCardTypes = [
  {
    filter: new RegExp('^5[1-5][0-9]{14}$'),
    image: MastercardSvg,
    text: 'Mastercard',
  },
  {
    filter: new RegExp('^4'),
    image: VisaCardSvg,
    text: 'Visa',
  },
  {
    filter: new RegExp('^2[2-7][0-9]{14}$'),
    image: MastercardSvg,
    text: 'Mastercard',
  },
];

export const getCreditCardType = (cardNumber) => {
  const type = creditCardTypes.find(({ filter }) => {
    return filter.test(cardNumber);
  });
  if (type) {
    return type;
  }
  /**
   * return unknown if invalid
   */
  return {
    image: '',
    text: 'Unknown',
  };
};
