import React, { useEffect, useState } from 'react';
import { Modal, Button, Row, Col, Form, Spinner } from 'react-bootstrap';
import { useFormik } from 'formik';
import { addVendorSchema } from '../models/formSchema';
import { AlertCircle, Upload } from 'react-feather';
import { saveVendorReview, uploadVendorLogo } from '../api/vendorApi';
import { getUser } from '../api/auth';
import { showError, showSuccess } from '../library/notifications.library';

export default function AddVendorModal({ onHide, show }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState({});

  const reset = () => {
    setIsSubmitting(false);
    setTimeout(() => {
      onHide();
    }, 1000);
  };

  const handleAddVendor = async (vendor) => {
    const file = vendor.image;
    if (file && file.size > 5097152) {
      alert('File is too large! The maximum size for file upload is 5 MB.');
      return;
    }
    try {
      setIsSubmitting(true);
      const logo = await uploadVendorLogo(user.sub, file);
      const response = await saveVendorReview({
        logo,
        name: vendor.vendorName,
        address: vendor.vendorAddress,
        website: vendor.vendorWebsite,
      });
      if (response.status === 'success') {
        showSuccess({
          message: (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <AlertCircle />
              <h4 className='ml-3 mb-0' style={{ lineHeight: '16px' }}>
                Add new vendor successful.
              </h4>
            </div>
          ),
        });
      } else {
        showError({
          message: (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <AlertCircle />
              <h4 className='ml-3 mb-0' style={{ lineHeight: '16px' }}>
                Error! Add new vendor fail!
              </h4>
            </div>
          ),
        });
      }
      setIsSubmitting(false);
    } catch (error) {
      setIsSubmitting(false);
      showError({
        message:
          'Your request could not be completed because of an error. Please try again later.',
      });
    }
  };

  const {
    errors,
    handleChange,
    values,
    isValid,
    setFieldValue,
    handleBlur,
    handleSubmit,
  } = useFormik({
    initialValues: {
      image: '',
      vendorName: '',
      vendorWebsite: '',
      vendorAddress: '',
    },
    validationSchema: addVendorSchema,
    enableReinitialize: true,
    validateOnBlur: true,
    onSubmit: (values) => handleAddVendor(values),
  });

  useEffect(() => {
    (async () => {
      const user = await getUser();
      setUser(user);
    })();
  }, []);

  const [focused, setFocused] = useState({
    ...Object.keys((key) => ({ [key]: false })),
  });

  const onFocus = (e) => {
    setFocused({ ...focused, [e.target.name]: true });
  };

  const renderInlineValidationError = (fieldName) => {
    const error = errors[fieldName];
    return (
      focused[fieldName] &&
      error && <small className='form-text p-0 m-0 noted-red'>{error}</small>
    );
  };

  const ActionButtons = () => {
    return (
      <Row className='mt-5 button-container flex justify-center'>
        <Button
          variant='primary'
          size='md'
          className='px-5'
          type='submit'
          disabled={!isValid}
        >
          {isSubmitting ? (
            <Spinner
              as='span'
              animation='border'
              size='sm'
              role='status'
              aria-hidden='true'
            />
          ) : (
            'Submit'
          )}
        </Button>
      </Row>
    );
  };

  const { image, vendorName, vendorWebsite, vendorAddress } = values;

  const hiddenFileInput = React.useRef(null);

  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setFieldValue('image', file);
  };

  return (
    <Modal
      show={show}
      size='md'
      aria-labelledby='contained-modal-title-vcenter'
      centered
      backdrop='static'
      keyboard={false}
      animation={false}
      id='AddVendorModal'
    >
      <Modal.Header closeButton onClick={reset}>
        <h2>New Vendor</h2>
      </Modal.Header>
      <Modal.Body className='sofia-pro'>
        <form id='PaymentForm' className='mt-5' onSubmit={handleSubmit}>
          <Row>
            <Col>
              <Form.Group>
                <div className='img-container' onClick={handleClick}>
                  {image ? (
                    <>
                      <img
                        src={URL.createObjectURL(image)}
                        alt={image.name}
                        style={{
                          width: '100%',
                          height: '100%',
                        }}
                      />
                      <div className='upload-wrapper'>
                        <div className='upload-icon'>
                          <Upload />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className='upload-icon'>
                        <Upload />
                      </div>
                      <h4 className='sofia-pro mt-4 upload-text'>
                        Upload vendor logo
                      </h4>
                    </>
                  )}
                  <input
                    style={{ display: 'none' }}
                    className='file-upload'
                    type='file'
                    accept='.jpg, .jpeg, .png'
                    onChange={handleUpload}
                    ref={hiddenFileInput}
                  />
                </div>
              </Form.Group>
              <Form.Group>
                <Form.Label>Vendor Name</Form.Label>
                <Form.Control
                  className='form-control'
                  name='vendorName'
                  onChange={handleChange}
                  value={vendorName}
                  onBlur={handleBlur}
                  onFocus={onFocus}
                />
                {renderInlineValidationError('vendorName')}
              </Form.Group>
              <Form.Group>
                <Form.Label>Vendor Website</Form.Label>
                <Form.Control
                  className='form-control'
                  name='vendorWebsite'
                  onChange={handleChange}
                  value={vendorWebsite}
                  onBlur={handleBlur}
                  onFocus={onFocus}
                />
                {renderInlineValidationError('vendorWebsite')}
              </Form.Group>
              <Form.Group>
                <Form.Label>Vendor Address</Form.Label>
                <Form.Control
                  className='form-control'
                  type='name'
                  name='vendorAddress'
                  onChange={handleChange}
                  value={vendorAddress}
                  onBlur={handleBlur}
                  onFocus={onFocus}
                />
                {renderInlineValidationError('vendorAddress')}
              </Form.Group>
            </Col>
          </Row>
          <ActionButtons />
        </form>
      </Modal.Body>
    </Modal>
  );
}
