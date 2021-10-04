import { useFormik } from 'formik';
import { get, isEmpty } from 'lodash-es';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDonationOrgs } from '../../../api/productsApi';
import ProductCard from '../../../components/Product/ProductCard';
import Select from 'react-select';
import { selectDonationOrgSchema } from '../../../models/formSchema';

const colourStyles = {
  control: (styles, state) => ({
    ...styles,
    backgroundColor: 'white',
    outline: 'none',
    boxShadow: 'none',
    border: state.isFocused ? '1px solid #ece4f2' : '1px solid #ece4f2',
    maxWidth: '180px',
  }),
  option: (styles, state) => ({
    ...styles,
    backgroundColor: state.isSelected ? '#57009799' : 'white',
  }),
};

const ViewOrderDonateSection = (props) => {
  const {
    items,
    order,
    onCartRemove,
    confirmed = true,
    handleSelectDonationOrg,
  } = props;
  const [isFetchingDonationOrgs, setIsFetchingDonationOrgs] = useState(false);
  const [selectOptions, setSelectOptions] = useState([
    { label: 'Select a Charity', value: '' },
  ]);
  const [allDonationOrgs, setAllDonationOrgs] = useState([]);

  const donationFormik = useFormik({
    initialValues: {
      donationOrg: '',
    },
    validationSchema: selectDonationOrgSchema,
  });

  const renderInlineError = (errors) => (
    <small className='form-text p-0 m-0 noted-red'>{errors}</small>
  );

  const fetchDonationOrgs = async () => {
    try {
      setIsFetchingDonationOrgs(true);
      const response = await getDonationOrgs();
      const newSelectOptions = response.map((donationOrg) => ({
        value: donationOrg.code,
        label: donationOrg.name,
      }));
      setIsFetchingDonationOrgs(false);
      setAllDonationOrgs(response);
      setSelectOptions([
        { label: 'Select a Charity', value: '' },
        ...newSelectOptions,
      ]);
    } catch (e) {
      setIsFetchingDonationOrgs(false);
    }
  };

  const handleOnSelectDonationOrg = (change) => {
    donationFormik.setFieldValue('donationOrg', change.value);
    const org = allDonationOrgs.find((item) => item.code === change.value);
    handleSelectDonationOrg(org);
  };

  useEffect(() => {
    fetchDonationOrgs();
  }, []);

  useEffect(() => {
    //GET DONATION ORGANIZATION
    const donationOrgCode = get(order, 'donationOrg.code', '');
    if (donationOrgCode) {
      donationFormik.setFieldValue('donationOrg', donationOrgCode);
    }
  }, [order]);

  return (
    <div className='col desktop-col'>
      <h3 className='sofia-pro products-return text-18 section-title'>
        Your products to donate
      </h3>

      {!isEmpty(items) && (
        <div className='mb-4'>
          {donationFormik.errors.donationOrg &&
            renderInlineError(donationFormik.errors.donationOrg)}
          <Select
            id='donationOrg-dropdown-menu'
            defaultValue={selectOptions[0]}
            isLoading={isFetchingDonationOrgs}
            isClearable={false}
            isSearchable={false}
            name='donationOrg'
            styles={colourStyles}
            options={selectOptions}
            onChange={handleOnSelectDonationOrg}
          ></Select>
        </div>
      )}

      {isEmpty(items) && (
        <h4 className='p-0 mb-0 mt-5 d-flex justify-content-center sofia-pro empty-message'>
          No more products to donate. Click here to go back to &nbsp;
          <Link
            style={{
              textDecoration: 'underline',
              color: '#570097',
            }}
            to='/dashboard'
          >
            dashboard
          </Link>
          .
        </h4>
      )}

      {items.map((item) => (
        <ProductCard
          removable={!confirmed}
          scannedItem={item}
          key={item._id}
          item={item}
          selectable={false}
          clickable={false}
          onRemove={onCartRemove}
          confirmed={confirmed}
        />
      ))}
    </div>
  );
};

export default ViewOrderDonateSection;
