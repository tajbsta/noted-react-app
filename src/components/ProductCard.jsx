import React, { useState, useEffect } from 'react';
import ReturnScore from './ReturnsScore';
import Row from './Row';
import { Container, Col } from 'react-bootstrap';
import ProductDetails from './ProductDetails';
import ProductCardHover from './ProductCardHover';
import $ from 'jquery';
import ProductPlaceholder from '../assets/img/ProductPlaceholder.svg';
import moment from 'moment';
import ReturnPolicyModal from '../modals/ReturnPolicyModal';
import EditProductModal from '../modals/EditProductModal';
import NotedCheckbox from './NotedCheckbox';

function ProductCard({
  selectable = true,
  removable = true,
  clickable = true,
  disabled,
  item,
  selected,
  toggleSelected,
}) {
  const [isHover, setIsHover] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileSmaller, setIsMobileSmaller] = useState(false);
  const [modalPolicyShow, setModalPolicyShow] = useState(false);
  const [modalEditShow, setModalEditShow] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 991);
    }
    handleResize(); // Run on load to set the default value
    window.addEventListener('resize', handleResize);
    // Clean up event listener
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
    toggleSelected(item);
  };

  // Truncate name if longer than 15 characters
  const truncateString = (str, num = 15) => {
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

  const showHoverContent = isHover || selected;

  useEffect(() => {
    const platform = window.navigator.platform;
    const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];

    if (windowsPlatforms.indexOf(platform) !== -1) {
      // Windows 10 Chrome
      $('.x').css('position', 'initial');
    }
  }, []);

  const daysLeft =
    item.category === 'DONATE'
      ? 'Donate'
      : moment(item.return_not_eligible_date).diff(
          moment().startOf('day'),
          'days'
        );

  const isDonate = item.category === 'DONATE';

  return (
    <div id='productCard'>
      <div
        className={`card scanned-item-card w-840 mb-3 p-0 ${
          clickable && 'btn'
        } ${isMobile && selected ? 'selected-mobile' : ''}`}
        key={item.product_hash}
        style={{
          border: selected
            ? '1px solid rgba(87, 0, 151, 0.8)'
            : '1px solid #EAE8EB',
        }}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        <div
          className='card-body pt-3 pb-3 p-0 m-0'
          style={{ marginTop: isMobile ? '1px' : '' }}
        >
          <Row>
            {selectable && (
              <div
                className='row p-4 product-checkbox'
                style={{
                  alignItems: isMobile && selected ? 'initial' : 'center',
                }}
              >
                <NotedCheckbox
                  disabled={disabled}
                  checked={selected}
                  onChangeState={handleSelection}
                />
              </div>
            )}

            <div
              className='product-img-container'
              style={{
                display: 'flex',
                alignItems: isMobile && selected ? '' : 'center',
                marginTop: isMobile && selected ? '7px' : '',
              }}
            >
              {removable && !selectable && (
                <div className='removeProduct' onClick={() => {}}>
                  <span className='x' style={{ color: 'black' }}>
                    &times;
                  </span>
                </div>
              )}
              <img
                className='product-img'
                src={item.thumbnail || ProductPlaceholder}
                alt=''
                style={{
                  maxWidth: 50,
                  maxHeight: 50,
                  objectFit: 'contain',
                }}
              />
            </div>
            {/* MOBILE VIEWS FOR PRODUCT DETAILS */}
            <div
              id='mobile-product-info'
              style={{
                marginTop: '5px',
                width: isMobile && removable && !selectable ? '83%' : '',
                maxWidth:
                  isMobileSmaller && removable && !selectable ? '75%' : '',
              }}
            >
              <div className='details'>
                <Container>
                  <div className='title-container'>
                    <h4
                      className='mb-0 sofia-pro mb-1 distributor-name'
                      style={{ marginBottom: '0px' }}
                    >
                      {truncateBrand(item.vendor_data.name)}
                    </h4>
                    <h5 className='sofia-pro mb-2 product-name'>
                      &nbsp;{truncateString(item.name)}
                    </h5>
                  </div>
                </Container>
                <Container className='s-container'>
                  <Row>
                    <div
                      style={{
                        display: selected ? 'flex' : '',
                        alignItems: 'center',
                        width: selected ? '75%' : '',
                      }}
                    >
                      <Col
                        className='col-days-left'
                        style={{
                          paddingRight: '4px',
                        }}
                      >
                        {!isDonate && (
                          <>
                            <div
                              className='sofia-pro mobile-limit'
                              style={{
                                color: '#8B888C',
                              }}
                            >
                              {daysLeft} days left
                            </div>
                          </>
                        )}
                        {isDonate && (
                          <>
                            <div
                              className='sofia-pro mobile-limit'
                              style={{
                                color: '#8B888C',
                              }}
                            >
                              Donate
                            </div>
                          </>
                        )}
                      </Col>
                      <Col className='m-date-col'>
                        {selected && (
                          <div className='m-date sofia-pro'>
                            {moment(item.order_date).format('MMM Do, YYYY')}
                          </div>
                        )}
                      </Col>
                    </div>
                    <Col
                      className='col-score'
                      style={{ display: selected ? 'none' : '' }}
                    >
                      <div className='mobile-return-score'>
                        <ReturnScore score={item.vendor_data.rating} />
                      </div>
                    </Col>
                  </Row>
                </Container>
                <Container>
                  <Row>
                    <h4 className='sofia-pro mobile-price'>${item.price}</h4>
                  </Row>
                </Container>
                {selected && (
                  <Container>
                    <Row>
                      <button
                        className='sofia-pro btn btn-m-donate'
                        type='submit'
                      >
                        Donate instead
                      </button>
                    </Row>
                  </Container>
                )}
              </div>
            </div>
            {isMobile && selected && (
              <>
                <Container className='m-brand-info-container'>
                  <Row>
                    <div className='m-brand-logo-cont'>
                      <img
                        src='https://pbs.twimg.com/profile_images/1159166317032685568/hAlvIeYD_400x400.png'
                        alt=''
                        className='m-brand-img'
                      />
                    </div>

                    <Row>
                      <div className='m-score-container'>
                        <ReturnScore score={item.vendor_data.rating} />
                      </div>
                    </Row>

                    <Col style={{ paddingRight: '7px', paddingLeft: '7px' }}>
                      <Row>
                        <h4 className='m-score-text sofia-pro'>
                          Excellent returns
                        </h4>
                      </Row>
                      <Row>
                        <button
                          className='sofia-pro btn btn-m-donate'
                          onClick={() => setModalPolicyShow(true)}
                        >
                          Return policy
                        </button>
                      </Row>
                    </Col>
                  </Row>
                </Container>

                <Container className='m-edit-container'>
                  <Row>
                    <div className='m-edit-col'>
                      <h4>Wrong info? &nbsp;</h4>
                      <button
                        className='sofia-pro btn btn-m-edit'
                        onClick={() => setModalEditShow(true)}
                      >
                        Edit
                      </button>
                    </div>
                  </Row>
                </Container>
              </>
            )}
            <ReturnPolicyModal
              show={modalPolicyShow}
              onHide={() => {
                setModalPolicyShow(false);
              }}
            />
            {/* <EditProductModal
              show={modalEditShow}
              onHide={() => {
                setModalEditShow(false);
              }}
              // editProductForm={{ handleChange, values, setFieldValue }}
            /> */}

            <ProductDetails item={item} isHovering={showHoverContent} />

            <div
              className='col-sm-12 return-details-container'
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyItems: 'center',
              }}
            >
              <ProductCardHover
                orderDate={item.order_date}
                show={showHoverContent}
                item={item}
              />

              {!isHover && !selected && !isDonate && (
                <>
                  <div
                    className='col-sm-6 sofia-pro return-time-left'
                    style={{
                      color: '#8B888C',
                    }}
                  >
                    {daysLeft} days left
                  </div>
                  <div className='col-sm-3 return-score'>
                    <ReturnScore score={item.vendor_data.rating} />
                  </div>
                </>
              )}

              {!isHover && !selected && isDonate && (
                <>
                  <div
                    className='col-sm-6 sofia-pro return-time-left'
                    style={{
                      color: '#8B888C',
                    }}
                  >
                    Donate
                  </div>
                  <div className='col-sm-3 return-score'>
                    <ReturnScore score={item.vendor_data.rating} />
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
