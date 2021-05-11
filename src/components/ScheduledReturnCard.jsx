import React, { useState, useEffect } from 'react';
import { GREAT } from '../constants/returns/scores';
import ReturnScore from './ReturnsScore';
import Row from './Row';
import { Container, Col } from 'react-bootstrap';
import ProductDetails from './ProductDetails';
import OnHoverScheduledReturn from './OnHoverScheduledReturn';
import { useHistory } from 'react-router';

export default function ScheduledReturnCard({
  scheduledReturnId,
  selectable = true,
  selected,
  addSelected,
  removeSelected,
  clickable = true,
  scannedItem: {
    vendorTag,
    itemName,
    returnScore = GREAT,
    amount,
    id,
    imageUrl,
  },
  disabled,
  scannedItem,
}) {
  const history = useHistory();
  const [isHover, setIsHover] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileSmaller, setIsMobileSmaller] = useState(false); // <320px

  // Check if device is mobile
  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 991);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  useEffect(() => {
    function handleResize() {
      setIsMobileSmaller(window.innerWidth <= 320);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  const handleSelection = () => {
    if (selected) {
      removeSelected(id);
      return;
    }
    addSelected(id);
  };

  // Truncate name if longer than 21 characters
  const truncateProductNameForMobile = (str, num = 21) => {
    if (str && str.length > num) {
      return str.slice(0, num) + '...';
    } else {
      return str;
    }
  };

  // Truncate name if longer than 15 characters
  const truncateProductNameForSmallerScreens = (str, num = 12) => {
    if (str && str.length > num) {
      return str.slice(0, num) + '...';
    } else {
      return str;
    }
  };

  // Truncate name if longer than 8 characters
  const truncateBrand = (str, num = 8) => {
    if (str && str.length > num) {
      return str.slice(0, num);
    } else {
      return str;
    }
  };

  return (
    <div id='ScheduledReturnCard'>
      <div
        className={`card scanned-item-card max-w-840 mb-3 p-0 ${
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
          <Row className='scheduled-height'>
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
              className={`product-img-container ${!isMobile ? 'col-sm-1' : ''}`}
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <img
                className='product-img'
                src={imageUrl}
                alt=''
                style={{
                  maxWidth: 50,
                  maxHeight: 50,
                  objectFit: 'contain',
                }}
              />
            </div>
            {/* MOBILE VIEWS FOR PRODUCT DETAILS */}
            <div id='mobile-product-info' className='m-scheduled-card'>
              <div className='details'>
                <Container>
                  <div className='title-container'>
                    <h4 className='mb-0 sofia-pro mb-1 distributor-name'>
                      {truncateBrand(vendorTag)}
                    </h4>
                    {isMobileSmaller && (
                      <h5 className='sofia-pro mb-2 product-name'>
                        &nbsp;{truncateProductNameForSmallerScreens(itemName)}
                      </h5>
                    )}

                    {!isMobileSmaller && (
                      <h5 className='sofia-pro mb-2 product-name'>
                        &nbsp;{truncateProductNameForMobile(itemName)}
                      </h5>
                    )}
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
            />
            <div
              className='col-sm-12 return-details-container'
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyItems: 'center',
              }}
            >
              {isHover && (
                <OnHoverScheduledReturn
                  timeLeft='in 59 minutes'
                  onClick={() => {
                    history.push('/view-return', { scheduledReturnId });
                  }}
                />
              )}

              {!isHover && (
                <>
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
