import React, { useEffect, useState } from 'react';
import CheckoutCard from './components/CheckoutCard';
import MobileCheckoutCard from './components/MobileCheckoutCard';
import ProductCard from '../../components/ProductCard';
import PickUpConfirmed from '../../components/PickUpConfirmed';
import PickUpDetails from './components/PickUpDetails';
import { useDispatch, useSelector } from 'react-redux';
import { get, isEmpty } from 'lodash';
import $ from 'jquery';
import { clearForm } from '../../actions/runtime.action';
import { setCartItems } from '../../actions/cart.action';
import { Link } from 'react-router-dom';
import { scrollToTop } from '../../utils/window';
import SizeGuideModal from '../../modals/SizeGuideModal';
import { showError, showSuccess } from '../../library/notifications.library';
import { Box } from 'react-feather';
import { createOrder } from '../../utils/orderApi';
import { getUserId } from '../../utils/auth';
import { orderErrors } from '../../library/errors.library';

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const [placingOrder, setPlacingOrder] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [order, setOrder] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [modalSizeGuideShow, setModalSizeGuideShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const { address, payment, details, items } = useSelector(
    ({
      cart: { items },
      runtime: {
        form: { address, payment, details },
      },
    }) => ({
      items,
      address,
      payment,
      details,
    })
  );

  const [validAddress, setValidAddress] = useState(false);
  const [validPayment, setValidPayment] = useState(true); // Default to true for now
  const [validPickUpDetails, setValidPickUpDetails] = useState(false);
  const checkoutTitle = items.length > 0 ? 'returns' : 'donate';

  const onReturnConfirm = async () => {
    console.log({
      payment,
      address,
      details,
      items,
    });

    try {
      setPlacingOrder(true);
      setLoading(true);

      const newOrder = {
        orderItems: items.map((item) => item._id),
        fullName: address.fullName,
        state: address.state,
        zipcode: address.zipCode,
        addressLine1: address.line1,
        addressLine2: address.line2,
        city: address.city,
        phone: address.phoneNumber,
        pickupInstruction: address.instructions,
        pickupDate: details.date,
        pickupTime: details.time,
      };

      const userId = await getUserId();

      const order = await createOrder(userId, newOrder);

      setOrder(order);
      setConfirmed(true);
      setPlacingOrder(false);

      dispatch(clearForm());

      scrollToTop();
      setLoading(false);
      showSuccess({
        message: (
          <div>
            <Box />
            &nbsp;&nbsp;Successfully placed order!
          </div>
        ),
      });
    } catch (error) {
      setPlacingOrder(false);
      setLoading(false);

      // console.log(error.response.data.details);
      showError({
        message: get(
          orderErrors.find(
            ({ details }) => details === error.response.data.details
          ),
          'message',
          'Cannot place order at this time'
        ),
      });
    }
  };

  const onCartRemove = (itemId) => {
    const newItems = items.filter(({ _id }) => itemId !== _id);

    dispatch(setCartItems(newItems));
  };

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
    scrollToTop();
    const platform = window.navigator.platform;
    const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];

    if (windowsPlatforms.indexOf(platform) !== -1) {
      // Windows 10 Chrome
      $('.btn-confirm').css('padding-top', '10px');
    }
  }, []);

  const validOrder =
    validAddress && validPayment && validPickUpDetails && items.length > 0;

  return (
    <div id='CheckoutPage'>
      {isMobile && (
        <MobileCheckoutCard
          confirmed={confirmed}
          onReturnConfirm={onReturnConfirm}
          validOrder={validOrder}
          loading={loading}
        />
      )}
      <div className={`container  ${isMobile ? 'mt-4' : 'mt-6'}`}>
        <div className='row mobile-row'>
          <div className={isMobile ? 'col-sm-12' : 'col-sm-9'}>
            {/*CONTAINS ALL SCANS LEFT CARD OF VIEW SCAN PAGE*/}
            {confirmed && order ? (
              <div>
                <h3 className='sofia-pro text-18 section-title'>
                  Pick-up confirmed
                </h3>
                <div className='confirmed-container'>
                  <PickUpConfirmed orderId={order.id} />
                </div>
              </div>
            ) : (
              <div className='mobile-checkout-col'>
                <PickUpDetails
                  setValidAddress={setValidAddress}
                  setValidPayment={setValidPayment}
                  setValidPickUpDetails={setValidPickUpDetails}
                />
              </div>
            )}

            <div className='col desktop-col'>
              <h3 className='sofia-pro products-return text-18 section-title'>
                Your products to {checkoutTitle}
              </h3>
              {isEmpty(items) && (
                <h4 className='p-0 mb-0 mt-5 d-flex justify-content-center sofia-pro empty-message'>
                  No more products. Click here to go back to &nbsp;
                  <Link
                    style={{
                      textDecoration: 'underline',
                      color: '#570097',
                    }}
                    to='/dashboard'
                  >
                    dashboard
                  </Link>
                  .
                </h4>
              )}

              {items.map((item) => (
                <ProductCard
                  removable={!confirmed}
                  scannedItem={item}
                  key={item.id}
                  item={item}
                  selectable={false}
                  clickable={false}
                  onRemove={onCartRemove}
                  confirmed={confirmed}
                />
              ))}
            </div>

            {/* BILLING */}
            {isMobile && (
              <>
                <div className='mobile-billing'>
                  <div className='m-billing-container mt-5'>
                    <h4>Billing</h4>
                  </div>
                  <div className='card m-billing-card shadow-sm mt-4'>
                    <div className='card-body'>
                      <h4 className='m-size-description'>
                        All products need to fit in a 50” x 30” x 20” box
                      </h4>
                      <button
                        className='btn m-btn-info'
                        onClick={() => setModalSizeGuideShow(true)}
                      >
                        More info
                      </button>
                      <hr style={{ marginTop: '8px' }} />
                      <div className='row mt-3'>
                        <div className='col m-label'>Return total cost</div>
                        <div className='col m-value'>$9.99</div>
                      </div>
                      <div className='row'>
                        <div className='col m-label'>Taxes</div>
                        <div className='col m-value'>$0.70</div>
                      </div>
                      <hr style={{ marginBottom: '21px', marginTop: '8px' }} />
                      <div className='row'>
                        <div className='col m-total-label'>Total paid</div>
                        <div className='col m-total-value'>$10.69</div>
                      </div>
                    </div>
                  </div>
                  <SizeGuideModal
                    show={modalSizeGuideShow}
                    onHide={() => setModalSizeGuideShow(false)}
                  />
                </div>
              </>
            )}

            {/* <h3 className='sofia-pro miss-out section-title'>
              Don&apos;t miss out on other returns
            </h3>
            <div className='row align-items-center p-4 all-checkbox mobile-row'>
              <input
                type='checkbox'
                onChange={handleSelectAll}
                checked={newSelected.length === forgottenReturns.length}
              />
              <h4 className='sofia-pro noted-purple ml-4 mb-0 p-0'>Add all</h4>
            </div> */}
          </div>

          {/* RIGHT CARDS */}
          {!isMobile && (
            <>
              <div className='col-sm-3'>
                <CheckoutCard
                  confirmed={confirmed}
                  onReturnConfirm={onReturnConfirm}
                  validOrder={validOrder}
                  loading={loading}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
