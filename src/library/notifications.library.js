import { toast } from 'react-toastify';

const renderToastContent = ({ title = '', message = '' }) => {
  return (
    <>
      <h3>{title}</h3>
      <h4>{message}</h4>
    </>
  );
};

export const showSuccess = ({ title = '', message = '' }) => {
  return toast(renderToastContent({ title, message }), {
    hideProgressBar: true,
    className: 'toast-success',
  });
};

export const showWarning = ({ title, message }) => {
  return toast(renderToastContent({ title, message }), {
    hideProgressBar: true,
    className: 'toast-warning',
  });
};

export const showError = ({ title, message }) => {
  return toast(renderToastContent({ title, message }), {
    hideProgressBar: true,
    className: 'toast-error',
  });
};
