import React, { useEffect, useState } from 'react';
import { get } from 'lodash';
import { useSelector } from 'react-redux';
import PaymentMethodItem from './PaymentMethodItem';
import { nanoid } from 'nanoid';

export default function PaymentMethods({ setIsEditing }) {
  const { paymentMethods } = useSelector(({ auth: { paymentMethods } }) => ({
    paymentMethods,
  }));

  return (
    <>
      <a
        className='btn btn-sm btn-primary btn-add-method'
        onClick={() => setIsEditing(true)}
      >
        Add method
      </a>
      <hr />
      <div className='list-group list-group-flush my-n3'>
        {/**
         * @ELEMENT payment methods here
         */}
        {[...paymentMethods].map((method) => {
          const cardNumber = get(method, 'cardNumber', '');
          const expirationMonth = get(method, 'expirationMonth', '');
          const expirationYear = get(method, 'expirationYear', '');

          return (
            <PaymentMethodItem
              key={nanoid()}
              cardNumber={cardNumber}
              expirationMonth={expirationMonth}
              expirationYear={expirationYear}
              type='Visa'
            />
          );
        })}
      </div>
    </>
  );
}
