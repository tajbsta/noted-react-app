import React from 'react';
import { isEmpty } from 'lodash';
import PaymentMethodItem from './PaymentMethodItem';

export default function PaymentMethods({
  addPaymentMethod,
  paymentMethods,
  defaultPaymentMethod,
  setDefault,
}) {
  return (
    <div id='PaymentMethods'>
      <div className='card-header'>
        <div className='row align-items-center header'>
          <h4 className='card-header-title'>Your saved cards</h4>
          <a
            className='btn btn-sm btn-primary btn-add-method'
            onClick={addPaymentMethod}
          >
            Add method
          </a>
        </div>
      </div>
      {/* <hr /> */}
      {isEmpty(paymentMethods) && (
        <div className='empty-payment-methods'>
          <h5 className='empty-payment-methods-text text-14 text-center'>
            No saved payment method here yet. Please add a new one.
          </h5>
        </div>
      )}
      <div className='list-group list-group-flush my-n3'>
        {/**
         * @ELEMENT payment methods here
         */}
        {[...paymentMethods].map((method) => {
          return (
            <PaymentMethodItem
              key={method.id}
              method={method}
              isDefault={method.id === defaultPaymentMethod}
              setAsDefault={setDefault}
            />
          );
        })}
      </div>
    </div>
  );
}
