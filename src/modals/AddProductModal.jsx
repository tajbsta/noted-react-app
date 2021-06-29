import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  Fragment,
} from 'react';
import { Modal, Button, Form, Row, Col, Dropdown } from 'react-bootstrap';
import Select from 'react-select';
import ProductPlaceholder from '../assets/img/ProductPlaceholder.svg';
// import { UploadCloud } from 'react-feather';
import { useDropzone } from 'react-dropzone';
import { addProductSchema } from '../models/formSchema';
import { useFormik } from 'formik';
import { getFileTypeIcon } from '../utils/file';
import { useDispatch } from 'react-redux';
import { addProductInReview } from '../actions/products.action';
import { formatCurrency } from '../library/number';
import DatePicker from 'react-datepicker';
import 'react-datepicker/src/stylesheets/datepicker.scss';
import { getVendors } from '../api/productsApi';
import { get, isEmpty } from 'lodash';

export default function AddProductModal(props) {
  const dispatch = useDispatch();
  const [allFiles, setAllFiles] = useState([]);
  const [isFetchingVendors, setIsFetchingVendors] = useState(false);
  const [selectedMerchant, setSelectedMerchant] = useState({});
  const [allMerchants, setAllMerchants] = useState([]);
  const [selectOptions, setSelectOptions] = useState([
    { label: 'Select or Type a vendor', value: '' },
  ]);

  const {
    errors,
    handleChange: handleProductChange,
    values: productValues,
    setFieldValue,
    validateForm: handleProductValidation,
  } = useFormik({
    initialValues: {
      vendorTag: '',
      orderDate: '',
      orderRef: '',
      itemName: '',
      amount: '',
      returnDocument: '',
    },
    validationSchema: addProductSchema,
  });

  const handleOnSelectMerchant = (data, action) => {
    if (action.action === 'clear' || isEmpty(data.value)) {
      setSelectedMerchant({});
      setFieldValue('vendorTag', '');
      return;
    }
    setSelectedMerchant(
      allMerchants.find((merchant) => merchant.name === data.label)
    );
    setFieldValue(
      'vendorTag',
      allMerchants.find((merchant) => merchant.name === data.label).code
    ); // SET MERCHANT VALUE
  };

  const handleChangeOrderRef = (e) => {
    setFieldValue('orderRef', e.target.value, true);
  };
  const handleChangeProductName = (e) => {
    setFieldValue('itemName', e.target.value, true);
  };
  const handleChangeProductPrice = (e) => {
    setFieldValue('amount', e.target.value, true);
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    const errors = await handleProductValidation();
    console.log(errors);
    if (!isEmpty(errors)) return;

    console.log(productValues);
  };

  const handleCancelModal = () => {
    setSelectedMerchant({});
    setAllFiles([]);
    setFieldValue('orderDate', '');
    setFieldValue('orderRef', '');
    setFieldValue('itemName', '');
    setFieldValue('amount', '');
    setFieldValue('vendorTag', '');
    props.onHide();
  };

  const renderInlineError = (errors) => (
    <small className='form-text p-0 m-0 noted-red'>{errors}</small>
  );

  const hiddenFileInput = useRef(null);

  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  const onDrop = useCallback((acceptedFiles) => {
    setAllFiles(acceptedFiles);
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');
      reader.onload = () => {
        // Do whatever with the file contents
        const dataUrl = reader.result;
        setFieldValue('returnDocument', dataUrl);
      };
      reader.readAsDataURL(file);
      // reader.readAsArrayBuffer(file);
    });
  }, []);
  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    onDrop,
    maxFiles: 1,
  });

  const fileRejectionMessage =
    fileRejections.length > 0 ? (
      <p className='sofia-pro' style={{ color: 'red', fontSize: '12px' }}>
        {'Kindly select one file.'}
      </p>
    ) : (
      ''
    );

  const acceptedFileItems = allFiles.map((file) => {
    return (
      <li
        key={file.path}
        className='list-item'
        style={{ listStyle: 'none', display: 'flex', alignItems: 'center' }}
      >
        {getFileTypeIcon(file.path)}
        <span className='ml-2'>{file.path}</span>
        <img
          src={URL.createObjectURL(file)}
          alt=''
          style={{
            width: 60,
            height: 60,
          }}
        />
      </li>
    );
  });

  // Handles file upload event and updates state
  // const handleUpload = (event) => {
  //   // const file = event.target.files[0];
  //   setFile(event.target.files[0]);

  //   if (file && file.size > 5097152) {
  //     alert('File is too large! The maximum size for file upload is 5 MB.');
  //   }

  //   setLoading(true);

  //   // Upload file to server (code goes under)

  //   setLoading(false);
  // };

  // const onSave = (e) => {
  //   e.preventDefault();
  //   const newProduct = {
  //     vendorTag,
  //     orderDate,
  //     orderRef,
  //     itemName,
  //     amount,
  //     returnDocument,
  //     thumbnail: URL.createObjectURL(file),
  //   };

  //   dispatch(addProductInReview(newProduct));
  //   props.onHide();
  // };

  const renderDatePicker = () => {
    return (
      <div className='form-control' style={{ alignItems: 'center' }}>
        <div id='DatePicker'>
          <DatePicker
            selected={productValues.orderDate}
            onChange={(date) => setFieldValue('orderDate', date)}
            className='date-picker'
          />
        </div>
        <p style={{ marginTop: '8px' }}>
          {renderInlineError(errors.orderDate)}
        </p>
      </div>
    );
  };

  const fetchVendors = async () => {
    try {
      setIsFetchingVendors(true);
      const merchants = await getVendors();
      const newSelectOptions = merchants.map((merchant) => ({
        value: merchant.thumbnail,
        label: merchant.name,
      }));
      setIsFetchingVendors(false);
      setAllMerchants(merchants);
      setSelectOptions([
        { label: 'Select or Type a vendor', value: '' },
        ...newSelectOptions,
      ]);
    } catch (e) {
      setIsFetchingVendors(false);
      console.log(e);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const colourStyles = {
    control: (styles, state) => ({
      ...styles,
      backgroundColor: 'white',
      outline: 'none',
      boxShadow: 'none',
      border: state.isFocused ? '1px solid #ece4f2' : '1px solid #ece4f2',
    }),
    option: (styles, state) => ({
      ...styles,
      backgroundColor: state.isSelected ? '#57009799' : 'white',
    }),
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
          <Form id='passForm' onSubmit={handleSubmitProduct}>
            <Row className='m-row'>
              <Col xs={2}>
                <Form.Group className='productImg-form-group'>
                  <div className='img-container'>
                    <img
                      src={get(
                        selectedMerchant,
                        'thumbnail',
                        ProductPlaceholder
                      )}
                      className={'product-placeholder'}
                    />
                  </div>
                </Form.Group>
              </Col>
              <Col>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>Merchant</Form.Label>
                      <div>
                        <Select
                          className='merchant-dropdown-menu'
                          defaultValue={selectOptions[0]}
                          isLoading={isFetchingVendors}
                          isClearable={!isEmpty(selectedMerchant)}
                          isSearchable={true}
                          name='merchant'
                          styles={colourStyles}
                          options={selectOptions}
                          onChange={handleOnSelectMerchant}
                        ></Select>
                      </div>
                      {/* <Dropdown
                        className='merchant-container'
                        onSelect={handleOnSelectMerchant}
                      >
                        <Dropdown.Toggle
                          className='merchant-dropdown-toggle'
                          variant='success'
                          id='dropdown-basic'
                          drop='right'
                        >
                          {get(selectedMerchant, 'name', 'Select Merchant')}
                        </Dropdown.Toggle>

                        <Dropdown.Menu className='merchant-dropdown-menu'>
                          {allMerchants.length > 0 &&
                            allMerchants.map((merchant) => {
                              return (
                                <Dropdown.Item
                                  key={merchant.code}
                                  eventKey={merchant.name}
                                  className='merchant-dropdown-item'
                                  as='button'
                                >
                                  {merchant.name}
                                </Dropdown.Item>
                              );
                            })}
                        </Dropdown.Menu>
                      </Dropdown> */}
                      {renderInlineError(errors.vendorTag)}
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
                        <Form.Control
                          name='order ref'
                          type='text'
                          onChange={handleChangeOrderRef}
                          value={productValues.orderRef}
                          required
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
                          type='name'
                          isValid={
                            !errors.itemName &&
                            productValues.itemName.length > 0
                          }
                          isInvalid={errors.itemName}
                          name='itemName'
                          value={productValues.itemName || ''}
                          onChange={handleChangeProductName}
                          required
                        />
                        {productValues.itemName.length > 0 &&
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
                          isValid={
                            !errors.amount && productValues.amount.length > 0
                          }
                          isInvalid={errors.amount}
                          name='amount'
                          value={productValues.amount}
                          onChange={handleChangeProductPrice}
                          onBlur={(e) =>
                            setFieldValue(
                              'amount',
                              formatCurrency(e.target.value)
                            )
                          }
                          required
                        />
                        {productValues.amount.length > 0 &&
                          renderInlineError(errors.amount)}
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label className='documents-title'>
                        Return Document{' '}
                        <small style={{ fontSize: '11px' }}>
                          (i.e Shipping or order receipts)
                        </small>
                      </Form.Label>
                      <div className='dropzone-container' {...getRootProps()}>
                        <input {...getInputProps()} />
                        <p className='sofia-pro text-drag'>
                          Drag & drop or click to upload
                        </p>
                      </div>
                      {fileRejectionMessage}
                      {renderInlineError(errors.returnDocument)}
                      {acceptedFileItems}
                    </Form.Group>
                  </Col>
                </Row>
              </Col>
            </Row>

            <Row>
              <Col className='btn btn-container'>
                <Button className='btn-cancel' onClick={handleCancelModal}>
                  Cancel
                </Button>
                <Button className='btn-save' type='submit'>
                  Submit Product
                </Button>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
