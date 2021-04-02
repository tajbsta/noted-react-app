import React, { useState } from 'react';
import ReturnPolicyModal from './ReturnPolicyModal';
import EditProductModal from '../modals/EditProductModal';
import moment from 'moment';
export default function ProductCardHover({ orderDate = '2222-4-23' }) {
  const [modalPolicyShow, setModalPolicyShow] = useState(false);
  const [modalEditShow, setModalEditShow] = useState(false);

  return (
    <div>
      <div id='OnHoverProductCard'>
        <div className='container-1'>
          <h4 className='date text-14 sofia-pro line-height-16'>
            {moment(orderDate, 'YYYY-MM-DD').format('MMMM DD YYYY')}
          </h4>
          <div className='info-container'>
            <p className='text-wrong-info sofia-pro'>Wrong info?&nbsp;</p>
            <button
              className='btn-hover-edit sofia-pro btn'
              onClick={() => setModalEditShow(true)}
            >
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
        onHide={() => setModalEditShow(false)}
      />
      <ReturnPolicyModal
        show={modalPolicyShow}
        onHide={() => setModalPolicyShow(false)}
      />
    </div>
  );
}
