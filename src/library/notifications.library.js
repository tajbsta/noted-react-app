import { toast } from 'react-toastify';
import ToastContent from '../components/ToastContent';

export const showSuccess = async ({ title = '', message = '' }) => {
  return toast(<ToastContent title={title} message={message} />, {
    hideProgressBar: true,
    className: 'toast-success',
  });
};

export const showWarning = async ({ title, message }) => {
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
