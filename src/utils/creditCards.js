import VisaLogo from '../assets/cc/visa.svg';
import MastercardLogo from '../assets/cc/mastercard.svg';
import AmexLogo from '../assets/cc/amex.svg';
import DiscoverLogo from '../assets/cc/discover.svg';
import DinersLogo from '../assets/cc/diners-club.svg';
import JCBLogo from '../assets/cc/jcb.svg';
import UnionPayLogo from '../assets/cc/unionpay.svg';
import UnknownLogo from '../assets/cc/unknowncard.png';

const creditCardTypes = [
  {
    brand: 'visa',
    image: VisaLogo,
    text: 'Visa',
  },
  {
    brand: 'mastercard',
    image: MastercardLogo,
    text: 'Mastercard',
  },
  {
    brand: 'amex',
    image: AmexLogo,
    text: 'American Express',
  },
  {
    brand: 'discover',
    image: DiscoverLogo,
    text: 'Discover',
  },
  {
    brand: 'diners',
    image: DinersLogo,
    text: 'Diners Club',
  },
  {
    brand: 'jcb',
    image: JCBLogo,
    text: 'JCB',
  },
  {
    brand: 'unionpay',
    image: UnionPayLogo,
    text: 'UnionPay',
  }
];

export const getCreditCardType = (brand) => {
  const type = creditCardTypes.find(card => {
    return card.brand === brand
  });
  if (type) {
    return type;
  }
  /**
   * return unknown if invalid
   */
  return {
    image: UnknownLogo,
    text: 'Unknown',
  };
};
