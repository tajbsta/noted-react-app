import React, { useState, useCallback, useEffect, Fragment } from 'react';
import { Modal, Button, Form, Row, Col, Spinner } from 'react-bootstrap';
import Select from 'react-select';
import ProductPlaceholder from '../assets/img/ProductPlaceholder.svg';
import { useDropzone } from 'react-dropzone';
import {
  addProductStandardSchema,
  addProductDonationSchema,
} from '../models/formSchema';
import { useFormik } from 'formik';
import { getFileTypeIcon } from '../utils/file';
import { formatCurrency } from '../library/number';
import DatePicker from 'react-datepicker';
import 'react-datepicker/src/stylesheets/datepicker.scss';
import { getDonationOrgs, getVendors, uploadProduct } from '../api/productsApi';
import { get, isEmpty } from 'lodash';
import {
  ADD_PRODUCT_OPTIONS,
  DONATION,
  STANDARD,
} from '../constants/addProducts';
import { showError, showSuccess } from '../library/notifications.library';
import { AlertCircle, CheckCircle } from 'react-feather';
import { toTitleCase } from '../utils/data';

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

export default function AddProductModal(props) {
  const [type, setType] = useState(STANDARD);
  const [productImage, setProductImage] = useState('');
  const handleOnSelectType = (change) => {
    setType(change.value);
    setProductImage('');
  };

  const handleClose = () => {
    setType(STANDARD);
    setProductImage('');
    props.onHide();
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
          <Row>
            <Col xs={2}>
              <Form.Group className='productImg-form-group'>
                <div className='img-container'>
                  <img
                    src={productImage || ProductPlaceholder}
                    className={'product-placeholder'}
                  />
                </div>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Type</Form.Label>
                <div>
                  <Select
                    className='merchant-dropdown-menu'
                    defaultValue={ADD_PRODUCT_OPTIONS[0]}
                    isLoading={false}
                    isClearable={false}
                    isSearchable={false}
                    name='merchant'
                    styles={colourStyles}
                    options={ADD_PRODUCT_OPTIONS}
                    onChange={handleOnSelectType}
                  ></Select>
                </div>
                {/* {renderInlineError(errors.vendorTag)} */}
              </Form.Group>
            </Col>
          </Row>
          <AddProductStandard
            handleClose={handleClose}
            updatePlaceholderImage={(val) => setProductImage(val)}
            show={type === STANDARD}
          />
          <AddProductDonation
            handleClose={handleClose}
            show={type === DONATION}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
}

const AddProductStandard = ({ handleClose, updatePlaceholderImage, show }) => {
  const [allFiles, setAllFiles] = useState([]);
  const [isFetchingVendors, setIsFetchingVendors] = useState(false);
  const [selectedMerchant, setSelectedMerchant] = useState({});
  const [allMerchants, setAllMerchants] = useState([]);
  const [selectOptions, setSelectOptions] = useState([
    { label: 'Select or Type a vendor', value: '' },
    { label: 'Others', value: 'OTHERS' },
  ]);
  const [isSubmittingProducts, setIsSubmittingProducts] = useState(false);
  const {
    errors,
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
      returnDocuments: [],
      itemNotes: '',
    },
    validationSchema: addProductStandardSchema,
  });

  const handleOnSelectMerchant = (data, action) => {
    if (action.action === 'clear' || isEmpty(data.value)) {
      setSelectedMerchant({});
      setFieldValue('vendorTag', '');
      return;
    }
    if (data.value === 'OTHERS') {
      setSelectedMerchant({});
      setFieldValue('vendorTag', 'OTHERS');
      return;
    }
    setSelectedMerchant(
      allMerchants.find((merchant) => merchant.name === data.label)
    );
    setFieldValue(
      'vendorTag',
      allMerchants.find((merchant) => merchant.name === data.label).code
    ); // SET MERCHANT VALUE
    updatePlaceholderImage(
      get(
        allMerchants.find((merchant) => merchant.name === data.label),
        'thumbnail',
        ''
      )
    );
  };

  const handleChangeOrderRef = (e) => {
    setFieldValue('orderRef', e.target.value, true);
  };
  const handleChangeProductName = (e) => {
    setFieldValue('itemName', e.target.value, true);
  };
  const handleChangeProductNotes = (e) => {
    setFieldValue('itemNotes', e.target.value, true);
  };
  const handleChangeProductPrice = (e) => {
    setFieldValue('amount', e.target.value, true);
  };

  const handleCancelModal = () => {
    setSelectedMerchant({});
    setAllFiles([]);
    setSelectOptions([
      { label: 'Select or Type a vendor', value: '' },
      { label: 'Others', value: 'OTHERS' },
    ]);
    setFieldValue('orderDate', '');
    setFieldValue('orderRef', '');
    setFieldValue('itemName', '');
    setFieldValue('itemNotes', '');
    setFieldValue('amount', '');
    setFieldValue('vendorTag', '');
    setFieldValue('returnDocuments', []);
    handleClose();
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    const errors = await handleProductValidation();

    if (!isEmpty(errors)) return;

    try {
      setIsSubmittingProducts(true);
      const res = await uploadProduct({
        type: STANDARD,
        merchant: productValues.vendorTag,
        orderRef: productValues.orderRef,
        orderDate: productValues.orderDate,
        name: toTitleCase(productValues.itemName),
        price: parseFloat(productValues.amount),
        files: productValues.returnDocuments,
        notes: productValues.itemNotes,
      });
      if (res.status === 'success') {
        showSuccess({
          message: (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <CheckCircle />
              <h4 className='ml-3 mb-0' style={{ lineHeight: '19px' }}>
                Success! Your product has been submitted successfully.
              </h4>
            </div>
          ),
        });
        setIsSubmittingProducts(false);
        handleCancelModal();
      }
    } catch (e) {
      setIsSubmittingProducts(false);
      let message = '';
      switch (e.response.data.details) {
        case 'PRODUCT_ALREADY_EXIST':
          message =
            'Error! Looks like this product has already been submitted for review';
          break;
        default:
          message = 'Error submitting product. Please try again.';
      }
      showError({
        message: (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <AlertCircle />
            <h4 className='ml-3 mb-0' style={{ lineHeight: '16px' }}>
              {message}
            </h4>
          </div>
        ),
      });
    }
  };

  const renderInlineError = (errors) => (
    <small className='form-text p-0 m-0 noted-red'>{errors}</small>
  );

  const onRemoveImage = (file) => {
    const updatedFiles = allFiles.filter((item) => {
      return !(
        item.path === file.path &&
        item.name === file.name &&
        item.size === file.size
      );
    });
    setAllFiles(updatedFiles);
    setFieldValue('returnDocuments', updatedFiles);
  };

  const onDrop = useCallback(
    (acceptedFiles) => {
      const filesToAdd = acceptedFiles.filter((file) => {
        const fileExists = allFiles.find(
          (item) => item.path === file.path && item.name === file.name
        );
        if (fileExists === undefined) {
          return true;
        }
        return false;
      });
      const allSelectedFiles = [...filesToAdd, ...allFiles];
      setAllFiles(allSelectedFiles);
      setFieldValue('returnDocuments', allSelectedFiles);
    },
    [allFiles]
  );
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/jpeg, image/png',
  });

  const acceptedFileItems = allFiles.map((file) => {
    return (
      <li
        key={file.path}
        className='list-item'
        style={{
          listStyle: 'none',
          display: 'flex',
          alignItems: 'center',
        }}
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
        <span
          className='ml-3 sofia-pro noted-purple'
          style={{ fontSize: '24px', cursor: 'pointer' }}
          onClick={() => onRemoveImage(file)}
        >
          &times;
        </span>
      </li>
    );
  });

  const renderDatePicker = () => {
    return (
      <div className='form-control' style={{ alignItems: 'center' }}>
        <div id='DatePicker'>
          <DatePicker
            selected={productValues.orderDate}
            onChange={(date) => setFieldValue('orderDate', date.valueOf())}
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
        { label: 'Others', value: 'OTHERS' },
      ]);
    } catch (e) {
      setIsFetchingVendors(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  useEffect(() => {
    if (!show) {
      setSelectedMerchant({});
      setAllFiles([]);
      setFieldValue('orderDate', '');
      setFieldValue('orderRef', '');
      setFieldValue('itemName', '');
      setFieldValue('itemNotes', '');
      setFieldValue('amount', '');
      setFieldValue('vendorTag', '');
      setFieldValue('returnDocuments', []);
    }
  }, [show]);

  return (
    <Fragment>
      {show && (
        <Form id='passForm' onSubmit={handleSubmitProduct}>
          <Row className='m-row'>
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
                        style={{ maxWidth: 'none' }}
                        type='name'
                        isValid={
                          !errors.itemName && productValues.itemName.length > 0
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
                        style={{ maxWidth: 'none' }}
                        isValid={
                          !errors.amount && productValues.amount.length > 0
                        }
                        isInvalid={errors.amount}
                        name='amount'
                        value={productValues.amount}
                        onChange={handleChangeProductPrice}
                        onBlur={(e) => {
                          if (e.target.value) {
                            setFieldValue(
                              'amount',
                              formatCurrency(e.target.value)
                            );
                          }
                        }}
                        required
                      />
                      {productValues.amount.length > 0 &&
                        renderInlineError(errors.amount)}
                    </div>
                  </Form.Group>
                </Col>
              </Row>
              {productValues.vendorTag === 'OTHERS' && (
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>Additional Notes</Form.Label>
                      <div>
                        <Form.Control
                          as='textarea'
                          style={{ maxWidth: 'none' }}
                          rows='3'
                          isValid={
                            !errors.itemNotes &&
                            productValues.itemNotes.length > 0
                          }
                          isInvalid={errors.itemNotes}
                          name='itemNotes'
                          value={productValues.itemNotes || ''}
                          onChange={handleChangeProductNotes}
                        />
                        {productValues.itemNotes.length > 0 &&
                          renderInlineError(errors.itemNotes)}
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
              )}
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label className='documents-title'>
                      Return Documents{' '}
                      <small style={{ fontSize: '11px' }}>
                        (i.e Shipping or order receipts)
                      </small>
                    </Form.Label>
                    <div
                      style={{ maxWidth: 'none' }}
                      className='dropzone-container'
                      {...getRootProps()}
                    >
                      <input {...getInputProps()} />
                      <p className='sofia-pro text-drag'>
                        Drag & drop or click to upload
                      </p>
                    </div>
                    {renderInlineError(errors.returnDocuments)}
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
              <Button
                disabled={isSubmittingProducts}
                className='btn-save'
                type='submit'
              >
                {isSubmittingProducts ? 'Submitting' : 'Submit Product'}
                {isSubmittingProducts && (
                  <Spinner
                    animation='border'
                    size='sm'
                    style={{
                      color: '#fff',
                      opacity: '1',
                      marginLeft: '8px',
                    }}
                    className='spinner'
                  />
                )}
              </Button>
            </Col>
          </Row>
        </Form>
      )}
    </Fragment>
  );
};

const AddProductDonation = ({ handleClose, show }) => {
  const [allDonationOrgs, setAllDonationOrgs] = useState([]);
  const [selectOptions, setSelectOptions] = useState([
    { label: 'Select or Type a vendor', value: '' },
  ]);
  const [allFiles, setAllFiles] = useState([]);
  const [isFetchingDonationOrgs, setIsFetchingDonationOrgs] = useState(false);
  const [formUrl, setFormUrl] = useState('');
  const [isSubmittingProducts, setIsSubmittingProducts] = useState(false);

  const {
    errors,
    values: productValues,
    setFieldValue,
    validateForm: handleProductValidation,
  } = useFormik({
    initialValues: {
      itemName: '',
      organisation: '',
      amount: '',
      itemImages: [],
    },
    validationSchema: addProductDonationSchema,
    enableReinitialize: true,
  });

  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    const errors = await handleProductValidation();

    if (!isEmpty(errors)) return;

    try {
      setIsSubmittingProducts(true);
      const res = await uploadProduct({
        type: DONATION,
        merchant: productValues.organisation,
        name: toTitleCase(productValues.itemName),
        price: parseFloat(productValues.amount),
        files: productValues.itemImages,
      });
      if (res.status === 'success') {
        showSuccess({
          message: (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <CheckCircle />
              <h4 className='ml-3 mb-0' style={{ lineHeight: '19px' }}>
                Success! Your product has been submitted successfully.
              </h4>
            </div>
          ),
        });
        setIsSubmittingProducts(false);
        handleCancelModal();
      }
    } catch (e) {
      setIsSubmittingProducts(false);
      let message = '';
      switch (e.response.data.details) {
        case 'PRODUCT_ALREADY_EXIST':
          message =
            'Error! Looks like this product has already been submitted for review';
          break;
        default:
          message = 'Error submitting product. Please try again.';
      }
      showError({
        message: (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <AlertCircle />
            <h4 className='ml-3 mb-0' style={{ lineHeight: '16px' }}>
              {message}
            </h4>
          </div>
        ),
      });
    }
  };

  const handleChangeProductName = (e) => {
    setFieldValue('itemName', e.target.value, true);
  };
  const handleChangeProductPrice = (e) => {
    setFieldValue('amount', e.target.value, true);
  };

  const renderInlineError = (errors) => (
    <small className='form-text p-0 m-0 noted-red'>{errors}</small>
  );

  const handleOnSelectDonationOrg = (change) => {
    const organisation =
      allDonationOrgs.find(
        (donationOrg) => donationOrg.code === change.value
      ) || '';
    if (organisation) {
      setFormUrl(`${process.env.REACT_APP_ASSETS_URL}/${organisation.formKey}`);
    }
    setFieldValue('organisation', change.value);
  };

  const handleCancelModal = () => {
    setAllDonationOrgs([]);
    setSelectOptions([{ label: 'Select or Type a vendor', value: '' }]);
    setIsFetchingDonationOrgs(false);
    setFormUrl('');
    setAllFiles([]);
    setFieldValue('itemName', '');
    setFieldValue('amount', '');
    setFieldValue('organisation', '');
    setFieldValue('itemImages', []);
    handleClose();
  };

  const onRemoveImage = (file) => {
    const updatedFiles = allFiles.filter((item) => {
      return !(
        item.path === file.path &&
        item.name === file.name &&
        item.size === file.size
      );
    });
    setAllFiles(updatedFiles);
    setFieldValue('itemImages', updatedFiles);
  };

  const onDrop = useCallback(
    (acceptedFiles) => {
      const filesToAdd = acceptedFiles.filter((file) => {
        const fileExists = allFiles.find(
          (item) => item.path === file.path && item.name === file.name
        );
        if (fileExists === undefined) {
          return true;
        }
        return false;
      });
      const allSelectedFiles = [...filesToAdd, ...allFiles];
      setAllFiles(allSelectedFiles);
      setFieldValue('itemImages', allSelectedFiles);
    },
    [allFiles]
  );
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/jpeg, image/png',
  });

  const acceptedFileItems = allFiles.map((file) => {
    return (
      <li
        key={file.path}
        className='list-item'
        style={{
          listStyle: 'none',
          display: 'flex',
          alignItems: 'center',
        }}
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
        <span
          className='ml-3 sofia-pro noted-purple'
          style={{ fontSize: '24px', cursor: 'pointer' }}
          onClick={() => onRemoveImage(file)}
        >
          &times;
        </span>
      </li>
    );
  });

  const fetchDonationOrgs = async () => {
    try {
      setIsFetchingDonationOrgs(true);
      const donationOrgs = await getDonationOrgs();
      // setFieldValue('organisation', donationOrgs[0].code);
      const newSelectOptions = donationOrgs.map((donationOrg) => ({
        value: donationOrg.code,
        label: donationOrg.name,
      }));
      setIsFetchingDonationOrgs(false);
      setAllDonationOrgs(donationOrgs);
      setSelectOptions([
        { label: 'Select or Type a vendor', value: '' },
        ...newSelectOptions,
      ]);
    } catch (e) {
      setIsFetchingDonationOrgs(false);
    }
  };

  useEffect(() => {
    fetchDonationOrgs();
  }, []);

  useEffect(() => {
    if (!show) {
      setIsFetchingDonationOrgs(false);
      setFormUrl('');
      setAllFiles([]);
      setFieldValue('itemName', '');
      setFieldValue('amount', '');
      setFieldValue('organisation', '');
      setFieldValue('itemImages', []);
    }
  }, [show]);

  return (
    <Fragment>
      {show && (
        <Form id='passForm' onSubmit={handleSubmitProduct}>
          <Row className='m-row' style={{ marginBottom: '1.5rem' }}>
            <Col>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>Donation Organization</Form.Label>
                    <div>
                      <Select
                        className='merchant-dropdown-menu'
                        defaultValue={selectOptions[0]}
                        isLoading={isFetchingDonationOrgs}
                        isClearable={false}
                        isSearchable={false}
                        name='merchant'
                        styles={colourStyles}
                        options={selectOptions}
                        onChange={handleOnSelectDonationOrg}
                      ></Select>
                      {errors.organisation &&
                        renderInlineError(errors.organisation)}
                    </div>
                    {renderInlineError(errors.vendorTag)}
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>Donation Item</Form.Label>
                    <div>
                      <Form.Control
                        style={{ maxWidth: 'none' }}
                        type='name'
                        isValid={
                          !errors.itemName && productValues.itemName.length > 0
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
                        style={{ maxWidth: 'none' }}
                        isValid={
                          !errors.amount && productValues.amount.length > 0
                        }
                        isInvalid={errors.amount}
                        name='amount'
                        value={productValues.amount}
                        onChange={handleChangeProductPrice}
                        onBlur={(e) => {
                          if (e.target.value) {
                            setFieldValue(
                              'amount',
                              formatCurrency(e.target.value)
                            );
                          }
                        }}
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
                      Item Image{' '}
                      <small style={{ fontSize: '11px' }}>
                        (i.e Upload an image of your donation items)
                      </small>
                    </Form.Label>
                    <div
                      style={{ maxWidth: 'none' }}
                      className='dropzone-container'
                      {...getRootProps()}
                    >
                      <input {...getInputProps()} />
                      <p className='sofia-pro text-drag'>
                        Drag & drop or click to upload
                      </p>
                    </div>
                    {renderInlineError(errors.itemImages)}
                    {acceptedFileItems}
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  {formUrl && (
                    <small
                      style={{
                        fontSize: '14px',
                        lineHeight: '16px',
                        color: '#2e1d3a',
                        mixBlendMode: 'normal',
                        opacity: '0.6',
                      }}
                    >
                      Please note that you will need to download the charity’s
                      form and follow the instructions for tax deduction
                      purposes. Download the form{' '}
                      <a
                        download
                        target='_blank'
                        href={formUrl}
                        rel='noreferrer'
                      >
                        here.
                      </a>
                    </small>
                  )}
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col className='btn btn-container'>
              <Button className='btn-cancel' onClick={handleCancelModal}>
                Cancel
              </Button>
              <Button
                className='btn-save'
                type='submit'
                disabled={isSubmittingProducts}
              >
                {isSubmittingProducts ? 'Submitting' : 'Submit Product'}
                {isSubmittingProducts && (
                  <Spinner
                    animation='border'
                    size='sm'
                    style={{
                      color: '#fff',
                      opacity: '1',
                      marginLeft: '8px',
                    }}
                    className='spinner'
                  />
                )}
              </Button>
            </Col>
          </Row>
        </Form>
      )}
    </Fragment>
  );
};
