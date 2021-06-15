import React, { useEffect, useState } from 'react';
import { ProgressBar } from 'react-bootstrap';
import { CheckCircle, Plus } from 'react-feather';
import { useSelector, useDispatch } from 'react-redux';
import ProductCard from '../../components/Product/ProductCard';
import PickUpConfirmed from '../../components/PickUpDetails/PickUpConfirmed';
import PickUpCancelled from '../../components/PickUpDetails/PickUpCancelled';
import PickUpDetails from './components/PickUpDetails';
import { get, isEqual } from 'lodash';
import $ from 'jquery';
import { useHistory, useParams } from 'react-router';
import Row from '../../components/Row';
import { scrollToTop } from '../../utils/window';
import ModifyCheckoutCard from './components/ModifyCheckoutCard';
import MobileModifyCheckoutCard from './components/MobileModifyCheckoutCard';
import SizeGuideModal from '../../modals/SizeGuideModal';
import CancelOrderModal from '../../modals/CancelOrderModal';
import { getUserId } from '../../api/auth';
import { showError, showSuccess } from '../../library/notifications.library';
import { orderErrors } from '../../library/errors.library';
import ReturnValueInfoIcon from '../../components/ReturnValueInfoIcon';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe } from '@stripe/react-stripe-js';
import {
  getPublicKey,
  createPaymentIntent,
  updateOrder,
  cancelOrder,
  getOrder,
  getOrderPricing,
} from '../../api/orderApi';
import { setCartItems, clearCart } from '../../actions/cart.action';
import PRICING from '../../constants/pricing';
import { getOtherReturnProducts } from '../../api/productsApi';
import {
  SERVER_ERROR,
  STRIPE_PAYMENT_INSUFFICIENT_FUNDS,
} from '../../constants/errors/errorCodes';

const ViewOrder = () => {
  const { push } = useHistory();
  const dispatch = useDispatch();
  const stripe = useStripe();
  const [confirmed, setConfirmed] = useState(false);
  const [validAddress, setValidAddress] = useState(false);
  const [validPayment, setValidPayment] = useState(false);
  const [validPickUpDetails, setValidPickUpDetails] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [modalSizeGuideShow, setModalSizeGuideShow] = useState(false);
  const [showCancelOrderModal, setShowCancelOrderModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [order, setOrder] = useState(false);
  const { id: orderIdParams } = useParams();
  const [isFetchingPrice, setIsFetchingPrice] = useState(false);
  const [pricingDetails, setPricingDetails] = useState({
    potentialReturnValue: 0,
    price: 0,
    tax: 0,
    totalDonations: 0,
    totalPrice: 0,
    totalReturns: 0,
  });
  const [otherReturns, setOtherReturns] = useState([]);
  const [hasModifications, setHasModifications] = useState(false);
  const {
    pickupAddress: address,
    payment,
    pickupDetails: details,
    items,
  } = useSelector(
    ({ cart: { items, pickupAddress, payment, pickupDetails } }) => ({
      items,
      pickupAddress,
      payment,
      pickupDetails,
    })
  );
  useEffect(() => {
    if (order) {
      let hasChanges = true;
      const addressFields = [
        'city',
        'fullName',
        'instructions',
        'line1',
        'line2',
        'phoneNumber',
        'state',
        'zipCode',
      ];

      const hasOrderItemsChanges = !isEqual(
        order.orderItems.map((x) => x._id),
        items.map((x) => x._id)
      );

      const hasOrderAddressChanges = !addressFields.every((field) => {
        if (field === 'fullName') {
          return isEqual(order.fullName, address.fullName);
        } else if (field === 'phoneNumber') {
          return isEqual(order.phone, address.phoneNumber);
        } else if (field === 'line1') {
          return isEqual(order.addressLine1, address.line1);
        } else if (field === 'line2') {
          return isEqual(order.addressLine2, address.line2);
        } else if (field === 'city') {
          return isEqual(order.city, address.city);
        } else if (field === 'state') {
          return isEqual(order.state, address.state);
        } else if (field === 'zipcode') {
          return isEqual(order.zipcode, address.zipCode);
        } else if (field === 'instructions') {
          return isEqual(order.pickupInstruction, address.instructions);
        }
        return true;
      });

      const hadOrderPickupDetailsChanges =
        order.pickupDate !== details.date || order.pickupTime !== details.time;

      hasChanges =
        hasOrderItemsChanges ||
        hasOrderAddressChanges ||
        hadOrderPickupDetailsChanges;

      setHasModifications(hasChanges);
    }
  }, [address, payment, details, items]);

  /**GET PRICING DETAILS */
  const getPricingDetails = async () => {
    const initialData = get(order, 'orderItems', []);

    if (initialData.length === 0) {
      return;
    }

    const productIds = initialData.map((item) => item._id);
    setIsFetchingPrice(true);
    const response = await getOrderPricing(productIds, order.id);
    setIsFetchingPrice(false);
    setPricingDetails(response);
  };

  const loadOrder = async () => {
    setOrderLoading(true);
    try {
      const data = await getOrder(orderIdParams);

      if (get(data, 'status', '') === 'cancelled') {
        return push('/profile');
      }

      setOrder(data);
      dispatch(setCartItems(data.orderItems || []));
      setOrderLoading(false);
    } catch (error) {
      setOrderLoading(false);
      showError({ message: 'Error loading order' });
    }
  };

  async function getMissedOutProducts() {
    try {
      const otherProducts = await getOtherReturnProducts(2);
      setOtherReturns(otherProducts);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }

  useEffect(() => {
    getMissedOutProducts();
  }, []);

  useEffect(() => {
    loadOrder();
  }, []);

  useEffect(() => {
    getPricingDetails();
  }, [items]);

  const ConfirmCancellation = async (billing = null) => {
    setLoading(true);
    try {
      const userId = await getUserId();
      await cancelOrder(userId, order.id, billing);
      setShowCancelOrderModal(false);
      setLoading(false);
      showSuccess({
        message: (
          <div>
            <CheckCircle />
            &nbsp;&nbsp;Order cancelled successfully!
          </div>
        ),
      });
      setCancelled(true);
      setConfirmed(true);
      push(`/profile`);
    } catch (error) {
      // console.log(error.response.data);

      let errorCode =
        error.response && error.response.data
          ? error.response.data.details
          : SERVER_ERROR;

      if (
        !billing &&
        error.response &&
        error.response.data &&
        error.response.data.details === 'ORDER_CANCEL_PAYMENT_REQUIRED'
      ) {
        const paymentIntent = await createPaymentIntent(
          PRICING.LATE_CANCEL,
          order.id
        );

        const result = await stripe.confirmCardPayment(
          paymentIntent.clientSecret
        );

        // console.log({
        //   result,
        // });

        if (result.error) {
          // Show error to customer
          if (
            result.error.code === 'card_declined' &&
            result.error.decline_code === 'insufficient_funds'
          ) {
            errorCode = STRIPE_PAYMENT_INSUFFICIENT_FUNDS;
          } else {
            setShowCancelOrderModal(false);
            setLoading(false);
            showError({ message: result.error.message });
            return;
          }
        } else {
          if (result.paymentIntent.status === 'succeeded') {
            const cancelBilling = {
              paymentIntentId: paymentIntent.paymentIntentId,
              paymentMethodId: paymentIntent.paymentMethodId,
              productId: paymentIntent.productId,
              priceId: paymentIntent.priceId,
              pricing: paymentIntent.pricing,
            };
            return ConfirmCancellation(cancelBilling);
          } else {
            throw new Error('Unknown Error');
          }
        }
      }

      setShowCancelOrderModal(false);
      setLoading(false);
      showError({
        message: get(
          orderErrors.find(({ code }) => code === errorCode),
          'message',
          'Cannot cancel order at this time'
        ),
      });
    }
  };

  const ConfirmUpdate = async (billing = null) => {
    // if there is no airtable record
    if (!order.airtableId) {
      showError({ message: 'Cannot update order at this time' });
      return;
    }

    setLoading(true);
    try {
      const userId = await getUserId();
      const updatedOrder = {
        // orderItems: items.map((item) => item._id),
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

      if (billing) {
        updatedOrder.billing = billing;
      }

      await updateOrder(userId, order.id, updatedOrder);
      setOrder({
        id: order.id,
        orderItems: items.map((item) => item._id),
        ...updatedOrder,
      });
      setLoading(false);
      setConfirmed(true);
      showSuccess({
        message: (
          <div>
            <CheckCircle />
            &nbsp;&nbsp;Order updated successfully!
          </div>
        ),
      });
    } catch (error) {
      // console.log(billing);
      let errorCode =
        error.response && error.response.data
          ? error.response.data.details
          : SERVER_ERROR;

      if (
        !billing &&
        error.response &&
        error.response.data &&
        error.response.data.details ===
          'ORDER_RESCHEDULE_PICKUP_PAYMENT_REQUIRED'
      ) {
        const paymentIntent = await createPaymentIntent(
          PRICING.LATE_RESCHEDULE,
          order.id
        );

        const result = await stripe.confirmCardPayment(
          paymentIntent.clientSecret
        );

        // console.log({
        //   result,
        // });

        if (result.error) {
          // Show error to customer
          if (
            result.error.code === 'card_declined' &&
            result.error.decline_code === 'insufficient_funds'
          ) {
            errorCode = STRIPE_PAYMENT_INSUFFICIENT_FUNDS;
          } else {
            setLoading(false);
            showError({ message: result.error.message });
            return;
          }
        } else {
          if (result.paymentIntent.status === 'succeeded') {
            const updateBilling = {
              paymentIntentId: paymentIntent.paymentIntentId,
              paymentMethodId: paymentIntent.paymentMethodId,
              productId: paymentIntent.productId,
              // taxId: paymentIntent.taxId,
              priceId: paymentIntent.priceId,
              pricing: paymentIntent.pricing,
            };
            return ConfirmUpdate(updateBilling);
          } else {
            throw new Error('Unknown Error');
          }
        }
      }

      setLoading(false);
      showError({
        message: get(
          orderErrors.find(({ code }) => code === errorCode),
          'message',
          'Cannot update order at this time'
        ),
      });
    }
  };

  const initiateCancelOrder = () => {
    // if no airtable record
    if (!order.airtableId) {
      showError({ message: 'Cannot cancel order at this time' });
      return;
    }

    setShowCancelOrderModal(true);
  };

  const removeCancelOrderModal = () => {
    setShowCancelOrderModal(false);
  };

  useEffect(() => {
    const platform = window.navigator.platform;
    const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];

    if (windowsPlatforms.indexOf(platform) !== -1) {
      // Windows 10 Chrome
      $('.btn-confirm').css('padding-top', '10px');
    }
  }, []);

  useEffect(() => {
    scrollToTop();
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

  // Clear cart on destroy
  useEffect(() => () => dispatch(clearCart()), []);

  const removeProduct = (product) => {
    if (items.length !== 1) {
      const { _id: productId } = product;
      /**
       * @function remove from current state items
       */
      dispatch(setCartItems([...items.filter(({ _id }) => productId !== _id)]));
      return;
    }

    return setShowCancelOrderModal(true);
  };

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

  return (
    <div id='ViewOrderPage'>
      {isMobile && (
        <MobileModifyCheckoutCard
          pricingDetails={pricingDetails}
          confirmed={confirmed}
          loading={loading}
          hasModifications={hasModifications}
          ConfirmUpdate={() => {
            ConfirmUpdate();
          }}
        />
      )}
      <div className={`container ${isMobile ? 'mt-4' : 'mt-6'}`}>
        <div className='row mobile-row'>
          <div className={isMobile ? 'col-sm-12' : 'col-sm-9'}>
            {/*CONTAINS ALL SCANS LEFT CARD OF VIEW SCAN PAGE*/}
            {confirmed || cancelled ? (
              <div>
                <h3 className='sofia-pro text-18 section-title'>
                  Pick-up {cancelled ? 'cancelled' : 'has been updated'}{' '}
                </h3>
                <div className='confirmed-container'>
                  {cancelled ? (
                    <PickUpCancelled order={order} />
                  ) : (
                    <PickUpConfirmed order={order} isUpdate={true} />
                  )}
                </div>
              </div>
            ) : (
              <div className='mobile-checkout-col'>
                {order && (
                  <PickUpDetails
                    setValidAddress={setValidAddress}
                    setValidPayment={setValidPayment}
                    setValidPickUpDetails={setValidPickUpDetails}
                    order={order}
                  />
                )}
              </div>
            )}

            <div className='col desktop-col'>
              <h3 className='sofia-pro products-return text-18 section-title'>
                {cancelled
                  ? 'Your cancelled products'
                  : 'Your products for pickup'}
              </h3>

              {orderLoading && (
                <ProgressBar animated striped now={80} className='mt-5 mb-5' />
              )}

              {items.map((product, index) => {
                return (
                  <ProductCard
                    scannedItem={product}
                    key={index}
                    item={product}
                    selectable={false}
                    clickable={false}
                    removable={false}
                    onRemove={() => {
                      removeProduct(product);
                    }}
                  />
                );
              })}
            </div>

            {/* ADD PRODUCT BUTTON */}
            {(!orderLoading && !!cancelled) ||
              (!orderLoading && !confirmed && (
                <div className='card add-border scanned-item-card max-w-840 mb-3 p-0 btn mobile-view-add-col'>
                  <div className='card-body pt-3 pb-3 p-0 m-0'>
                    <Row className='add-row'>
                      <div className='col-sm-1 product-img-container add-product-container'>
                        <Plus />
                      </div>
                      <div className='col-sm-4 p-0 p-details m-add-product mb-3'>
                        <Row>
                          <h3 className='add-title mr-2'>Add Products</h3>{' '}
                          <ReturnValueInfoIcon
                            content="We're still working on this"
                            iconClassname='info-icon-small mb-2'
                          />
                        </Row>

                        <h3 className='add-product-info'>
                          (No extra cost if they fit in one box)
                        </h3>
                      </div>
                    </Row>
                  </div>
                </div>
              ))}

            {!loading && items.length > 0 && (
              <>
                <h3 className='sofia-pro miss-out section-title'>
                  Don&apos;t miss out on other returns
                </h3>
                {RenderOtherReturnables()}
              </>
            )}
          </div>

          {/* RIGHT CARD */}
          {!isMobile && (
            <>
              <div className='col-1'>
                <ModifyCheckoutCard
                  ConfirmCancellation={ConfirmCancellation}
                  ConfirmUpdate={() => {
                    ConfirmUpdate();
                  }}
                  showCancelOrderModal={showCancelOrderModal}
                  setShowCancelOrderModal={setShowCancelOrderModal}
                  initiateCancelOrder={initiateCancelOrder}
                  removeCancelOrderModal={removeCancelOrderModal}
                  loading={loading}
                  cancelled={cancelled}
                  pricingDetails={pricingDetails}
                  isFetchingPrice={isFetchingPrice}
                  hasModifications={hasModifications}
                  confirmed={confirmed}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* MOBILE BILLING CARD */}
      {isMobile && (
        <>
          <div className='mobile-billing-order container'>
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
                <hr style={{ marginBottom: '18px', marginTop: '8px' }} />
                <div className='row'>
                  <div className='col m-label'>Return total cost</div>
                  <div className='col m-value'>${pricingDetails.price}</div>
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
                {!cancelled && (
                  <>
                    <hr style={{ marginBottom: '21px', marginTop: '21px' }} />
                    <div className='m-cancel-container'>
                      <button
                        className='btn m-btn-cancel-order'
                        onClick={initiateCancelOrder}
                      >
                        Cancel order
                      </button>
                      <h4 className='m-cancel-sub'>
                        Canceling pick-ups less than 24h before schedule will
                        result in a $5 penalty
                      </h4>
                      <a className='m-info-link'>More info</a>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* MOBILE MODALS */}
          <SizeGuideModal
            show={modalSizeGuideShow}
            onHide={() => setModalSizeGuideShow(false)}
          />
          <CancelOrderModal
            loading={loading}
            show={showCancelOrderModal}
            onHide={removeCancelOrderModal}
            ConfirmCancellation={ConfirmCancellation}
            initiateCancelOrder={initiateCancelOrder}
            removeCancelOrderModal={removeCancelOrderModal}
          />
        </>
      )}
    </div>
  );
};

export const ViewOrderPage = () => {
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
      <ViewOrder />
    </Elements>
  );
};
