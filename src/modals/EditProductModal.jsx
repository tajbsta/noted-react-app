import React, { useState, useCallback, useEffect, forwardRef } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import ProductPlaceholder from '../assets/img/ProductPlaceholder.svg';
import { UploadCloud } from 'react-feather';
import { useDropzone } from 'react-dropzone';
import Flatpickr from 'react-flatpickr';
import { useDispatch, useSelector } from 'react-redux';
import { get, isEmpty } from 'lodash';
import { updateScans } from '../actions/scans.action';
import { unmountProductedit } from '../actions/runtime.action';
import moment from 'moment';
import { getFileTypeIcon } from '../utils/file';
import { formatCurrency } from '../library/number';
import DatePicker from 'react-datepicker';
import 'react-datepicker/src/stylesheets/datepicker.scss';

export default function EditProductModal(props) {
  const dispatch = useDispatch();
  const [file, setFile] = useState('');
  const { inEdit, scans } = useSelector(({ runtime: { inEdit }, scans }) => ({
    inEdit,
    scans,
  }));
  const [loading, setLoading] = useState(false);

  const returnId = get(inEdit, 'id', '');

  const { handleChange, values, setFieldValue, errors } = props.editproductform;

  const {
    imageUrl,
    productUrl,
    vendorTag,
    orderDate,
    itemName,
    amount,
    vendorLogo,
  } = values;

  const hiddenFileInput = React.useRef(null);

  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  const onSave = (e) => {
    e.preventDefault();
    /**
     * FILTER FOR NOW THEN ADD
     * @PROCESS filter current product first
     *
     */
    const newScan = {
      ...inEdit,
      amount,
      vendorTag,
      orderDate,
      itemName,
      productUrl,
      imageUrl,
    };

    const newScanIndex = [...scans].map((scan) => scan.id).indexOf(returnId);
    scans[newScanIndex] = newScan;
    dispatch(updateScans({ scannedItems: [...scans] }));
    dispatch(unmountProductedit());
    props.onHide();
  };
  /**
   * Please advise, dropzone can function without
   */
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach(async (file) => {
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

  const { getRootProps, getInputProps, acceptedFiles } = useDropzone();

  const acceptedFileItems = acceptedFiles.map((file) => {
    return (
      <li
        key={file.path}
        className='edit-list-item'
        style={{ listStyle: 'none', display: 'flex', alignItems: 'center' }}
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

    setLoading(true);

    // Upload file to server (code goes under)

    setLoading(false);
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
    const [startDate, setStartDate] = useState(new Date());
    // eslint-disable-next-line react/display-name
    const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
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
      <div id='DatePicker'>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          customInput={<ExampleCustomInput />}
        />
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
        id='EditProductModal'
      >
        <Modal.Body className='sofia-pro'>
          <Form id='passForm'>
            <Row className='m-row'>
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
              <Col>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>Product URL</Form.Label>
                      <Form.Control />
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
                            name='vendorTag'
                            onChange={handleChange}
                            value={vendorTag || ''}
                          />
                        </div>
                        <div className='brand-img-container'>
                          <img
                            src={vendorLogo || ProductPlaceholder}
                            onError={(e) => {
                              e.currentTarget.src = ProductPlaceholder;
                            }}
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
                      {renderDatePicker()}
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
                          name='itemName'
                          onChange={handleChange}
                          value={itemName}
                        />
                      </div>
                      {itemName.length > 0 &&
                        renderInlineError(errors.itemName)}
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>Price</Form.Label>
                      <div>
                        <Form.Control
                          name='amount'
                          onChange={handleChange}
                          value={amount}
                          onBlur={(e) =>
                            setFieldValue(
                              'amount',
                              formatCurrency(e.target.value)
                            )
                          }
                        />
                      </div>
                      {amount.length > 0 && renderInlineError(errors.amount)}
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
                          Drag & drop or click to upload{' '}
                        </p>
                      </div>
                    </Form.Group>
                    {acceptedFileItems}
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
