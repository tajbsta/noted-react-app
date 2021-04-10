import React, { useState, useCallback, useRef } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import ProductPlaceholder from '../assets/img/ProductPlaceholder.svg';
import { UploadCloud } from 'react-feather';
import { useDropzone } from 'react-dropzone';
import Flatpickr from 'react-flatpickr';
import { addProductSchema } from '../models/formSchema';
import { useFormik } from 'formik';

export default function AddProductModal(props) {
  const [file, setFile] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    errors,
    handleChange: handleProductChange,
    values: productValues,
  } = useFormik({
    initialValues: {
      productUrl: '',
      vendorTag: '',
      orderDate: '',
      itemName: '',
      amount: '',
      returnDocument: '',
    },
    validationSchema: addProductSchema,
  });

  const {
    productUrl,
    vendorTag,
    orderDate,
    itemName,
    amount,
    returnDocument,
  } = productValues;

  const renderInlineError = (errors) => (
    <small className='form-text p-0 m-0 noted-red'>{errors}</small>
  );

  const hiddenFileInput = React.useRef(null);

  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');
      reader.onload = () => {
        // Do whatever with the file contents
        const binaryStr = reader.result;
        console.log(binaryStr);
      };
      reader.readAsArrayBuffer(file);
    });
  }, []);
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  // Handles file upload event and updates state
  const handleUpload = (event) => {
    // const file = event.target.files[0];
    setFile(event.target.files[0]);

    if (file && file.size > 5097152) {
      alert('File is too large! The maximum size for file upload is 5 MB.');
    }

    setLoading(true);

    // Upload file to server (code goes under)

    setLoading(false);
  };

  // Display Image Component
  const ImageThumb = ({ image }) => {
    return (
      <img
        src={URL.createObjectURL(image)}
        alt={image.name}
        className='product-placeholder'
      />
    );
  };

  return (
    <div>
      <Modal
        {...props}
        size='lg'
        aria-labelledby='contained-modal-title-vcenter'
        centered
        backdrop='static'
        keyboard={false}
        animation={false}
        id='AddProductModal'
      >
        <Modal.Body className='sofia-pro'>
          <Form id='passForm'>
            <Row className='m-row'>
              <Col xs={2}>
                <Form.Group className='productImg-form-group'>
                  <div className='img-container'>
                    <img
                      src={ProductPlaceholder}
                      className={`${
                        file ? 'no-placeholder' : 'default-placeholder'
                      }`}
                    />
                    {file && <ImageThumb image={file} />}
                    <div className='upload-button'>
                      <i
                        className='fa fa-upload-icon'
                        aria-hidden='true'
                        onClick={handleClick}
                        style={{ cursor: 'pointer' }}
                      >
                        <UploadCloud />
                        <input
                          style={{ display: 'none' }}
                          className='file-upload'
                          type='file'
                          accept='.jpg, .jpeg, .png'
                          onChange={handleUpload}
                          ref={hiddenFileInput}
                        />
                      </i>
                    </div>
                  </div>
                </Form.Group>
              </Col>
              <Col>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>Product URL</Form.Label>
                      <Form.Control
                        type='name'
                        isValid={!errors.productUrl && productUrl.length > 0}
                        isInvalid={errors.productUrl}
                        name='productUrl'
                        value={productUrl || ''}
                        onChange={handleProductChange}
                      />
                      {renderInlineError(errors.productUrl)}
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>Merchant</Form.Label>
                      <div className='merchant-container'>
                        <div className='merchant-form-control'>
                          <Form.Control
                            type='name'
                            isValid={!errors.vendorTag && vendorTag.length > 0}
                            isInvalid={errors.vendorTag}
                            name='vendorTag'
                            value={vendorTag || ''}
                            onChange={handleProductChange}
                          />
                        </div>
                        <div className='brand-img-container'>
                          <img
                            src='https://pbs.twimg.com/profile_images/1159166317032685568/hAlvIeYD_400x400.png'
                            alt=''
                            className='brand-img'
                          />
                        </div>
                      </div>
                      {renderInlineError(errors.vendorTag)}
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>Order Date</Form.Label>
                      <div>
                        <Flatpickr
                          className='c-date-picker'
                          options={{
                            dateFormat: 'M j, Y',
                            monthSelectorType: 'static',
                            showMonths: 1,
                          }}
                        />
                      </div>
                      {/* {renderInlineError(errors.orderDate)} */}
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>Product Name</Form.Label>
                      <div>
                        <Form.Control
                          type='name'
                          isValid={!errors.itemName && itemName.length > 0}
                          isInvalid={errors.itemName}
                          name='itemName'
                          value={itemName || ''}
                          onChange={handleProductChange}
                        />
                        {renderInlineError(errors.itemName)}
                      </div>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>Price</Form.Label>
                      <div>
                        <Form.Control
                          type='number'
                          isValid={!errors.amount && amount.length > 0}
                          isInvalid={errors.amount}
                          name='amount'
                          value={amount}
                          onChange={handleProductChange}
                        />
                        {renderInlineError(errors.amount)}
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label className='documents-title'>
                        Return Documents{' '}
                        <small style={{ fontSize: '12px' }}>
                          (ie. Amazon QR code, receipts, and shipping labels)
                        </small>
                      </Form.Label>
                      <div className='dropzone-container' {...getRootProps()}>
                        <input {...getInputProps()} />
                        <p className='sofia-pro text-drag'>
                          Drag & drop or click to upload
                        </p>
                      </div>
                      {/* {renderInlineError(errors.returnDocument)} */}
                    </Form.Group>
                  </Col>
                </Row>
              </Col>
            </Row>

            <Row>
              <Col className='btn btn-container'>
                <Button className='btn-cancel' onClick={props.onHide}>
                  Cancel
                </Button>
                <Button className='btn-save' type='submit'>
                  Save Changes
                </Button>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
