import React, { useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Overlay, Tooltip, Row } from 'react-bootstrap';
import { get } from 'lodash-es';
import { DONATE, NOT_ELIGIBLE } from '../../constants/actions/runtime';
import ConfirmDonate from '../../modals/ConfirmDonate';
import { toTitleCase } from '../../utils/data';

function ProductDetails({
  item,
  isHovering = false,
  toggleSelected,
  daysLeft,
  isDonate,
  isNotEligible,
  refreshCategory = {},
}) {
  const history = useHistory();
  const pageLocation = history.location.pathname;
  const notOrderViews = ['/dashboard', '/profile'];
  const [show, setShow] = useState(false);
  const [modalDonateShow, setModalDonateShow] = useState(false);
  const target = useRef(null);

  const nameRegex = /[!@$%^&*+={}<>?]+/;
  const formattedProductName = nameRegex.test(item.name)
    ? 'Name not found'
    : toTitleCase(item.name);

  const formatPrice =
    item.price === 0
      ? 'Price Unavailable'
      : `$${parseFloat(item.price).toFixed(2)}`;

  // Truncate name if longer than 45 characters
  const truncateProductNameInDesktop = (str, num = 45) => {
    if (str && str.length > num) {
      return str.slice(0, num) + '...';
    } else {
      return str;
    }
  };

  const truncatedName = truncateProductNameInDesktop(formattedProductName);

  const inDashboard = ['/dashboard'].includes(pageLocation);

  const onMouseOver = () => {
    if (formattedProductName.length > 50) {
      setShow(true);
    }
  };

  const onMouseLeave = () => {
    setShow(false);
  };

  const category = get(item, 'category', '');
  const vendorName = () => {
    if (item.vendor_data) {
      return get(item.vendor_data, 'name', '');
    } else {
      return get(item, 'vendor', '');
    }
  };

  return (
    <div
      className={`col-sm-7 p-0 mt-1 p-details ml-3 ${
        !notOrderViews.indexOf(pageLocation) != -1 ? 'scheduled-height' : ''
      }`}
    >
      <Overlay target={target.current} show={show} placement='right'>
        {(props) => (
          <Tooltip id='overlay-example' {...props}>
            <span style={{ fontFamily: 'Sofia Pro !important' }}>
              {formattedProductName}
            </span>
          </Tooltip>
        )}
      </Overlay>

      <Row>
        <h4 className='mb-0 sofia-pro mb-1 distributor-name'>{vendorName()}</h4>
      </Row>
      <Row>
        <h5
          className='sofia-pro mb-1 product-name'
          id='name'
          ref={target}
          onMouseOver={onMouseOver}
          onMouseLeave={onMouseLeave}
        >
          {truncatedName}
        </h5>
      </Row>
      <Row>
        {isNotEligible ? (
          <>
            <h4 className='sofia-pro mb-0 not-eligible-text'>
              This item is not eligible for pick up
            </h4>
            <h4 className='sofia-pro mb-0 alternateActionText'>&nbsp;-</h4>
            <button
              type='button'
              className='btn alternateActionText ml-1'
              onClick={() => setModalDonateShow(true)}
            >
              Donate instead
            </button>
          </>
        ) : (
          <h4
            className={`sofia-pro mb-0 product-price ${
              category == DONATE ? 'donate-price' : ''
            }`}
            style={{
              fontWeight: isDonate ? 'normal' : '700',
              opacity: isDonate ? '0.6' : '1',
            }}
          >
            {formatPrice}
          </h4>
        )}
        {isHovering &&
          inDashboard &&
          category !== DONATE &&
          category !== NOT_ELIGIBLE &&
          daysLeft > 2 && (
            <>
              <button
                type='button'
                className='btn alternateActionText ml-2'
                onClick={() => setModalDonateShow(true)}
              >
                Donate instead
              </button>
            </>
          )}
      </Row>
      <ConfirmDonate
        show={modalDonateShow}
        onHide={() => {
          setModalDonateShow(false);
        }}
        item={item}
        toggleSelected={toggleSelected}
        refreshCategory={refreshCategory}
      />
    </div>
  );
}

export default ProductDetails;
