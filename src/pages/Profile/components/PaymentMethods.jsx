import React from 'react';
import { isEmpty } from 'lodash';
import PaymentMethodItem from './PaymentMethodItem';

export default function PaymentMethods({
  addPaymentMethod,
  paymentMethods,
  defaultPaymentMethod,
  setDefault,
  deletePaymentMethod,
}) {
  return (
    <div id='PaymentMethods'>
      <div className='card-header'>
        <h4 className='card-header-title'>Payment Methods</h4>
        <button
          className='row btn align-items-center header btn-md btn-primary btn-add-method p-2'
          onClick={addPaymentMethod}
        >
          <span className=''>Add method</span>
        </button>
      </div>
      <hr />
      {isEmpty(paymentMethods) && (
        <div className='empty-payment-methods'>
          <h5 className='empty-payment-methods-text text-center'>
            No saved payment method here yet. Please add a new one.
          </h5>
        </div>
      )}
      <div className='list-group list-group-flush my-n3'>
        {paymentMethods.map((method) => {
          return (
            <PaymentMethodItem
              key={method.id}
              method={method}
              isDefault={method.id === defaultPaymentMethod}
              setAsDefault={setDefault}
              deleted={deletePaymentMethod}
            />
          );
        })}
      </div>
    </div>
  );
}
