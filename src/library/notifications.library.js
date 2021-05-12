import { toast } from 'react-toastify';
import ToastContent from '../components/ToastContent';

export const showSuccess = ({ title = '', message = '' }) => {
  return toast(<ToastContent title={title} message={message} />, {
    hideProgressBar: true,
    className: 'toast-success',
  });
};

export const showWarning = ({ title, message }) => {
  return toast(<ToastContent title={title} message={message} />, {
    hideProgressBar: true,
    className: 'toast-warning',
  });
};

export const showError = ({ title, message }) => {
  return toast(<ToastContent title={title} message={message} />, {
    hideProgressBar: true,
    className: 'toast-error',
  });
};
