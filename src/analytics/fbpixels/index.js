import ReactPixel from 'react-facebook-pixel';

export const initiateCheckout = () => {
  ReactPixel.track('InitiateCheckout');
};

export const lead = () => {
  ReactPixel.track('Lead');
};

export const submitApplication = () => {
  ReactPixel.track('SubmitApplication');
};
