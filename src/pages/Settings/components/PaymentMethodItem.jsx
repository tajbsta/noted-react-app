import React, { useEffect, useState } from 'react';
import MastercardSvg from '../../../assets/img/mastercard.svg';
import VisaSvg from '../../../assets/img/visa.svg';
import {
  clearPaymentForm,
  updatePaymentForm,
} from '../../../actions/auth.action';
import { useDispatch, useSelector } from 'react-redux';

export default function PaymentMethodItem({
  cardNumber = 'xxxx',
  type = 'Visa',
  expirationMonth = '00',
  expirationYear = '00',
  isDefault = false,
}) {
  const { paymentMethods } = useSelector(({ auth: { paymentMethods } }) => ({
    paymentMethods,
  }));
  const dispatch = useDispatch();

  const [showDropdown, setShowDropdown] = useState(false);

  const handleWindowClick = (e) => {
    if (e.target && e.target.id !== 'navbarDropdownMenuLink') {
      setShowDropdown(false);
      window.removeEventListener('click', handleWindowClick);
    }
  };

  useEffect(() => {
    let mounted = true;
    if (showDropdown && mounted) {
      window.addEventListener('click', handleWindowClick);
    }
    return () => {
      window.removeEventListener('click', handleWindowClick);
    };
  }, [showDropdown]);

  const edit = () => {
    /**
     * SOMEDAY
     */
  };

  const onDelete = () => {
    const newPaymentMethods = [...paymentMethods].filter(
      ({ cardNumber: number }) => cardNumber !== number
    );
    dispatch(updatePaymentForm(newPaymentMethods));
  };

  const lastFourNumbers = cardNumber.substr(
    cardNumber.length - 4,
    cardNumber.length + 1
  );

  return (
    <div className='list-group-item'>
      <div className='row align-items-center'>
        <div className='col-auto'>
          <img
            className='img-fluid'
            src={MastercardSvg}
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
              onClick={() => setShowDropdown(true)}
            >
              <i className='fe fe-more-vertical'>...</i>
            </a>
          </div>
          <div
            className='dropdown-menu mr-4'
            style={{
              display: showDropdown ? 'block' : 'none',
              position: 'absolute',
              right: '50%',
            }}
          >
            <a className='dropdown-item btn'>Edit</a>
            <a className='dropdown-item btn' onClick={onDelete}>
              Delete
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
