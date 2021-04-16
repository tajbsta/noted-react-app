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
    </div>
  );
}
