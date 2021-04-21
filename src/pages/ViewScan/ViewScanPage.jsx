import React, { useEffect, useState } from 'react';
import ProductCard from '../../components/ProductCard';
import PickUpConfirmed from '../../components/PickUpConfirmed';
import PickUpDetails from './components/PickUpDetails';
import { useDispatch, useSelector } from 'react-redux';
import { get, isEmpty } from 'lodash';
import SizeGuideModal from '../../modals/SizeGuideModal';
import $ from 'jquery';
import { submitOrder } from '../../actions/auth.action';
import { nanoid } from 'nanoid';
import moment from 'moment';
import { clearForm } from '../../actions/runtime.action';
import { setCartItems } from '../../actions/cart.action';
import { Link } from 'react-router-dom';
import { DONATE, RETURNABLE } from '../../constants/actions/runtime';
import { scrollToTop } from '../../utils/window';

function ViewScanPage() {
  const dispatch = useDispatch();
  const [confirmed, setconfirmed] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [newSelected, setNewSelected] = useState([]);
  const scans = useSelector((state) => get(state, 'scans', []));
  const [orderId, setOrderId] = useState('');
  const [isMobile, setIsMobile] = useState(false);
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

  // const totalDonations = inDonation.length;

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

  const handleSelectAll = () => {
    if (newSelected.length === forgottenReturns.length) {
      setNewSelected([]);
    }

    if (newSelected.length !== forgottenReturns.length) {
      setNewSelected([...forgottenReturns.map((scannedItem) => scannedItem)]);
    }
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

  return (
    <div id='ViewScanPage'>
      <div className={`container  ${isMobile ? 'mt-4' : 'mt-6'}`}>
        <div className='row mobile-row'>
          <div className='col-sm-9'>
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
                <PickUpDetails />
              </div>
            )}

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
            <h3 className='sofia-pro miss-out section-title'>
              Don&apos;t miss out on other returns
            </h3>
            <div className='row align-items-center p-4 all-checkbox mobile-row'>
              <input
                type='checkbox'
                onChange={handleSelectAll}
                checked={newSelected.length === forgottenReturns.length}
              />
              <h4 className='sofia-pro noted-purple ml-4 mb-0 p-0'>Add all</h4>
            </div>
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
          <div className='col-sm-3'>
            <div
              className='col right-card'
              style={{
                maxWidth: '248px',
              }}
            >
              <div className='card shadow-sm p-3 pick-up-card'>
                <h3 className='sofia-pro products-to-return mb-1'>
                  {inReturn.length} product to return
                </h3>
                <h3 className='box-size-description'>
                  All products need to fit in a 12”W x 12”H x 20”L box
                </h3>
                <button
                  className='btn btn-more-info'
                  onClick={() => setModalShow(true)}
                >
                  <h3 className='noted-purple sofia-pro more-pick-up-info mb-0'>
                    More info
                  </h3>
                </button>
                <SizeGuideModal
                  show={modalShow}
                  onHide={() => setModalShow(false)}
                />
                <hr className='line-break-1' />
                {confirmed && (
                  <div>
                    <h3 className='sofia-pro pick-up-price mb-0'>
                      ${potentialReturnValue.toFixed(2) || 0.0}
                    </h3>
                    <h3 className='return-type sofia-pro value-label mb-3'>
                      Potential Return Value
                    </h3>
                    <h3 className='sofia-pro pick-up-price mb-0'>
                      {inDonation.length}
                    </h3>
                    <h3 className='return-type sofia-pro value-label'>
                      Donations
                    </h3>
                    <hr className='line-break-1' />
                    <p className='pick-up-reminder sofia-pro'>
                      Once the pick-up has been confirmed we’ll take care of
                      contacting your merchants. They will then be in charge of
                      the payment.
                    </p>
                  </div>
                )}

                {!confirmed && (
                  <>
                    <h3 className='sofia-pro pick-up-price mb-0'>
                      ${potentialReturnValue.toFixed(2) || 0.0}
                    </h3>
                    <h3 className='return-type sofia-pro value-label mb-3'>
                      Potential Return Value
                    </h3>

                    <h3 className='sofia-pro pick-up-price mb-0'>
                      {inDonation.length}
                    </h3>
                    <h3 className='return-type sofia-pro value-label'>
                      Donations
                    </h3>

                    <hr className='line-break-2' />
                    <div className='row'>
                      <div className='col'>
                        <h5 className='sofia-pro text-muted value-label'>
                          Return total cost
                        </h5>
                      </div>
                      <div className='col'>
                        <h5 className='sofia-pro text-right'>${returnFee}</h5>
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col'>
                        <h5 className='sofia-pro text-muted value-label'>
                          Taxes
                        </h5>
                      </div>
                      <div className='col'>
                        <h5 className='sofia-pro text-right'>
                          ${taxes.toFixed(2)}
                        </h5>
                      </div>
                    </div>
                    <hr className='line-break-3' />
                    <div className='row'>
                      <div className='col'>
                        <h5 className='sofia-pro text-muted'>
                          Total to pay now
                        </h5>
                      </div>
                      <div className='col'>
                        <h5 className='sofia-pro text-right total-now'>
                          ${totalPayment}
                        </h5>
                      </div>
                    </div>
                    <div
                      className='btn btn-confirm text-16'
                      style={{
                        background: '#570097',
                        border: 'none',
                      }}
                      onClick={onReturnConfirm}
                    >
                      Confirm Order
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewScanPage;
