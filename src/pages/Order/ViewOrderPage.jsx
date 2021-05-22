import React, { useEffect, useState } from 'react';
import { ProgressBar } from 'react-bootstrap';
import { Frown, Plus } from 'react-feather';
import ProductCard from '../../components/ProductCard';
import PickUpConfirmed from '../../components/PickUpConfirmed';
import PickUpCancelled from '../../components/PickUpCancelled';
import PickUpDetails from './modify-components/PickUpDetails';
import { get } from 'lodash';
import $ from 'jquery';
import { useParams } from 'react-router';
import Row from '../../components/Row';
import { scrollToTop } from '../../utils/window';
import ModifyCheckoutCard from './modify-components/ModifyCheckoutCard';
import MobileModifyCheckoutCard from './modify-components/MobileModifyCheckoutCard';
import SizeGuideModal from '../../modals/SizeGuideModal';
import CancelOrderModal from '../../modals/CancelOrderModal';
import { cancelOrder, getOrder } from '../../utils/orderApi';
import { getUserId } from '../../utils/auth';
import { showError, showSuccess } from '../../library/notifications.library';
import { orderErrors } from '../../library/errors.library';

export default function ViewOrderPage() {
  const [confirmed, setConfirmed] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [modalSizeGuideShow, setModalSizeGuideShow] = useState(false);
  const [showCancelOrderModal, setShowCancelOrderModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [order, setOrder] = useState(false);
  const { id: orderId } = useParams();
  const [products, setProducts] = useState([]);
  const [originalProducts, setOriginalProducts] = useState([]);

  const loadOrder = async () => {
    setOrderLoading(true);
    try {
      const data = await getOrder(orderId);
      setProducts(get(data, 'orderItems', []));
      setOriginalProducts(get(data, 'orderItems', []));
      setOrder(data);
      setOrderLoading(false);
    } catch (error) {
      setOrderLoading(false);
      showError({ message: 'Error loading order' });
    }
  };

  const orderDate = get(order, 'pickupDate', '');
  const orderTime = get(order, 'pickupTime', '');

  useEffect(() => {
    loadOrder();
  }, []);

  const ConfirmCancellation = async () => {
    setLoading(true);
    try {
      const userId = await getUserId();
      await cancelOrder(userId, orderId);
      setShowCancelOrderModal(false);
      setLoading(false);
      showSuccess({
        message: (
          <div>
            <Frown />
            &nbsp;&nbsp;Order cancelled successfully!
          </div>
        ),
      });
      setCancelled(true);
    } catch (error) {
      setShowCancelOrderModal(false);
      setLoading(false);
      showError({
        message: get(
          orderErrors.find(
            ({ details }) => details === error.response.data.details
          ),
          'message',
          'Cannot cancel order at this time'
        ),
      });
    }
  };

  const initiateCancelOrder = () => {
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

  const hasModification = () => {
    /**
     * check for changes here
     */
    const productsIds = products.map((product) => get(product, '_id', ''));
    const originalProductsIds = originalProducts.map((product) =>
      get(product, '_id', '')
    );
    const consolidation = originalProductsIds.filter((product) =>
      productsIds.includes(product)
    );

    if (consolidation.length !== originalProductsIds.length) {
      /**
       * change in products detected
       */
      return true;
    }
    return false;
  };
  // const scheduledReturn = hasModifications
  //   ? orderInMemory
  //   : scheduledReturns.find(({ id }) => id === scheduledReturnId);

  // const { returnFee, taxes, address, payment, details } = scheduledReturn;
  // const items = get(scheduledReturn, 'items', []);
  // const orderId = get(scheduledReturn, 'id', '');
  // const inReturn = get(cart, 'items', []).filter(
  //   ({ category }) => category === RETURNABLE
  // );

  // const potentialReturnValue = [...inReturn]
  //   .map(({ price }) => parseFloat(price))
  //   .reduce((acc, curr) => (acc += curr), 0);
  // const totalPayment = (returnFee + taxes).toFixed(2);
  // const forgottenReturns = [...scans].filter(({ id }) => {
  //   return ![...items].map(({ id }) => id).includes(id);
  // });

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

  const removeProduct = (product) => {
    if (products.length !== 1) {
      const { _id: productId } = product;
      /**
       * @function remove from current state items
       */
      return setProducts([...products.filter(({ _id }) => productId !== _id)]);
    }

    return setShowCancelOrderModal(true);
  };

  return (
    <div id='ViewOrderPage'>
      {isMobile && (
        <MobileModifyCheckoutCard
        // inReturn={inReturn}
        // confirmed={confirmed}
        // potentialReturnValue={potentialReturnValue}
        // inDonation={inDonation}
        // returnFee={returnFee}
        // taxes={taxes}
        // totalPayment={totalPayment}
        />
      )}
      <div className={`container ${isMobile ? 'mt-4' : 'mt-6'}`}>
        <div className='row mobile-row'>
          <div className={isMobile ? 'col-sm-12' : 'col-sm-9'}>
            {/*CONTAINS ALL SCANS LEFT CARD OF VIEW SCAN PAGE*/}
            {confirmed || cancelled ? (
              <div>
                <h3 className='sofia-pro text-18 section-title'>
                  Pick-up {cancelled ? 'cancelled' : 'confirmed'}
                </h3>
                <div className='confirmed-container'>
                  {cancelled ? <PickUpCancelled /> : <PickUpConfirmed />}
                </div>
              </div>
            ) : (
              <div className='mobile-checkout-col'>
                <PickUpDetails
                  // address={address}
                  // payment={payment}
                  details={{ date: orderDate, time: orderTime }}
                />
              </div>
            )}

            <div className='col desktop-col'>
              <h3 className='sofia-pro products-return text-18 section-title'>
                {cancelled
                  ? 'Your cancelled products'
                  : 'Your products to return'}
              </h3>

              {orderLoading && (
                <ProgressBar animated striped now={80} className='mt-5 mb-5' />
              )}

              {products.map((product, index) => {
                return (
                  <ProductCard
                    scannedItem={product}
                    key={index}
                    item={product}
                    selectable={false}
                    clickable={false}
                    removable={!confirmed}
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
                <div
                  className='card add-border scanned-item-card max-w-840 mb-3 p-0 btn mobile-view-add-col'
                  // onClick={() => {
                  //   /**
                  //    * @FUNCTION Show products like the one from dashboard
                  //    */
                  //   history.push('/edit-order', { scheduledReturnId });
                  // }}
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
              ))}
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
              </>
            )}
          </div>

          {/* RIGHT CARD */}
          {!isMobile && (
            <>
              <div className='col-1'>
                <ModifyCheckoutCard
                  ConfirmCancellation={ConfirmCancellation}
                  showCancelOrderModal={showCancelOrderModal}
                  setShowCancelOrderModal={setShowCancelOrderModal}
                  initiateCancelOrder={initiateCancelOrder}
                  removeCancelOrderModal={removeCancelOrderModal}
                  loading={loading}
                  cancelled={cancelled}
                  // potentialReturnValue={potentialReturnValue}
                  // inDonation={inDonation}
                  // taxes={taxes}
                  // totalPayment={totalPayment}
                  // isEmpty={isEmpty}
                  // orderInMemory={orderInMemory}
                  hasModifications={hasModification()}
                  // scheduledReturnId={scheduledReturnId}
                  // scheduledReturn={scheduledReturn}
                  // scheduledReturns={scheduledReturns}
                  // updateOrders={updateOrders}
                  // returnFee={returnFee}
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
                  <div className='col m-value'>$9.99</div>
                </div>
                <div className='row'>
                  <div className='col m-label'>Taxes</div>
                  <div className='col m-value'>$0.00</div>
                </div>
                <hr style={{ marginBottom: '21px', marginTop: '8px' }} />
                <div className='row'>
                  <div className='col m-total-label'>Total paid</div>
                  <div className='col m-total-value'>$9.99</div>
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
}
