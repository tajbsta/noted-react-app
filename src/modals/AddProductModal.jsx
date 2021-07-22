import React, { useState, useCallback, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import Select from 'react-select';
import ProductPlaceholder from '../assets/img/ProductPlaceholder.svg';
import { useDropzone } from 'react-dropzone';
import {
    addProductStandardSchema,
    addProductDonationSchema,
    addProductMiscSchema,
} from '../models/formSchema';
import { useFormik } from 'formik';
import { getFileTypeIcon } from '../utils/file';
import { formatCurrency } from '../library/number';
import DatePicker from 'react-datepicker';
import 'react-datepicker/src/stylesheets/datepicker.scss';
import { getDonationOrgs, getVendors } from '../api/productsApi';
import { get, isEmpty } from 'lodash';
import {
    ADD_PRODUCT_OPTIONS,
    DONATION,
    STANDARD,
    MISCELLANEOUS,
} from '../constants/addProducts';

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
                    {type === STANDARD && (
                        <AddProductStandard
                            handleClose={handleClose}
                            updatePlaceholderImage={(val) =>
                                setProductImage(val)
                            }
                        />
                    )}
                    {type === DONATION && (
                        <AddProductDonation handleClose={handleClose} />
                    )}
                    {type === MISCELLANEOUS && (
                        <AddProductMisc handleClose={handleClose} />
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
}

const AddProductStandard = ({ handleClose, updatePlaceholderImage }) => {
    const [allFiles, setAllFiles] = useState([]);
    const [isFetchingVendors, setIsFetchingVendors] = useState(false);
    const [selectedMerchant, setSelectedMerchant] = useState({});
    const [allMerchants, setAllMerchants] = useState([]);
    const [selectOptions, setSelectOptions] = useState([
        { label: 'Select or Type a vendor', value: '' },
    ]);
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
            returnDocument: '',
        },
        validationSchema: addProductStandardSchema,
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
    const handleChangeProductPrice = (e) => {
        setFieldValue('amount', e.target.value, true);
    };

    const handleSubmitProduct = async (e) => {
        e.preventDefault();
        const errors = await handleProductValidation();

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
        handleClose();
    };

    const renderInlineError = (errors) => (
        <small className='form-text p-0 m-0 noted-red'>{errors}</small>
    );

    const onDrop = useCallback((acceptedFiles) => {
        setAllFiles(acceptedFiles);
        acceptedFiles.forEach((file) => {
            const reader = new FileReader();
            reader.onabort = () => {};
            reader.onerror = () => {};
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
            </li>
        );
    });

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
        }
    };

    useEffect(() => {
        fetchVendors();
    }, []);

    return (
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
                                        style={{ maxWidth: 'none' }}
                                        isValid={
                                            !errors.amount &&
                                            productValues.amount.length > 0
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
    );
};

const AddProductDonation = ({ handleClose }) => {
    const [allDonationOrgs, setAllDonationOrgs] = useState([]);
    const [selectOptions, setSelectOptions] = useState({});
    const [allFiles, setAllFiles] = useState([]);
    const [isFetchingDonationOrgs, setIsFetchingDonationOrgs] = useState(false);
    const [formUrl, setFormUrl] = useState('');

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
            itemImage: '',
        },
        validationSchema: addProductDonationSchema,
        enableReinitialize: true,
    });

    const handleSubmitProduct = async (e) => {
        e.preventDefault();
        const errors = await handleProductValidation();

        if (!isEmpty(errors)) return;

        console.log(productValues);
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
            setFormUrl(
                `${process.env.REACT_APP_ASSETS_URL}/${organisation.formKey}`
            );
        }

        setFieldValue('organisation', change.value);
    };

    const handleCancelModal = () => {
        setAllDonationOrgs([]);
        selectOptions({});
        setIsFetchingDonationOrgs(false);
        setFormUrl('');
        setAllFiles([]);
        setFieldValue('itemName', '');
        setFieldValue('amount', '');
        setFieldValue('organisation', '');
        setFieldValue('itemImage', '');
        handleClose();
    };

    const onDrop = useCallback((acceptedFiles) => {
        setAllFiles(acceptedFiles);
        acceptedFiles.forEach((file) => {
            const reader = new FileReader();
            reader.onabort = () => {};
            reader.onerror = () => {};
            reader.onload = () => {
                // Do whatever with the file contents
                const dataUrl = reader.result;
                setFieldValue('itemImage', dataUrl);
            };
            reader.readAsDataURL(file);
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
            setSelectOptions(newSelectOptions);
        } catch (e) {
            setIsFetchingDonationOrgs(false);
        }
    };

    useEffect(() => {
        fetchDonationOrgs();
    }, []);

    return (
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
                                        style={{ maxWidth: 'none' }}
                                        isValid={
                                            !errors.amount &&
                                            productValues.amount.length > 0
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
                                    Item Image{' '}
                                    <small style={{ fontSize: '11px' }}>
                                        (i.e Upload an image of your donation
                                        items)
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
                                {fileRejectionMessage}
                                {renderInlineError(errors.itemImage)}
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
                                    Please note that you will need to download
                                    the charity’s form and follow the
                                    instructions for tax deduction purposes.
                                    Download the form{' '}
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
                    <Button className='btn-save' type='submit'>
                        Submit Product
                    </Button>
                </Col>
            </Row>
        </Form>
    );
};

const AddProductMisc = ({ handleClose }) => {
    const [allFiles, setAllFiles] = useState([]);

    const {
        errors,
        values: productValues,
        setFieldValue,
        validateForm: handleProductValidation,
    } = useFormik({
        initialValues: {
            itemName: '',
            pickUpLocation: '',
            dropOffLocation: '',
            amount: '',
            itemImage: '',
        },
        validationSchema: addProductMiscSchema,
    });

    const handleSubmitProduct = async (e) => {
        e.preventDefault();
        const errors = await handleProductValidation();

        if (!isEmpty(errors)) return;

        console.log(productValues);
    };

    const handleChangeProductName = (e) => {
        setFieldValue('itemName', e.target.value, true);
    };
    const handleChangeProductPrice = (e) => {
        setFieldValue('amount', e.target.value, true);
    };
    const handleChangePickUp = (e) => {
        setFieldValue('pickUpLocation', e.target.value, true);
    };
    const handleChangeDropOff = (e) => {
        setFieldValue('dropOffLocation', e.target.value, true);
    };

    const renderInlineError = (errors) => (
        <small className='form-text p-0 m-0 noted-red'>{errors}</small>
    );

    const handleOnSelectDonationOrg = (change) => {
        setFieldValue('organisation', change.value);
    };

    const handleCancelModal = () => {
        setAllFiles([]);
        setFieldValue('itemName', '');
        setFieldValue('amount', '');
        setFieldValue('pickUpLocation', '');
        setFieldValue('dropOffLocation', '');
        setFieldValue('itemImage', '');
        handleClose();
    };

    const onDrop = useCallback((acceptedFiles) => {
        setAllFiles(acceptedFiles);
        acceptedFiles.forEach((file) => {
            const reader = new FileReader();
            reader.onabort = () => {};
            reader.onerror = () => {};
            reader.onload = () => {
                // Do whatever with the file contents
                const dataUrl = reader.result;
                setFieldValue('itemImage', dataUrl);
            };
            reader.readAsDataURL(file);
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
            </li>
        );
    });
    return (
        <Form id='passForm' onSubmit={handleSubmitProduct}>
            <Row className='m-row' style={{ marginBottom: '1.5rem' }}>
                <Col>
                    <Row>
                        <Col>
                            <Form.Group>
                                <Form.Label>Item Description</Form.Label>
                                <div>
                                    <Form.Control
                                        style={{ maxWidth: 'none' }}
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
                                <Form.Label>Pick Up Location</Form.Label>
                                <div>
                                    <Form.Control
                                        style={{ maxWidth: 'none' }}
                                        type='name'
                                        isValid={
                                            !errors.pickUpLocation &&
                                            productValues.pickUpLocation
                                                .length > 0
                                        }
                                        isInvalid={errors.pickUpLocation}
                                        name='itemName'
                                        value={
                                            productValues.pickUpLocation || ''
                                        }
                                        onChange={handleChangePickUp}
                                        required
                                    />
                                    {productValues.pickUpLocation.length > 0 &&
                                        renderInlineError(
                                            errors.pickUpLocation
                                        )}
                                </div>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group>
                                <Form.Label>Drop Off Location</Form.Label>
                                <div>
                                    <Form.Control
                                        style={{ maxWidth: 'none' }}
                                        type='name'
                                        isValid={
                                            !errors.dropOffLocation &&
                                            productValues.dropOffLocation
                                                .length > 0
                                        }
                                        isInvalid={errors.dropOffLocation}
                                        name='itemName'
                                        value={
                                            productValues.dropOffLocation || ''
                                        }
                                        onChange={handleChangeDropOff}
                                        required
                                    />
                                    {productValues.dropOffLocation.length > 0 &&
                                        renderInlineError(
                                            errors.dropOffLocation
                                        )}
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
                                            !errors.amount &&
                                            productValues.amount.length > 0
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
                                    Item Image{' '}
                                    <small style={{ fontSize: '11px' }}>
                                        (i.e Upload an image of your donation
                                        items)
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
                                {fileRejectionMessage}
                                {renderInlineError(errors.itemImage)}
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
    );
};
