import React, { useEffect, useState } from 'react';
import {
  clearPaymentForm,
  updatePaymentForm,
} from '../../../actions/auth.action';
import { useDispatch, useSelector } from 'react-redux';
import { getCreditCardType } from '../../../utils/creditCards';

export default function PaymentMethodItem({
  id = '',
  cvc = '',
  fullName = '',
  cardNumber = 'xxxx',
  expirationMonth = '00',
  expirationYear = '00',
  isDefault = false,
  setFieldValue,
  setIsEditing,
}) {
  const { paymentMethods } = useSelector(({ auth: { paymentMethods } }) => ({
    paymentMethods,
  }));
  const dispatch = useDispatch();

  const [showDropdown, setShowDropdown] = useState(false);

  const handleContextClick = (e) => {
    if (e.target && e.target.class !== 'item-dropdown-menu') {
      setShowDropdown(false);
      window.removeEventListener('click', handleContextClick);
    }
  };

  useEffect(() => {
    let mounted = true;
    if (showDropdown && mounted) {
      window.addEventListener('click', handleContextClick);
    }
    return () => {
      window.removeEventListener('click', handleContextClick);
    };
  }, [showDropdown]);

  const edit = () => {
    /**
     * Set's Form Value before setting to editing state
     */
    setFieldValue('cardNumber', cardNumber);
    setFieldValue('expirationMonth', expirationMonth);
    setFieldValue('expirationYear', expirationYear);
    setFieldValue('fullName', fullName);
    setFieldValue('cvc', cvc);
    setFieldValue('id', id);
    /**
     * Hides payment methods and shows payment form
     */
    setIsEditing(true);
  };

  const onDelete = () => {
    const newPaymentMethods = [...paymentMethods].filter(
      ({ id: paymentMethodId }) => paymentMethodId !== id
    );
    dispatch(updatePaymentForm(newPaymentMethods));
  };

  const lastFourNumbers = cardNumber.substr(
    cardNumber.length - 4,
    cardNumber.length + 1
  );

  const cardType = getCreditCardType(cardNumber);
  const type = cardType.text;
  const cardImage = cardType.image;
  return (
    <div className='list-group-item'>
      <div className='row align-items-center'>
        <div className='col-auto'>
          <img
            className='img-fluid'
            src={cardImage}
            style={{
              width: 38,
              height: 38,
            }}
          />
        </div>
        <div className='col ml-n2'>
          <h4 className='mb-1'>
            {type} ending in {lastFourNumbers}
          </h4>
          <small className='text-muted'>
            Expires {`${expirationMonth}/${expirationYear}`}
          </small>
        </div>
        {isDefault && (
          <div
            className='col-auto mr-n3'
            onClick={() => dispatch(clearPaymentForm())}
          >
            <span className='badge badge-light'>Default</span>
          </div>
        )}
        <div className='col-auto'>
          <div className='dropdown'>
            <a
              className='dropdown-ellipses dropdown-toggle'
              role='button'
              data-toggle='dropdown'
              aria-haspopup='true'
              aria-expanded='false'
              onClick={() => {
                setShowDropdown(true);
              }}
            >
              <i className='fe fe-more-vertical'>...</i>
            </a>
          </div>
          <div
            id='item-dropdown-menu'
            className='dropdown-menu'
            style={{
              display: showDropdown ? 'block' : 'none',
            }}
          >
            <a className='dropdown-item btn' onClick={edit}>
              Edit
            </a>
            <a className='dropdown-item btn' onClick={onDelete}>
              Delete
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
