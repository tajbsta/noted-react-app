import React, { useState } from 'react';
import ReturnPolicyModal from './ReturnPolicyModal';
import EditProductModal from '../modals/EditProductModal';
import moment from 'moment';
import { get } from 'lodash';
import {
  mountProductInEdit,
  unmountProductedit,
} from '../actions/runtime.action';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
export default function ProductCardHover({
  orderDate = '2222-4-23',
  show,
  scannedItem,
}) {
  const dispatch = useDispatch();
  const [modalPolicyShow, setModalPolicyShow] = useState(false);
  const [modalEditShow, setModalEditShow] = useState(false);

  const { handleChange, values, setFieldValue } = useFormik({
    initialValues: {
      amount: get(scannedItem, 'amount', ''),
      vendorTag: get(scannedItem, 'vendorTag', ''),
      orderDate: get(scannedItem, 'orderDate', ''),
      itemName: get(scannedItem, 'itemName', ''),
      productUrl: '',
      imageUrl: get(scannedItem, 'imageUrl', ''),
    },
  });

  const onEdit = async () => {
    /**
     * MOUNT PRODUCT FIRST
     */
    dispatch(unmountProductedit());
    dispatch(mountProductInEdit(scannedItem));
    setModalEditShow(true);
  };

  const onHide = () => {
    dispatch(unmountProductedit());
    setModalEditShow(false);
  };

  return (
    <div>
      <div
        id='OnHoverProductCard'
        style={{
          display: show ? 'block' : 'none',
        }}
      >
        <div className='container-1'>
          <h4 className='date text-14 sofia-pro line-height-16'>
            {moment(orderDate, 'YYYY-MM-DD').format('MMMM DD YYYY')}
          </h4>
          <div className='info-container'>
            <p className='text-wrong-info sofia-pro'>Wrong info?&nbsp;</p>
            <button className='btn-hover-edit sofia-pro btn' onClick={onEdit}>
              {' '}
              Edit
            </button>
          </div>
        </div>
        <div className='container-2 text-left'>
          <p className='text-14 sofia-pro line-height-16 text-score'>
            Excellent Returns
          </p>
          <button
            className='btn-policy sofia-pro btn'
            onClick={() => setModalPolicyShow(true)}
          >
            Return policy
          </button>
        </div>
      </div>

      <EditProductModal
        show={modalEditShow}
        onHide={onHide}
        editProductForm={{ handleChange, values, setFieldValue }}
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
