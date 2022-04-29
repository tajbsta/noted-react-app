import React, { useEffect, useState, forwardRef } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import ProductPlaceholder from '../assets/img/ProductPlaceholder.svg';
import { UploadCloud } from 'react-feather';
import { useDropzone } from 'react-dropzone';
import { get } from 'lodash';
import { getFileTypeIcon } from '../utils/file';
import { formatCurrency } from '../library/number';
import DatePicker from 'react-datepicker';
import { useFormik } from 'formik';
import 'react-datepicker/src/stylesheets/datepicker.scss';
import { addProductSchema } from '../models/formSchema';

export default function EditProductModal({
  product,
  show,
  onHide,
  onEditSubmit,
}) {
  const [file, setFile] = useState('');

  const {
    handleChange,
    values,
    setFieldValue,
    errors,
    handleSubmit,
  } = useFormik({
    enableReinitialize: true,
    initialValues: {
      price: formatCurrency(get(product, 'price', 0)),
      orderRef: get(product, 'order_ref', ''),
      orderDate: get(product, 'order_date', ''),
      name: get(product, 'name', ''),
      imageUrl: get(product, 'thumbnail', ''),
      vendorTag: get(product, 'vendor', ''),
    },
    validationSchema: addProductSchema,
    onSubmit: async (values) => {
      const _id = get(product, '_id', '');
      const { orderDate, name, price, orderRef } = values;

      const payload = {
        _id,
        orderDate,
        name,
        price: Number(parseFloat(price).toFixed(2)),
        orderRef,
      };

      onEditSubmit({ _id, payload });

      onHide();
    },
  });

  const { imageUrl, vendorTag, orderDate, name, price, orderRef } = values;

  const hiddenFileInput = React.useRef(null);

  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  const { getRootProps, getInputProps, acceptedFiles } = useDropzone();

  const acceptedFileItems = acceptedFiles.map((file) => {
    return (
      <li
        key={file.path}
        className='edit-list-item'
        style={{
          listStyle: 'none',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {getFileTypeIcon(file.path)}
        <span className='ml-2'>{file.path}</span>
      </li>
    );
  });

  // Handles file upload event and updates state
  const handleUpload = (event) => {
    // const file = event.target.files[0];
    setFile(event.target.files[0]);
    setFieldValue('imageUrl', URL.createObjectURL(event.target.files[0]));

    if (file && file.size > 5097152) {
      alert('File is too large! The maximum size for file upload is 5 MB.');
    }
  };

  // Display Product Image Component
  const ImageThumb = ({ image }) => {
    return (
      <img
        src={URL.createObjectURL(image)}
        alt={image.name}
        className='product-placeholder'
      />
    );
  };

  const renderInlineError = (error) => (
    <small className='form-text p-0 m-0 noted-red'>{error}</small>
  );

  const renderDatePicker = () => {
    const [startDate, setStartDate] = useState(orderDate);
    // eslint-disable-next-line react/display-name
    const CustomInput = forwardRef(({ value, onClick }, ref) => (
      <div
        className='btn'
        style={{ width: '100%' }}
        onClick={(e) => {
          e.preventDefault();
          onClick();
        }}
        ref={ref}
      >
        {value}
      </div>
    ));

    return (
      <div
        className='form-control'
        style={{
          display: 'flex',
          justifyContent: 'center',
          padding: 0,
        }}
      >
        <div id='DatePicker'>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            customInput={<CustomInput />}
          />
        </div>
      </div>
    );
  };

  return (
    <div>
      <Modal
        show={show}
        size='lg'
        aria-labelledby='contained-modal-title-vcenter'
        centered
        backdrop='static'
        keyboard={false}
        animation={false}
        id='EditProductModal'
      >
        <Modal.Body className='sofia-pro'>
          <Form id='passForm'>
            <Row className='m-row'>
              <Col>
                <Row>
                  <Col xs={2}>
                    <Form.Group>
                      <div className='img-container'>
                        {!file && (
                          <img
                            src={imageUrl || ProductPlaceholder}
                            onError={(e) => {
                              e.currentTarget.src = ProductPlaceholder;
                            }}
                            style={{
                              width: '64px',
                              height: '64px',
                            }}
                          />
                        )}
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

                  <Col xs={4}>
                    <Form.Group>
                      <Form.Label>Merchant</Form.Label>
                      <div className='merchant-container'>
                        <div className='merchant-form-control'>
                          <Form.Control
                            name='vendorTag'
                            value={vendorTag || ''}
                            disabled
                          />
                        </div>
                      </div>
                    </Form.Group>
                  </Col>

                  <Col xs={4}>
                    <Form.Group>
                      <Form.Label>Order Date</Form.Label>
                      {renderDatePicker()}
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>Order Ref. #</Form.Label>
                      <div>
                        <Form.Control
                          name='orderRef'
                          onChange={handleChange}
                          value={orderRef || ''}
                        />
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>Product Name</Form.Label>
                      <div>
                        <Form.Control
                          name='name'
                          onChange={handleChange}
                          value={name}
                        />
                      </div>
                      {name.length > 0 && renderInlineError(errors.name)}
                    </Form.Group>
                  </Col>

                  <Col>
                    <Form.Group>
                      <Form.Label>Price</Form.Label>
                      <div>
                        <Form.Control
                          name='price'
                          onChange={handleChange}
                          value={price}
                          onBlur={(e) =>
                            setFieldValue(
                              'price',
                              formatCurrency(e.target.value)
                            )
                          }
                        />
                      </div>
                      {price.length > 0 && renderInlineError(errors.price)}
                    </Form.Group>
                  </Col>
                </Row>

                {/* <Row>
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
                          Drag & drop or click to upload{' '}
                        </p>
                      </div>
                    </Form.Group>
                    {acceptedFileItems}
                  </Col>
                </Row> */}
              </Col>
            </Row>

            <Row>
              <Col className='btn btn-container'>
                <Button className='btn-cancel' onClick={onHide}>
                  Cancel
                </Button>
                <Button className='btn-save' onClick={handleSubmit}>
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
