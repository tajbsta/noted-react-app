import React, { useEffect, useState } from 'react';
import CheckoutCard from './components/CheckoutCard';
import MobileCheckoutCard from './components/MobileCheckoutCard';
import ProductCard from '../../components/ProductCard';
import PickUpConfirmed from '../../components/PickUpConfirmed';
import PickUpDetails from './components/PickUpDetails';
import { useDispatch, useSelector } from 'react-redux';
import { get, isEmpty } from 'lodash';
import $ from 'jquery';
import { submitOrder } from '../../actions/auth.action';
import { nanoid } from 'nanoid';
import moment from 'moment';
import { clearForm } from '../../actions/runtime.action';
import { setCartItems } from '../../actions/cart.action';
import { Link } from 'react-router-dom';
import { DONATE, RETURNABLE } from '../../constants/actions/runtime';
import { scrollToTop } from '../../utils/window';
import SizeGuideModal from '../../modals/SizeGuideModal';

export default function ViewScanPage() {
  const dispatch = useDispatch();
  const [confirmed, setconfirmed] = useState(false);
  const [newSelected, setNewSelected] = useState([]);
  const scans = useSelector((state) => get(state, 'scans', []));
  const [orderId, setOrderId] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [modalSizeGuideShow, setModalSizeGuideShow] = useState(false);
  const { address, payment, details, cart } = useSelector(
    ({
      cart,
      runtime: {
        form: { address, payment, details },
      },
    }) => ({
      cart,
      address,
      payment,
      details,
    })
  );

  const [validAddress, setValidAddress] = useState(false);
  const [validPayment, setValidPayment] = useState(false);
  const [validPickUpDetails, setValidPickUpDetails] = useState(false);

  const inDonation = get(cart, 'items', []).filter(
    ({ category }) => category === DONATE
  );
  const inReturn = get(cart, 'items', []).filter(
    ({ category }) => category === RETURNABLE
  );

  const potentialReturnValue = [...inReturn]
    .map(({ price }) => parseFloat(price))
    .reduce((acc, curr) => (acc += curr), 0);

  const forgottenReturns = [...scans].filter(({ id }) => {
    return ![...inReturn].map(({ id }) => id).includes(id);
  });

  const returnFee = Math.floor(Math.random() * 30) + 20;
  const tax = Math.floor(Math.random() * 0.212343) + 0.1234403;
  const taxes = returnFee * tax;
  const totalPayment = (returnFee + taxes).toFixed(2);
  const checkoutTitle = inReturn.length > 0 ? 'returns' : 'donate';

  useEffect(() => {
    scrollToTop();
    const platform = window.navigator.platform;
    const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];

    if (windowsPlatforms.indexOf(platform) !== -1) {
      // Windows 10 Chrome
      $('.btn-confirm').css('padding-top', '10px');
    }
  }, []);

  const onReturnConfirm = async () => {
    setconfirmed(true);
    /**
     * SUBMIT ORDER HERE
     */
    /**
     * THIS ID GENERATION IS TEMPORARY
     */
    const newUniqueId = `${moment().format('MM-DD-YY-hh:mm')}${nanoid()}`;
    setOrderId(newUniqueId);
    dispatch(
      submitOrder({
        id: newUniqueId,
        payment,
        address,
        details,
        items: [...inReturn, ...newSelected],
        returnFee: returnFee,
        taxes,
      })
    );
    dispatch(clearForm());
    scrollToTop();
  };

  const addSelected = (id) => {
    if (newSelected.map(({ id }) => id).includes(id)) {
      return;
    }
    setNewSelected([
      ...newSelected,
      forgottenReturns.find((item) => item.id === id),
    ]);
  };

  const onCartRemove = (itemId) => {
    const newItems = [
      ...get(cart, 'items', []).filter(({ _id }) => itemId !== _id),
    ];
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
    function handleResize() {
      setIsTablet(window.innerWidth >= 541 && window.innerWidth <= 980);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  const validOrder =
    validAddress &&
    validPayment &&
    validPickUpDetails &&
    (inReturn.length > 0 || inDonation.length > 0);

  return (
    <div id='ViewScanPage'>
      {isMobile && (
        <MobileCheckoutCard
          inReturn={inReturn}
          confirmed={confirmed}
          isTablet={isTablet}
          potentialReturnValue={potentialReturnValue}
          inDonation={inDonation}
          returnFee={returnFee}
          taxes={taxes}
          totalPayment={totalPayment}
          onReturnConfirm={onReturnConfirm}
          validOrder={validOrder}
        />
      )}
      <div className={`container  ${isMobile ? 'mt-4' : 'mt-6'}`}>
        <div className='row mobile-row'>
          <div className={isTablet ? 'col-sm-12' : 'col-sm-9'}>
            {/*CONTAINS ALL SCANS LEFT CARD OF VIEW SCAN PAGE*/}
            {confirmed ? (
              <div className='mobile-view-scan-col'>
                <h3 className='sofia-pro text-18 section-title'>
                  Pick-up confirmed
                </h3>
                <PickUpConfirmed orderId={orderId} />
              </div>
            ) : (
              <div className='mobile-view-scan-col'>
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
              {isEmpty([...inReturn, ...inDonation]) && (
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

              {inReturn.map((item) => (
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

              {inDonation.map((item) => (
                <ProductCard
                  scannedItem={item}
                  key={item.id}
                  selectable={false}
                  clickable={false}
                  item={item}
                  onRemove={onCartRemove}
                  confirmed={confirmed}
                />
              ))}
            </div>

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
                        <div className='col m-value'>$0.00</div>
                      </div>
                      <hr style={{ marginBottom: '21px', marginTop: '8px' }} />
                      <div className='row'>
                        <div className='col m-total-label'>Total paid</div>
                        <div className='col m-total-value'>$9.99</div>
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
            {forgottenReturns.map((item) => (
              <ProductCard
                scannedItem={item}
                key={item.id}
                selected={newSelected.map(({ id }) => id).includes(item.id)}
                addSelected={() => {
                  addSelected(item.id);
                }}
              />
            ))}
          </div>

          {/* RIGHT CARDS */}
          {!isMobile && (
            <>
              <div className='col-sm-3'>
                <CheckoutCard
                  inReturn={inReturn}
                  confirmed={confirmed}
                  isTablet={isTablet}
                  potentialReturnValue={potentialReturnValue}
                  inDonation={inDonation}
                  returnFee={returnFee}
                  taxes={taxes}
                  totalPayment={totalPayment}
                  onReturnConfirm={onReturnConfirm}
                  validOrder={validOrder}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
