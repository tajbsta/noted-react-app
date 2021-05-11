import React, { useState, useCallback, useRef, forwardRef } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import ProductPlaceholder from '../assets/img/ProductPlaceholder.svg';
import { UploadCloud } from 'react-feather';
import { useDropzone } from 'react-dropzone';
import { addProductSchema } from '../models/formSchema';
import { useFormik } from 'formik';
import { getFileTypeIcon } from '../utils/file';
import { useDispatch } from 'react-redux';
import { addProductInReview } from '../actions/products.action';
import { formatCurrency } from '../library/number';
import DatePicker from 'react-datepicker';
import 'react-datepicker/src/stylesheets/datepicker.scss';

export default function AddProductModal(props) {
  const dispatch = useDispatch();
  const [file, setFile] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    errors,
    handleChange: handleProductChange,
    values: productValues,
    setFieldValue,
  } = useFormik({
    initialValues: {
      productUrl: '',
      vendorTag: '',
      orderDate: '',
      orderRef: '',
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
    orderRef,
    itemName,
    amount,
    returnDocument,
  } = productValues;

  const renderInlineError = (errors) => (
    <small className='form-text p-0 m-0 noted-red'>{errors}</small>
  );

  const hiddenFileInput = useRef(null);

  const handleClick = () => {
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
  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    onDrop,
  });

  const acceptedFileItems = acceptedFiles.map((file) => {
    return (
      <li
        key={file.path}
        className='list-item'
        style={{ listStyle: 'none', display: 'flex', alignItems: 'center' }}
      >
        {getFileTypeIcon(file.path)}
        <span className='ml-2'>{file.path}</span>
        {/* <img
          src={URL.createObjectURL(file)}
          alt=''
          style={{
            width: 50,
            height: 50,
          }}
        /> */}
      </li>
    );
  });

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

  const onSave = (e) => {
    e.preventDefault();
    const newProduct = {
      productUrl,
      vendorTag,
      orderDate,
      orderRef,
      itemName,
      amount,
      returnDocument,
      thumbnail: URL.createObjectURL(file),
    };

    dispatch(addProductInReview(newProduct));
    props.onHide();
  };

  const renderDatePicker = () => {
    const [startDate, setStartDate] = useState(null);
    // eslint-disable-next-line react/display-name
    const CustomInput = forwardRef(({ value, onClick }, ref) => (
      <button
        className='btn'
        onClick={(e) => {
          e.preventDefault();
          onClick();
        }}
        ref={ref}
      >
        {value}
      </button>
    ));
    return (
      <div className='form-control' style={{ alignItems: 'center' }}>
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
                      {productUrl.length > 0 &&
                        renderInlineError(errors.productUrl)}
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
                      {vendorTag.length > 0 &&
                        renderInlineError(errors.vendorTag)}
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>Order Date</Form.Label>
                      <div>{renderDatePicker()}</div>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label>Order Ref. #</Form.Label>
                      <div>
                        <Form.Control name='order ref' />
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
                          type='name'
                          isValid={!errors.itemName && itemName.length > 0}
                          isInvalid={errors.itemName}
                          name='itemName'
                          value={itemName || ''}
                          onChange={handleProductChange}
                        />
                        {itemName.length > 0 &&
                          renderInlineError(errors.itemName)}
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
                          isValid={!errors.amount && amount.length > 0}
                          isInvalid={errors.amount}
                          name='amount'
                          value={amount}
                          onChange={handleProductChange}
                          onBlur={(e) =>
                            setFieldValue(
                              'amount',
                              formatCurrency(e.target.value)
                            )
                          }
                        />
                        {amount.length > 0 && renderInlineError(errors.amount)}
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
                      {acceptedFileItems}
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
                <Button className='btn-save' type='submit' onClick={onSave}>
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
