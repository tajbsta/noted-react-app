import React, { useState, useEffect } from 'react';
import { GREAT } from '../constants/returns/scores';
import ReturnScore from './ReturnsScore';
import Row from './Row';
import { Container, Col } from 'react-bootstrap';
import ProductDetails from './ProductDetails';
import ProductCardHover from './ProductCardHover';
import { useDispatch, useSelector } from 'react-redux';
import { updateForReturn, updateLastCall } from '../actions/runtime.action';
import { useHistory } from 'react-router';
import { get } from 'lodash';
import { updateOrders } from '../actions/auth.action';
import $ from 'jquery';
import ProductPlaceholder from '../assets/img/ProductPlaceholder.svg';

function ProductCard({
  orderId = '',
  selectable = true,
  selected,
  addSelected,
  removable = true,
  removeSelected = () => {},
  clickable = true,
  scannedItem: {
    vendorTag,
    itemName,
    returnScore = GREAT,
    amount,
    id,
    imageUrl,
    orderDate,
  },
  disabled,
  scannedItem,
}) {
  const dispatch = useDispatch();
  const history = useHistory();
  const pathName = get(history, 'location.pathname', '');
  const { forReturn, lastCall, scheduledReturns } = useSelector(
    ({ runtime: { forReturn, lastCall }, auth: { scheduledReturns } }) => ({
      forReturn,
      lastCall,
      scheduledReturns,
    })
  );

  const [isHover, setIsHover] = useState(false);
  const handleSelection = () => {
    if (selected) {
      removeSelected(id);
      return;
    }
    addSelected(id);
  };

  const onRemove = (id) => {
    /**
     * REMOVE PRODUCT HERE FROM WHEREVER IT IS STORED FOR NOW.
     * BACKEND INTEGRATION WILL MAKE THIS PRETTY :()
     */

    if (pathName === '/view-scan') {
      dispatch(
        updateForReturn({
          scans: [...forReturn.filter(({ id: returnId }) => returnId !== id)],
        })
      );
      dispatch(
        updateLastCall({
          scans: [...lastCall.filter(({ id: returnId }) => returnId !== id)],
        })
      );
    }

    if (pathName === '/view-return') {
      const scheduledReturn = scheduledReturns.find(({ id }) => id === orderId);
      console.log(scheduledReturn);
      /**
       * MUTATE THE ORDER => then => ORDERS FOR NOW
       */
      const items = get(scheduledReturn, 'items', []);
      /**
       * MUTATING ITEMS FIRST
       */
      const newItems = items.filter(({ id: returnId }) => returnId !== id);
      /**
       * CREATE NEW MUTATION OF THE ORDER
       */
      const newScheduledReturn = { ...scheduledReturn, items: [...newItems] };
      /**
       * MUTATE ORDERS WITH NEW ORDER
       */
      dispatch(
        updateOrders([
          ...scheduledReturns.filter(({ id }) => newScheduledReturn.id !== id),
          { ...newScheduledReturn },
        ])
      );
    }
  };

  // Truncate name if name is longer than 15 characters
  const truncateString = (str, num = 15) => {
    if (str && str.length > num) {
      return str.slice(0, num) + '...';
    } else {
      return str;
    }
  };

  // Truncate name if name is longer than 15 characters
  const truncateBrand = (str, num = 8) => {
    if (str && str.length > num) {
      return str.slice(0, num);
    } else {
      return str;
    }
  };

  const showHoverContent = isHover || selected;

  useEffect(() => {
    const platform = window.navigator.platform;
    const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];

    if (windowsPlatforms.indexOf(platform) !== -1) {
      // Windows 10 Chrome
      $('.x').css('position', 'initial');
    }
  }, []);

  return (
    <div id='productCard'>
      <div
        className={`card scanned-item-card w-840 mb-3 p-0 ${
          clickable && 'btn'
        }`}
        key={itemName}
        style={{
          border: selected
            ? '1px solid rgba(87, 0, 151, 0.8)'
            : '1px solid #EAE8EB',
        }}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        <div className='card-body pt-3 pb-3 p-0 m-0'>
          <Row>
            {selectable && (
              <div className='row align-items-center p-4 product-checkbox'>
                <input
                  disabled={disabled}
                  type='checkbox'
                  checked={selected}
                  onChange={handleSelection}
                  style={{
                    zIndex: 999,
                  }}
                />
              </div>
            )}

            <div
              className='product-img-container'
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {removable && !selectable && (
                <div className='removeProduct' onClick={() => onRemove(id)}>
                  <span className='x' style={{ color: 'black' }}>
                    &times;
                  </span>
                </div>
              )}
              <img
                className='product-img'
                src={imageUrl || ProductPlaceholder}
                alt=''
                style={{
                  maxWidth: 50,
                  maxHeight: 50,
                  objectFit: 'contain',
                }}
              />
            </div>
            {/* MOBILE VIEWS FOR PRODUCT DETAILS */}
            <div id='mobile-product-info'>
              <div className='details'>
                <Container>
                  <div className='title-container'>
                    <h4 className='mb-0 sofia-pro mb-1 distributor-name'>
                      {truncateBrand(vendorTag)}
                    </h4>
                    <h5 className='sofia-pro mb-2 product-name'>
                      &nbsp;{truncateString(itemName)}
                    </h5>
                  </div>
                </Container>
                <Container className='s-container'>
                  <Row>
                    <Col className='col-days-left'>
                      <div
                        className='noted-red sofia-pro mobile-limit'
                        style={{
                          color: '#FF1C29',
                        }}
                      >
                        2 days left
                      </div>
                    </Col>
                    <Col className='col-score'>
                      <div className='mobile-return-score'>
                        <ReturnScore score={returnScore} />
                      </div>
                    </Col>
                  </Row>
                </Container>
                <Container>
                  <Row>
                    <h4 className='sofia-pro mobile-price'>${amount}</h4>
                  </Row>
                </Container>
              </div>
            </div>

            <ProductDetails
              scannedItem={{
                vendorTag,
                itemName,
                scannedItem,
                returnScore,
                amount,
                compensationType: '',
              }}
              isHovering={showHoverContent}
            />

            <div
              className='col-sm-12 return-details-container'
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyItems: 'center',
              }}
            >
              <ProductCardHover
                orderDate={orderDate}
                show={showHoverContent}
                scannedItem={scannedItem}
              />

              {!isHover && !selected && (
                <>
                  <div
                    className='col-sm-6 noted-red sofia-pro return-time-left'
                    style={{
                      color: '#FF1C29',
                    }}
                  >
                    2 days left
                  </div>
                  <div className='col-sm-3 return-score'>
                    <ReturnScore score={returnScore} />
                  </div>
                </>
              )}

              <div className='col-sm-3 return-item-brand'>
                <img
                  src='https://pbs.twimg.com/profile_images/1159166317032685568/hAlvIeYD_400x400.png'
                  alt=''
                  className='avatar-img ml-2 rounded-circle noted-border brand-img'
                  style={{
                    width: 35,
                    height: 35,
                  }}
                />
              </div>
            </div>
          </Row>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
