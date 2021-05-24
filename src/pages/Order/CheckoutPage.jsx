import React, { useEffect, useState } from 'react';
import CheckoutCard from './checkout-components/CheckoutCard';
import MobileCheckoutCard from './checkout-components/MobileCheckoutCard';
import ProductCard from '../../components/Product/ProductCard';
import PickUpConfirmed from '../../components/PickUpDetails/PickUpConfirmed';
import PickUpDetails from './checkout-components/PickUpDetails';
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
import { createOrder, getOrderPricing } from '../../utils/orderApi';
import { getUserId } from '../../utils/auth';
import { orderErrors } from '../../library/errors.library';
import { getProducts } from '../../utils/productsApi';
import { DONATE, LAST_CALL, RETURNABLE } from '../../constants/actions/runtime';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe } from '@stripe/react-stripe-js';
import {
  getPublicKey,
  getUserPaymentMethods,
  createPaymentIntent,
} from '../../utils/orderApi';
import PRICING from '../../constants/pricing';

const Checkout = () => {
  const stripe = useStripe();
  const dispatch = useDispatch();
  const [confirmed, setConfirmed] = useState(false);
  const [order, setOrder] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [modalSizeGuideShow, setModalSizeGuideShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otherReturns, setOtherReturns] = useState([]);
  const [isFetchingPrice, setIsFetchingPrice] = useState(false);
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
  // console.log(items)
  const [validAddress, setValidAddress] = useState(false);
  const [validPayment, setValidPayment] = useState(false);
  const [validPickUpDetails, setValidPickUpDetails] = useState(false);
  const checkoutTitle = items.length > 0 ? 'return' : 'donate';
  const [pricingDetails, setPricingDetails] = useState({
    potentialReturnValue: 0,
    price: 0,
    tax: 0,
    totalDonations: 0,
    totalPrice: 0,
    totalReturns: 0,
  });

  /**GET PRICING DETAILS */
  const getPricingDetails = async () => {
    const productIds = items.map((item) => item._id);
    setIsFetchingPrice(true);
    const response = await getOrderPricing(productIds, '');
    setIsFetchingPrice(false);
    setPricingDetails(response);
  };

  const placeOrder = async (billingDetails) => {
    try {
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
        paymentIntentId: billingDetails.paymentIntentId,
        productId: billingDetails.productId,
        taxId: billingDetails.taxId,
        priceId: billingDetails.priceId,
        pricing: billingDetails.pricing,
      };

      const userId = await getUserId();

      const order = await createOrder(userId, newOrder);

      setOrder(order);
      setConfirmed(true);

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
      setLoading(false);
      console.log(error);
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

  const confirmOrder = async () => {
    try {
      setLoading(true);
      // Get payment intent from BE, used for getting payment from the user/payment method
      const paymentIntent = await createPaymentIntent(PRICING.STANDARD);

      console.log(paymentIntent);

      // Confirm payment intent using stripe here
      const result = await stripe.confirmCardPayment(
        paymentIntent.clientSecret
      );
      console.log({
        result,
      });
      if (result.error) {
        // Show error to customer
        console.log(result.error.message);
        showError({ message: result.error.message });
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          // Place order - call create order endpoint
          await placeOrder(paymentIntent);
          return;
        }
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      // Handle stripe error e.g. extra user authentication
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

  /**ON MOUNT GET PRICING DETAILS */
  /**GET PRICING WHEN ITEMS CHANGE */
  useEffect(() => {
    getPricingDetails();
  }, [items]);

  const validOrder =
    validAddress && validPayment && validPickUpDetails && items.length > 0;

  async function getMissedOutProducts() {
    try {
      const lastCall = await getProducts({ category: LAST_CALL, size: 2 });
      setOtherReturns(lastCall);
      if (isEmpty(lastCall)) {
        const returnable = await getProducts({ category: RETURNABLE, size: 2 });
        setOtherReturns(returnable);
        if (isEmpty(returnable)) {
          const donate = await getProducts({ category: DONATE, size: 2 });
          setOtherReturns(donate);
        }
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }

  useEffect(() => {
    getMissedOutProducts();
  }, []);

  const RenderOtherReturnables = () => {
    return otherReturns.map((item) => (
      <ProductCard
        removable={false}
        scannedItem={item}
        key={item._id}
        item={item}
        selectable={false}
        clickable={false}
      />
    ));
  };

  return (
    <div id='CheckoutPage'>
      {isMobile && (
        <MobileCheckoutCard
          confirmed={confirmed}
          confirmOrder={confirmOrder}
          validOrder={validOrder}
          loading={loading}
          pricingDetails={pricingDetails}
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
                  key={item._id}
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
                        All products need to fit in a 50&quot; x 30&quot; x
                        20&quot; box
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
                        <div className='col m-value'>
                          ${pricingDetails.price}
                        </div>
                      </div>
                      <div className='row'>
                        <div className='col m-label'>Taxes</div>
                        <div className='col m-value'>${pricingDetails.tax}</div>
                      </div>
                      <hr style={{ marginBottom: '21px', marginTop: '8px' }} />
                      <div className='row'>
                        <div className='col m-total-label'>Total paid</div>
                        <div className='col m-total-value'>
                          ${pricingDetails.totalPrice}
                        </div>
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

            <h3 className='sofia-pro miss-out section-title'>
              Don&apos;t miss out on other returns
            </h3>
            {/* <div className='row align-items-center p-4 all-checkbox mobile-row'>
              <input
              // type='checkbox'
              // onChange={handleSelectAll}
              // checked={newSelected.length === forgottenReturns.length}
              />
              <h4 className='sofia-pro noted-purple ml-4 mb-0 p-0'>Add all</h4>
            </div> */}
            {RenderOtherReturnables()}
          </div>

          {/* RIGHT CARDS */}
          {!isMobile && (
            <>
              <div className='col-sm-3'>
                <CheckoutCard
                  confirmed={confirmed}
                  confirmOrder={confirmOrder}
                  validOrder={validOrder}
                  loading={loading}
                  pricingDetails={pricingDetails}
                  isFetchingPrice={isFetchingPrice}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export const CheckoutPage = () => {
  const [stripePromise, setStripePromise] = useState(null);

  const loadStripeComponent = async () => {
    const key = await getPublicKey();
    const stripePromise = loadStripe(key);
    setStripePromise(stripePromise);
  };

  // Fetch stripe publishable api key
  useEffect(() => {
    loadStripeComponent();
  }, []);

  return (
    <Elements stripe={stripePromise} showIcon={true}>
      <Checkout />
    </Elements>
  );
};
