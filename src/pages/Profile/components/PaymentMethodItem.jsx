import React, { useEffect, useState } from 'react';
import { getCreditCardType } from '../../../utils/creditCards';
import { updateUserAttributes } from '../../../api/auth';
import { deletePaymentMethod } from '../../../api/orderApi';

export default function PaymentMethodItem({
  method,
  isDefault = false,
  setAsDefault,
  deleted,
}) {
  const brand = method.card.brand;
  const lastFourNumbers = method.card.last4;
  const expirationMonth = method.card.exp_month;
  const expirationYear = method.card.exp_year;
  const fullName = method.billing_details.name;
  const id = method.id;

  const cardType = getCreditCardType(brand);
  const type = cardType.text;
  const cardImage = cardType.image;

  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const setPaymentMethodAsDefault = async () => {
    setLoading(true);
    await updateUserAttributes({
      'custom:default_payment': id,
    });

    setAsDefault(id);
    setLoading(false);
  };
  const onDelete = async () => {
    setLoading(true);
    await deletePaymentMethod(id);
    await deleted(id);
    setLoading(false);
  };

  return (
    <div className='list-group-item' style={{ opacity: loading ? 0.5 : 1 }}>
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
          <div className='col-auto mr-n3'>
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
                if (loading) {
                  return;
                }
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
            {!isDefault && (
              <a
                className='dropdown-item btn'
                onClick={setPaymentMethodAsDefault}
              >
                Set as default
              </a>
            )}
            <a className='dropdown-item btn' onClick={onDelete}>
              Delete
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
