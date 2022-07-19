import React, { useState, useEffect } from 'react';
import ReturnScore from './ReturnsScore';
import { RETURN_SCORES } from '../../constants/returns/scores';
import Row from '../Row';
import { Container, Col } from 'react-bootstrap';
import ProductDetails from './ProductDetails';
import ProductCardHover from './ProductCardHover';
import $ from 'jquery';
import ProductPlaceholder from '../../assets/img/ProductPlaceholder.svg';
import moment from 'moment';
import ReturnPolicyModal from '../../modals/ReturnPolicyModal';
import ConfirmDonate from '../../modals/ConfirmDonate';
import NotedCheckbox from './NotedCheckbox';
import { get, isEmpty } from 'lodash-es';
import EditProductModal from '../../modals/EditProductModal';

import { useHistory } from 'react-router';
import { toTitleCase } from '../../utils/data';
import ArchiveIcon from '../../assets/icons/archive-icon.svg';

export default function ProductCard({
  selectable = true,
  removable = true,
  clickable = true,
  disabled,
  item,
  selected,
  toggleSelected,
  onRemove = () => {},
  confirmed = false,
  refreshCategory = {},
  onArchive,
  onEdit,
}) {
  const [isHover, setIsHover] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [modalPolicyShow, setModalPolicyShow] = useState(false);
  const [modalEditShow, setModalEditShow] = useState(false);
  const [modalDonateShow, setModalDonateShow] = useState(false);

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

  const handleSelection = () => {
    toggleSelected(item);
  };

  const nameRegex = /[!@$%^&*+={}<>?]+/;
  const formattedProductName = nameRegex.test(item.name)
    ? 'Name not found'
    : toTitleCase(item.name);
  const formatPrice =
    item.price === 0
      ? 'Price Unavailable'
      : `$${parseFloat(item.price).toFixed(2)}`;
  const rating = !isEmpty(item.vendor_data.rating)
    ? item.vendor_data.rating
    : 1;
  const score = RETURN_SCORES.find(
    ({ rating: returnRating }) => rating === returnRating
  );
  const scoreTitle = get(score, 'title', '');
  const showHoverContent = isHover || selected;
  const vendorThumbnail = get(item.vendor_data, 'thumbnail', '');
  const userEmail = get(item, 'account_id', '');
  const vendorName = () => {
    if (item.vendor_data) {
      return get(item.vendor_data, 'name', '');
    } else {
      return get(item, 'vendor', '');
    }
  };

  // For windows CSS
  useEffect(() => {
    const platform = window.navigator.platform;
    const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];

    if (windowsPlatforms.indexOf(platform) !== -1) {
      // Windows 10 Chrome
      $('.x').css('position', 'initial');
    }
  }, []);

  const daysLeft =
    get(item, 'category', '') === 'DONATE'
      ? 'Donate'
      : moment
          .utc(get(item, 'return_not_eligible_date', ''))
          .local()
          .diff(moment().startOf('day'), 'days');

  const isDonate = get(item, 'category', '') === 'DONATE';
  const isNotEligible = get(item, 'category', '') === 'NOT_ELIGIBLE';
  const isLastCall = get(item, 'category', '') === 'LAST_CALL';

  const inCheckout = useHistory().location.pathname === '/checkout';

  const renderMobileView = () => {
    return (
      <div id='MobileProductCard'>
        <div
          className={`d-flex mr-2 ${
            confirmed || (!selected && !removable) ? 'ml-3' : 'ml-2'
          }`}
          style={{ alignItems: 'center' }}
        >
          {selectable && (
            <div
              className='row ml-2 mr-3'
              style={{
                alignItems: selected ? 'initial' : 'center',
              }}
            >
              <NotedCheckbox
                disabled={disabled || daysLeft <= 2}
                checked={selected}
                onChangeState={handleSelection}
              />
            </div>
          )}
          {removable && !selectable && !confirmed && (
            <div
              className='mobile-removeProduct'
              style={{
                alignItems: selected ? 'initial' : 'center',
              }}
              onClick={() => {
                onRemove(get(item, '_id', ''));
              }}
            >
              <span className='x' style={{ color: 'black' }}>
                &times;
              </span>
            </div>
          )}

          <div>
            <img
              className='product-img'
              src={item.thumbnail || ProductPlaceholder}
              onError={(e) => {
                e.currentTarget.src = ProductPlaceholder;
              }}
              alt=''
              style={{
                maxWidth: 50,
                maxHeight: 50,
                objectFit: 'contain',
                border: '1px solid #f0f0f0',
                borderRadius: '8px',
                justifyContent: 'center',
                width: '48px',
                height: '48px',
                background: '#fff',
              }}
            />
          </div>
          <div className='ml-3 full-width' style={{ textAlign: 'left' }}>
            <div
            // style={{ display: !selected ? 'flex' : '' }}
            >
              <h4 className='sofia-pro mb-1 mr-2' style={{ fontWeight: '700' }}>
                {vendorName()}
              </h4>
              <h4 className='sofia-pro mb-1' style={{ lineHeight: 'initial' }}>
                {/* {!selected ? mobileFormatProductName : formattedProductName} */}
                {formattedProductName}
              </h4>
            </div>

            <h4
              className='sofia-pro mb-1'
              style={{
                color: isNotEligible || isLastCall ? 'red' : '#8B888C',
              }}
            >
              {daysLeft !== 'Donate' &&
                daysLeft != 0 &&
                `${
                  Number(daysLeft) > 1000
                    ? 'Unlimited'
                    : `${daysLeft} ${daysLeft == 1 ? 'day' : 'days'} left`
                }`}
              {daysLeft === 'Donate' && daysLeft}
              {daysLeft == 0 && 'Expires today'}
            </h4>

            {isNotEligible ? (
              <>
                <h4 className='sofia-pro mb-0 not-eligible-text'>
                  This item is not eligible for pick up
                </h4>
                <button
                  className='sofia-pro btn btn-m-donate'
                  type='submit'
                  onClick={() => setModalDonateShow(true)}
                  style={{ zIndex: '1' }}
                >
                  Donate instead
                </button>
              </>
            ) : (
              <h4
                className='sofia-pro mb-0'
                style={{
                  fontWeight: isDonate ? 'normal' : '700',
                  opacity: isDonate ? '0.6' : '1',
                }}
              >
                {formatPrice}
              </h4>
            )}

            {userEmail && (
              <p className='m-0 p-0 sofia-pro text-xs my-2 noted-purple'>
                {userEmail}
              </p>
            )}

            {selected && (
              <>
                <Container>
                  <Row>
                    {!isDonate && (
                      <button
                        className='sofia-pro btn btn-m-donate mt-1'
                        type='submit'
                        onClick={() => setModalDonateShow(true)}
                        style={{ zIndex: '1' }}
                      >
                        Donate instead
                      </button>
                    )}
                  </Row>
                  <div
                    className='d-flex align-items-center mt-4'
                    onClick={() => onArchive(item._id)}
                  >
                    <img src={ArchiveIcon} alt='archive' className='mr-2 ' />
                    <span>Archive your item</span>
                  </div>
                </Container>
              </>
            )}
          </div>
          {!selected && (
            <div>
              <div className='d-flex'>
                <Col
                  className='ml-0'
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <ReturnScore score={rating} />
                </Col>
              </div>
            </div>
          )}
        </div>

        {selected && (
          <>
            <Container
              className='m-brand-info-container'
              style={{ width: 'auto' }}
            >
              <Row>
                <div className='m-brand-logo-cont'>
                  <img
                    src={vendorThumbnail || ProductPlaceholder}
                    onError={(e) => {
                      e.currentTarget.src = ProductPlaceholder;
                    }}
                    alt=''
                    className='m-brand-img'
                  />
                </div>
                <Col
                  style={{
                    paddingRight: '7px',
                    paddingLeft: '7px',
                  }}
                >
                  <Row>
                    <span className='m-score-container'>
                      <ReturnScore score={rating} />
                    </span>
                    <h4 className='m-score-text sofia-pro'>{scoreTitle}</h4>
                  </Row>
                  <Row>
                    <button
                      className='sofia-pro btn btn-m-policy'
                      onClick={() => setModalPolicyShow(true)}
                    >
                      Return policy
                    </button>
                  </Row>
                </Col>
              </Row>
            </Container>

            {item.provider === 'manual' && (
              <Container className='m-edit-container'>
                <Row>
                  <div className='m-edit-col'>
                    <h4 className='mb-0'>Wrong info? &nbsp;</h4>
                    <div
                      disabled
                      className='sofia-pro btn btn-m-edit mr-1'
                      onClick={() => onEdit(item)}
                    >
                      Edit
                    </div>
                  </div>
                </Row>
              </Container>
            )}
          </>
        )}

        <ReturnPolicyModal
          item={item}
          show={modalPolicyShow}
          onHide={() => {
            setModalPolicyShow(false);
          }}
        />

        <EditProductModal
          show={modalEditShow}
          onHide={() => {
            setModalEditShow(false);
          }}
        />

        <ConfirmDonate
          show={modalDonateShow}
          onHide={() => setModalDonateShow(false)}
          item={item}
          toggleSelected={toggleSelected}
          refreshCategory={refreshCategory}
        />
      </div>
    );
  };

  const renderDesktopView = () => {
    return (
      <>
        <Row>
          <Col sm={6}>
            <Row style={{ flexWrap: 'none' }}>
              {selectable && (
                <div
                  className='row p-4 product-checkbox'
                  style={{
                    alignItems: selected ? 'initial' : 'center',
                  }}
                >
                  <NotedCheckbox
                    disabled={disabled || daysLeft <= 2}
                    checked={selected}
                    onChangeState={handleSelection}
                  />
                </div>
              )}

              <div
                className='product-img-container'
                style={{
                  display: 'flex',
                  alignItems: selected ? '' : 'center',
                  marginTop: selected ? '7px' : '',
                  marginLeft: !selectable && '15px',
                }}
              >
                {removable && !selectable && !confirmed && (
                  <div
                    className='removeProduct'
                    onClick={() => {
                      onRemove(get(item, '_id', ''));
                    }}
                  >
                    <span className='x' style={{ color: 'black' }}>
                      &times;
                    </span>
                  </div>
                )}
                <img
                  className='product-img'
                  src={item.thumbnail || ProductPlaceholder}
                  onError={(e) => {
                    e.currentTarget.src = ProductPlaceholder;
                  }}
                  alt=''
                  style={{
                    maxWidth: 50,
                    maxHeight: 50,
                    objectFit: 'contain',
                  }}
                />
              </div>

              <ProductDetails
                item={item}
                isDonate={isDonate}
                isNotEligible={isNotEligible}
                daysLeft={daysLeft}
                isHovering={showHoverContent}
                toggleSelected={toggleSelected}
                refreshCategory={refreshCategory}
              />
            </Row>
          </Col>

          <Col
            sm={6}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexWrap: 'none',
                justifyContent: 'flex-end',
                alignItems: 'center',
              }}
            >
              {(isHover || selected) && (
                <ProductCardHover
                  orderDate={item.order_date}
                  show={showHoverContent}
                  item={item}
                  onEdit={() => onEdit(item)}
                  onArchive={onArchive}
                />
              )}

              {((!isHover && !selected && !isDonate && !inCheckout) ||
                (!isHover && inCheckout)) && (
                <Row className='px-4 flex-nowrap'>
                  <Col
                    sm={10}
                    className='sofia-pro'
                    style={{
                      color: isNotEligible || isLastCall ? 'red' : '#8B888C',
                    }}
                  >
                    {daysLeft !== 'Donate' &&
                      daysLeft != 0 &&
                      `${
                        Number(daysLeft) > 1000
                          ? 'Unlimited'
                          : `${daysLeft} ${daysLeft == 1 ? 'day' : 'days'} left`
                      }`}
                    {daysLeft === 'Donate' && daysLeft}
                    {daysLeft == 0 && 'Expires today'}
                  </Col>
                  <Col sm={2}>
                    <ReturnScore score={rating} />
                  </Col>
                </Row>
              )}

              {!isHover && !selected && isDonate && !inCheckout && (
                <Row className='h-50'>
                  <Col
                    sm={5}
                    className='sofia-pro'
                    style={{
                      color: '#8B888C',
                    }}
                  >
                    Donate
                  </Col>
                  <Col className='sofia-pro' sm={3}>
                    <ReturnScore score={rating} />
                  </Col>

                  <Col sm={4}>
                    <img
                      src={vendorThumbnail || ProductPlaceholder}
                      onError={(e) => {
                        e.currentTarget.src = ProductPlaceholder;
                      }}
                      alt=''
                      className='avatar-img ml-2 rounded-circle noted-border brand-img'
                      style={{
                        width: 35,
                        height: 35,
                        objectFit: 'contain',
                        background: '#fff',
                      }}
                    />
                  </Col>
                </Row>
              )}
            </div>
            {!isHover && !selected && isDonate && !inCheckout && userEmail && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  paddingRight: 20,
                  margin: 0,
                }}
              >
                <p className='m-0 p-0 sofia-pro text-sm mt-2 noted-purple'>
                  {userEmail}
                </p>
              </div>
            )}
          </Col>
        </Row>
      </>
    );
  };

  return (
    <div id='ProductCard'>
      <div
        className={`card scanned-item-card max-w-840 mb-3 p-0 ${
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
        <div className='card-body pt-3 pb-3 p-0 m-0'>
          {!isMobile && renderDesktopView()}
          {isMobile && renderMobileView()}
        </div>
      </div>

      <ReturnPolicyModal
        item={item}
        show={modalPolicyShow}
        onHide={() => {
          setModalPolicyShow(false);
        }}
      />
    </div>
  );
}
