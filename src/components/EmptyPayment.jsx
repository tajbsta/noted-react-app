import React from 'react';

export default function EmptyPayment(props) {
  return (
    <div>
      <div
        id='EmptyState'
        className='card-body payment-details-card-body pb-3 pl-4 m-0'
      >
        <div className='d-flex justify-content-center'>
          <div className='p-0'>
            <p className='empty-header sofia-pro text-14 line-height-16 margin-bottom'>
              Payment Method
            </p>
          </div>
        </div>
        <div>
          <h4 className='p-0 m-0 sofia-pro text-center empty-sub'>
            Adding a payment method is necessary to proceed
          </h4>
        </div>
        <div className='d-flex justify-content-center'>
          <button className='btn btn-add-empty text-16' onClick={props.onClick}>
            Add Payment Method
          </button>
        </div>
      </div>
    </div>
  );
}
