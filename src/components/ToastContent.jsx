export default function ToastContent({ title = '', message = '' }) {
  return (
    <>
      <h3 className='toast-title'>{title}</h3>
      <h4 className='toast-message sofia-pro'>{message}</h4>
    </>
  );
}
