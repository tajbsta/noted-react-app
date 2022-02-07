import React, { useEffect, useState } from 'react';
import CheckoutCard from './components/CheckoutCard';
import MobileCheckoutCard from './components/MobileCheckoutCard';
import ProductCard from '../../components/Product/ProductCard';
import PickUpConfirmed from '../../components/PickUpDetails/PickUpConfirmed';
import PickUpDetails from './components/PickUpDetails';
import { useDispatch, useSelector } from 'react-redux';
import { get, isEmpty } from 'lodash';
import $ from 'jquery';
import { clearCart } from '../../actions/cart.action';
import { setCartItems } from '../../actions/cart.action';
import { Link } from 'react-router-dom';
import { scrollToTop } from '../../utils/window';
import SizeGuideModal from '../../modals/SizeGuideModal';
import { showError, showSuccess } from '../../library/notifications.library';
import { Box } from 'react-feather';
import { createOrder, getOrderPricing } from '../../api/orderApi';
import { orderErrors } from '../../library/errors.library';
import { getOtherReturnProducts } from '../../api/productsApi';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe } from '@stripe/react-stripe-js';
import * as Sentry from '@sentry/react';
import {
  getPublicKey,
  createPaymentIntent,
  createSubscriptionPaymentIntent,
  prevalidateOrder,
} from '../../api/orderApi';
import PRICING from '../../constants/pricing';
import { STRIPE_PAYMENT_INSUFFICIENT_FUNDS } from '../../constants/errors/errorCodes';
import DonateSection from './components/DonateSection';
import { DONATE } from '../../constants/actions/runtime';
import UserInfo from '../Profile/components/UserInfo';
import { getUserId, getUser } from '../../api/auth';

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
  const { pickupAddress: address, pickupDetails: details, items } = useSelector(
    ({ cart: { items, pickupAddress, payment, pickupDetails } }) => ({
      items,
      pickupAddress,
      payment,
      pickupDetails,
    })
  );
  const [validAddress, setValidAddress] = useState(false);
  const [validPayment, setValidPayment] = useState(false);
  const [validPickUpDetails, setValidPickUpDetails] = useState(false);
  const [pricingDetails, setPricingDetails] = useState({
    potentialReturnValue: 0,
    price: 0,
    tax: 0,
    totalDonations: 0,
    totalPrice: 0,
    totalReturns: 0,
  });
  const [itemsToDonate, setItemsToDonate] = useState([]);
  const [itemsToReturn, setItemsToReturn] = useState([]);
  const [selectedDonationOrg, setSelectedDonationOrg] = useState({});
  const [user, setUser] = useState('');

  /**HANDLE SELECT DONATION ORGANIZATION */
  const handleSelectDonationOrg = (org) => {
    if (!org) {
      setSelectedDonationOrg({});
      return;
    }

    setSelectedDonationOrg(org);
  };

  /**GET PRICING DETAILS */
  const getPricingDetails = async () => {
    const productIds = items.map((item) => item._id);
    setIsFetchingPrice(true);
    const response = await getOrderPricing(productIds, '');
    setIsFetchingPrice(false);
    setPricingDetails(response);
  };

  const placeOrder = async (newOrder) => {
    setLoading(true);

    if (!(Number(user?.['custom:no_of_pickups']) > 0)) {
      const order = await createOrder(newOrder);
      setOrder(order);
    } else {
      setOrder(newOrder);
    }

    setConfirmed(true);

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
  };

  const confirmOrder = async () => {
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
        pickupSlot: details.slot,
        donationOrg: get(selectedDonationOrg, 'code', ''),
      };

      // Pre validate order and get the assigned order id
      const orderId = await prevalidateOrder(newOrder);

      newOrder.id = orderId;

      if (!(Number(user?.['custom:no_of_pickups']) > 0)) {
        // Get payment intent from BE, used for getting payment from the user/payment method
        const paymentIntent = await createPaymentIntent(
          PRICING.STANDARD,
          orderId
        );

        newOrder.billing = {
          paymentIntentId: paymentIntent.paymentIntentId,
          paymentMethodId: paymentIntent.paymentMethodId,
          productId: paymentIntent.productId,
          taxId: paymentIntent.taxId,
          priceId: paymentIntent.priceId,
          pricing: paymentIntent.pricing,
        };

        // Confirm payment intent using stripe here
        const result = await stripe.confirmCardPayment(
          paymentIntent.clientSecret
        );

        if (result.error) {
          setLoading(false);

          // Show error to customer
          if (
            result.error.code === 'card_declined' &&
            result.error.decline_code === 'insufficient_funds'
          ) {
            showError({
              message: get(
                orderErrors.find(
                  ({ code }) => code === STRIPE_PAYMENT_INSUFFICIENT_FUNDS
                ),
                'message',
                'Cannot place order at this time'
              ),
            });
          } else {
            showError({ message: result.error.message });
          }
        } else {
          if (result.paymentIntent.status === 'succeeded') {
            // Place order - call create order endpoint
            await placeOrder(newOrder);
            return;
          } else {
            throw new Error('Unknown Error');
          }
        }
      } else {
        newOrder.billing = {
          paymentMethod: 'subscription',
        };

        const result = await createSubscriptionPaymentIntent(newOrder);

        if (result.status === 'success') {
          // Place order - call create order endpoint

          await placeOrder(result.data);
          return;
        } else {
          throw new Error('Unknown Error');
        }
      }
    } catch (error) {
      // console.log(error);
      setLoading(false);
      showError({
        message: get(
          orderErrors.find(({ code }) => code === error.response.data.details),
          'message',
          'Cannot place order at this time'
        ),
      });

      Sentry.captureException(error);
    }
  };

  const onCartRemove = (itemId) => {
    const newItems = items.filter(({ _id }) => itemId !== _id);

    dispatch(setCartItems(newItems));
  };

  useEffect(() => {
    (async () => {
      const user = await getUser();
      setUser(user);
    })();
  }, []);

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
    if (items.length > 0) {
      getPricingDetails();
    } else {
      setPricingDetails({
        potentialReturnValue: 0,
        price: 0,
        tax: 0,
        totalDonations: 0,
        totalPrice: 0,
        totalReturns: 0,
      });
    }
  }, [items]);

  // Clear cart on destroy
  useEffect(() => () => dispatch(clearCart()), []);

  const checkDonation = () => {
    if (itemsToDonate.length <= 0) {
      return true;
    }

    const orgCode = get(selectedDonationOrg, 'code', '');
    if (orgCode) {
      return true;
    }
    return false;
  };

  const donationOrgIsValid = checkDonation();

  const validOrder =
    validAddress &&
    validPayment &&
    validPickUpDetails &&
    items.length > 0 &&
    donationOrgIsValid;

  async function getMissedOutProducts() {
    try {
      const otherProducts = await getOtherReturnProducts(
        2,
        items.map((item) => item._id)
      );
      setOtherReturns(otherProducts);
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
        clickable={true}
        selected={false}
      />
    ));
  };

  useEffect(() => {
    const donations = [];
    const notDonations = [];
    items.forEach((item) => {
      if (item.category === DONATE) {
        donations.push(item);
        return;
      }
      notDonations.push(item);
    });
    setItemsToDonate(donations);
    setItemsToReturn(notDonations);
  }, [items]);

  return (
    <div id='CheckoutPage'>
      {isMobile && (
        <MobileCheckoutCard
          confirmed={confirmed}
          confirmOrder={confirmOrder}
          validOrder={validOrder}
          loading={loading}
          pricingDetails={pricingDetails}
          user={user}
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
                  <PickUpConfirmed
                    order={order}
                    donationOrg={selectedDonationOrg}
                  />
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
                Your products for pickup
              </h3>
              {isEmpty(itemsToReturn) && (
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

              {itemsToReturn.map((item) => (
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

            <DonateSection
              items={itemsToDonate}
              confirmed={confirmed}
              onCartRemove={onCartRemove}
              handleSelectDonationOrg={handleSelectDonationOrg}
            />

            {items.length > 0 && otherReturns.length > 0 && (
              <>
                <h3 className='sofia-pro miss-out section-title'>
                  Don&apos;t miss out on other returns
                </h3>
                {RenderOtherReturnables()}
              </>
            )}

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
                      <hr
                        style={{
                          marginBottom: '21px',
                          marginTop: '8px',
                        }}
                      />
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
                  user={user}
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
