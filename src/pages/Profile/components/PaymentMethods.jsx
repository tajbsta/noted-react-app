import React from 'react';
import { get, isEmpty } from 'lodash';
import { useSelector } from 'react-redux';
import PaymentMethodItem from './PaymentMethodItem';
import { nanoid } from 'nanoid';

export default function PaymentMethods({ setIsEditing, setFieldValue }) {
  const { paymentMethods } = useSelector(({ auth: { paymentMethods } }) => ({
    paymentMethods,
  }));

  return (
    <div id='PaymentMethods'>
      <div className='card-header'>
        <div className='row align-items-center header'>
          <h4 className='card-header-title'>Your saved cards</h4>
          <a
            className='btn btn-sm btn-primary btn-add-method'
            onClick={() => setIsEditing(true)}
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
          const cardNumber = get(method, 'cardNumber', '');
          const expirationMonth = get(method, 'expirationMonth', '');
          const expirationYear = get(method, 'expirationYear', '');
          const fullName = get(method, 'fullName', '');
          const cvc = get(method, 'cvc', '');
          const id = get(method, 'id', '');
          return (
            <PaymentMethodItem
              id={id}
              key={nanoid()}
              fullName={fullName}
              cardNumber={cardNumber}
              expirationMonth={expirationMonth}
              expirationYear={expirationYear}
              type='Visa'
              setFieldValue={setFieldValue}
              setIsEditing={setIsEditing}
              cvc={cvc}
            />
          );
        })}
      </div>
    </div>
  );
}
