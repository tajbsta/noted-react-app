import React, { useState, useEffect } from 'react';
import ReturnPolicyModal from '../modals/ReturnPolicyModal';
import EditProductModal from '../modals/EditProductModal';
import moment from 'moment';
import { get } from 'lodash';
import {
  mountProductInEdit,
  unmountProductedit,
} from '../actions/runtime.action';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import { addProductSchema } from '../models/formSchema';
import { RETURN_SCORES } from '../constants/returns/scores';
import ReturnScore from './ReturnsScore';
import { useHistory } from 'react-router';
export default function ProductCardHover({ orderDate, show, item }) {
  const dispatch = useDispatch();
  const {
    location: { pathname },
  } = useHistory();
  const [modalPolicyShow, setModalPolicyShow] = useState(false);
  const [modalEditShow, setModalEditShow] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentScore, setCurrentScore] = useState(null);

  useEffect(() => {
    const vendorRating = get(item, 'vendor_data.rating', 0);
    const score = RETURN_SCORES.find(({ rating }) => vendorRating === rating);
    setCurrentScore(score);
  }, []);
  // Check if device is mobile
  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 991);
    }
    handleResize(); // Run on load to set the default value
    window.addEventListener('resize', handleResize);
    // Clean up event listener
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  const { handleChange, values, setFieldValue, errors } = useFormik({
    initialValues: {
      amount: get(item, 'price', ''),
      vendorTag: get(item, 'vendor', ''),
      orderDate: get(item, 'order_date', ''),
      itemName: get(item, 'name', ''),
      productUrl: '',
      imageUrl: get(item, 'thumbnail', ''),
    },
    validationSchema: addProductSchema,
  });

  const onEdit = async () => {
    /**
     * MOUNT PRODUCT FIRST
     */
    dispatch(unmountProductedit());
    dispatch(mountProductInEdit(item));
    setModalEditShow(true);
  };

  const inDashboard = ['/dashboard'].includes(pathname);

  return (
    <div>
      {!isMobile && (
        <div
          id='OnHoverProductCard'
          style={{
            display: show ? 'block' : 'none',
          }}
        >
          {inDashboard && (
            <div className='container-1'>
              <h4 className='date text-14 sofia-pro line-height-16'>
                {moment(item.order_date).format('MMM DD, YYYY')}
              </h4>
              <div className='info-container'>
                <p className='text-wrong-info sofia-pro'>Wrong info?&nbsp;</p>
                <button
                  className='btn-hover-edit sofia-pro btn'
                  onClick={onEdit}
                >
                  {' '}
                  Edit
                </button>
              </div>
            </div>
          )}
          <div className='container-3 text-left'>
            <div className='d-flex'>
              <span className='score-container mr-2 d-flex'>
                <ReturnScore score={item.vendor_data.rating} />
              </span>
              <p className='text-14 sofia-pro line-height-16 text-score'>
                {get(currentScore, 'title', '')}
              </p>
            </div>
            <button
              className='btn-policy sofia-pro btn ml-4'
              onClick={() => setModalPolicyShow(true)}
            >
              Return policy
            </button>
          </div>
        </div>
      )}

      <EditProductModal
        show={modalEditShow}
        onHide={() => {
          setModalEditShow(false);
        }}
        editproductform={{ handleChange, values, setFieldValue, errors }}
      />
      <ReturnPolicyModal
        show={modalPolicyShow}
        onHide={() => {
          setModalPolicyShow(false);
        }}
      />
    </div>
  );
}
