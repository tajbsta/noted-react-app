import ReactPixel from 'react-facebook-pixel';

export const INITIATE_CHECKOUT = () => {
  ReactPixel.track('InitiateCheckout');
};

export const LEAD = () => {
  ReactPixel.track('Lead');
};

export const SUBMIT_APPLICATION = () => {
  ReactPixel.track('SubmitApplication');
};
