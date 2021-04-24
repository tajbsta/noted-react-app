import React, { useEffect, useState } from 'react';
import { Plus } from 'react-feather';
import ProductCard from '../../components/ProductCard';
import PickUpConfirmed from '../../components/PickUpConfirmed';
import PickUpDetails from './components/PickUpDetails';
import { useDispatch, useSelector } from 'react-redux';
import { get, isEmpty } from 'lodash';
import $ from 'jquery';
import { updateOrders } from '../../actions/auth.action';
import { useHistory } from 'react-router';
import Row from '../../components/Row';
import { RETURNABLE } from '../../constants/actions/runtime';
import { scrollToTop } from '../../utils/window';
import ModifyCheckoutCard from './components/ModifyCheckoutCard';
import MobileModifyCheckoutCard from './components/MobileModifyCheckoutCard';

function ViewConfirmedReturn({
  location: {
    state: { scheduledReturnId = '', hasModifications = false },
  },
}) {
  const [confirmed, setconfirmed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const history = useHistory();
  const {
    inDonation,
    scheduledReturns,
    scans,
    orderInMemory,
    cart,
  } = useSelector(
    ({
      runtime: { forReturn, lastCall, forDonation, orderInMemory },
      auth: { scheduledReturns },
      scans,
      cart,
    }) => ({
      localDonationsCount: forDonation.length,
      forReturn,
      lastCall,
      scheduledReturns,
      inReturn: [...forReturn, ...lastCall],
      inDonation: [...forDonation],
      scans,
      orderInMemory,
      cart,
    })
  );

  useEffect(() => {
    const platform = window.navigator.platform;
    const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];

    if (windowsPlatforms.indexOf(platform) !== -1) {
      // Windows 10 Chrome
      $('.btn-confirm').css('padding-top', '10px');
    }
  }, []);

  const scheduledReturn = hasModifications
    ? orderInMemory
    : scheduledReturns.find(({ id }) => id === scheduledReturnId);

  const { returnFee, taxes, address, payment, details } = scheduledReturn;
  const items = get(scheduledReturn, 'items', []);
  const orderId = get(scheduledReturn, 'id', '');
  const inReturn = get(cart, 'items', []).filter(
    ({ category }) => category === RETURNABLE
  );

  const potentialReturnValue = [...inReturn]
    .map(({ price }) => parseFloat(price))
    .reduce((acc, curr) => (acc += curr), 0);
  const totalPayment = (returnFee + taxes).toFixed(2);
  const forgottenReturns = [...scans].filter(({ id }) => {
    return ![...items].map(({ id }) => id).includes(id);
  });

  useEffect(() => {
    scrollToTop();
    if (get(scheduledReturn, 'items', []).length === 0) {
      history.push('/dashboard');
    }
  }, [scheduledReturn]);

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
      setIsTablet(window.innerWidth >= 541 && window.innerWidth <= 980);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  return (
    <div id='ViewConfirmReturnPage'>
      {isMobile && (
        <MobileModifyCheckoutCard
          inReturn={inReturn}
          confirmed={confirmed}
          potentialReturnValue={potentialReturnValue}
          inDonation={inDonation}
          returnFee={returnFee}
          taxes={taxes}
          totalPayment={totalPayment}
        />
      )}
      <div className='container mt-6'>
        <div className='row mobile-view-no-m-row'>
          <div className={isTablet ? 'col-sm-12' : 'col-sm-9'}>
            {/*CONTAINS ALL SCANS LEFT CARD OF VIEW SCAN PAGE*/}
            {confirmed ? (
              <div className='mobile-view-scan-col'>
                <h3 className='sofia-pro text-18 section-title'>
                  Pick-up confirmed
                </h3>
                <PickUpConfirmed />
              </div>
            ) : (
              <div className='mobile-view-scan-col'>
                <PickUpDetails
                  address={address}
                  payment={payment}
                  details={details}
                />
                {/**
                 * PICK UP DETAILS
                 */}
              </div>
            )}

            <h3 className='sofia-pro products-return text-18 section-title mobile-view-scan-col'>
              Your products to return
            </h3>
            {items.map((item) => (
              <ProductCard
                orderId={orderId}
                scannedItem={item}
                key={item.id}
                item={item}
                selectable={false}
                clickable={false}
                removable={!confirmed}
              />
            ))}
            {/**
             * @START ADD PRODUCTS BTN
             */}
            {!confirmed && (
              <div
                className='card add-border scanned-item-card max-w-840 mb-3 p-0 btn mobile-view-add-col'
                onClick={() => {
                  /**
                   * @FUNCTION Show products like the one from dashboard
                   */
                  history.push('/edit-order', { scheduledReturnId });
                }}
              >
                <div className='card-body pt-3 pb-3 p-0 m-0'>
                  <Row className='add-row'>
                    <div className='col-sm-1 product-img-container add-product-container'>
                      <Plus />
                    </div>
                    <div className='col-sm-4 p-0 p-details m-add-product'>
                      <Row>
                        <h3 className='add-title'>Add Products</h3>
                      </Row>
                      <h3 className='add-product-info'>
                        (No extra cost if they fit in one box)
                      </h3>
                    </div>
                  </Row>
                </div>
              </div>
            )}
            {confirmed && (
              <>
                <h3 className='sofia-pro miss-out section-title'>
                  Don&apos;t miss out on other returns
                </h3>
                <div className='row align-items-center p-4 all-checkbox'>
                  <input type='checkbox' />
                  <h4 className='sofia-pro noted-purple ml-4 mb-0 p-0'>
                    Add all
                  </h4>
                </div>
                {forgottenReturns.map((item) => (
                  <ProductCard scannedItem={item} key={item.id} />
                ))}
              </>
            )}
            {/**
             * @END ADD PRODUCTS BTN
             */}
          </div>

          {/* RIGHT CARD */}
          {!isMobile && (
            <>
              <div className='col-sm-3'>
                <ModifyCheckoutCard
                  potentialReturnValue={potentialReturnValue}
                  inDonation={inDonation}
                  taxes={taxes}
                  totalPayment={totalPayment}
                  isEmpty={isEmpty}
                  orderInMemory={orderInMemory}
                  hasModifications={hasModifications}
                  items={items}
                  scheduledReturnId={scheduledReturnId}
                  scheduledReturn={scheduledReturn}
                  scheduledReturns={scheduledReturns}
                  updateOrders={updateOrders}
                  returnFee={returnFee}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ViewConfirmedReturn;
