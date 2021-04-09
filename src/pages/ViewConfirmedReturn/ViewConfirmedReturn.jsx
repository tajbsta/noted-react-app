import React, { useEffect, useState } from 'react';
import { Plus } from 'react-feather';
import ProductCard from '../../components/ProductCard';
import PickUpConfirmed from '../../components/PickUpConfirmed';
import PickUpDetails from './components/PickUpDetails';
import { useDispatch, useSelector } from 'react-redux';
import { get, isEmpty } from 'lodash';
import SizeGuideModal from '../../modals/SizeGuideModal';
import $ from 'jquery';
import CancelOrderModal from '../../modals/CancelOrderModal';
import { updateOrders } from '../../actions/auth.action';
import { useHistory } from 'react-router';
import Row from '../../components/Row';

function ViewConfirmedReturn({
  location: {
    state: { scheduledReturnId, hasModifications = false },
  },
}) {
  const dispatch = useDispatch();
  const [confirmed, setconfirmed] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [showCancelOrderModal, setShowCancelOrderModal] = useState(false);
  const history = useHistory();
  const { inDonation, scheduledReturns, scans, orderInMemory } = useSelector(
    ({
      runtime: { forReturn, lastCall, forDonation, orderInMemory },
      auth: { scheduledReturns },
      scans,
    }) => ({
      localDonationsCount: forDonation.length,
      forReturn,
      lastCall,
      scheduledReturns,
      inReturn: [...forReturn, ...lastCall],
      inDonation: [...forDonation],
      scans,
      orderInMemory,
    })
  );
  // const totalDonations = inDonation.length;

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
  const potentialReturnValue = [...items]
    .map(({ amount }) => parseFloat(amount))
    .reduce((acc, curr) => (acc += curr), 0);
  const totalPayment = (returnFee + taxes).toFixed(2);
  const forgottenReturns = [...scans].filter(({ id }) => {
    return ![...items].map(({ id }) => id).includes(id);
  });

  useEffect(() => {
    if (get(scheduledReturn, 'items', []).length === 0) {
      /**
       * CANCELS ORDER ENTIRELY
       * WILL REDIRECT TO DASHBOARD FOR NOW
       */
      history.push('/dashboard');
    }
  }, [scheduledReturn]);

  const initiateCancelOrder = () => {
    setShowCancelOrderModal(true);
  };

  const onConfirm = async () => {
    /**
     *
     */

    if (hasModifications) {
      const filteredOrders = [
        ...scheduledReturns.filter(({ id }) => id !== scheduledReturnId),
        orderInMemory,
      ];

      dispatch(await updateOrders(filteredOrders));
      return setconfirmed(true);
    }
    history.push('/dashboard');
  };

  return (
    <div id='ViewConfirmReturnPage'>
      <div className='container mt-6'>
        <div className='row'>
          <div className='col-sm-9'>
            {/*CONTAINS ALL SCANS LEFT CARD OF VIEW SCAN PAGE*/}
            {confirmed ? (
              <>
                <h3 className='sofia-pro text-18 section-title'>
                  Pick-up confirmed
                </h3>
                <PickUpConfirmed />
              </>
            ) : (
              <>
                <PickUpDetails
                  address={address}
                  payment={payment}
                  details={details}
                />
                {/**
                 * PICK UP DETAILS
                 */}
              </>
            )}
            <h3 className='sofia-pro products-return text-18 section-title'>
              Your products to return
            </h3>
            {items.map((item) => (
              <ProductCard
                orderId={orderId}
                scannedItem={item}
                key={item.id}
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
                className='card add-border scanned-item-card w-840 mb-3 p-0 btn'
                onClick={() => {
                  /**
                   * @FUNCTION Show products like the one from dashboard
                   */
                  history.push('/edit-order', { scheduledReturnId });
                }}
              >
                <div className='card-body pt-3 pb-3 p-0 m-0'>
                  <Row className='add-row'>
                    <div
                      className='col-sm-1 product-img-container add-product-container'
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: 60,
                      }}
                    >
                      <Plus />
                    </div>
                    <div className='col-sm-4 p-0 p-details'>
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
          {/**
           * @START OF RIGHT CARD
           */}
          <div className='col-sm-3'>
            <div
              className='col right-card'
              style={{
                maxWidth: '248px',
              }}
            >
              <div
                className={`card shadow-sm p-3 pick-up-card ${
                  confirmed == true ? 'h-292' : 'h-400'
                }`}
              >
                <h3 className='sofia-pro products-to-return mb-1'>
                  {items.length} product to return
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

                <hr className='line-break-1' />

                <div>
                  <h3 className='sofia-pro pick-up-price mb-0'>
                    ${potentialReturnValue.toFixed(2) || 0.0}
                  </h3>
                  <h3 className='return-type sofia-pro value-label'>
                    Potential Return Value
                  </h3>
                  {confirmed && (
                    <p className='pick-up-reminder sofia-pro'>
                      Once the pick-up has been confirmed we’ll take care of
                      contacting your merchants. They will then be in charge of
                      the payment.
                    </p>
                  )}
                </div>
                {!confirmed && (
                  <>
                    {/* <h2 className='sofia-pro mb-0 donate-quantity'>1</h2>
                    <h5 className='sofia-pro text-muted value-label'>
                      Donation
                    </h5> */}

                    {inDonation.length > 0 && (
                      <>
                        <h3 className='sofia-pro pick-up-price mb-0'>
                          {inDonation.length}
                        </h3>
                        <h3 className='return-type sofia-pro value-label'>
                          Donation
                        </h3>
                      </>
                    )}
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
                        <h5 className='sofia-pro text-muted'>Total paid</h5>
                      </div>
                      <div className='col'>
                        <h5 className='sofia-pro text-right total-now'>
                          ${totalPayment}
                        </h5>
                      </div>
                    </div>

                    <hr />
                    <div className='row'>
                      <div className='col'>
                        <button
                          className='btn btn-more-info'
                          onClick={initiateCancelOrder}
                        >
                          <h3 className='noted-red sofia-pro cancel-order mb-0'>
                            Cancel order
                          </h3>
                        </button>
                        <h3 className='cancel-info'>
                          Canceling pick-ups less than 4h before schedule will
                          result in a $5 penalty
                        </h3>
                        <a
                          style={{ textDecoration: 'underline' }}
                          className='cancel-info'
                        >
                          More info
                        </a>
                      </div>
                    </div>
                    {!isEmpty(orderInMemory) && hasModifications && (
                      <div
                        className='btn mt-2'
                        style={{
                          background: '#570097',
                          border: 'none',
                          color: '#FFFFFF',
                        }}
                        onClick={onConfirm}
                      >
                        Confirm
                      </div>
                    )}

                    {!isEmpty(orderInMemory) && !hasModifications && (
                      <div
                        className='btn noted-purple mt-2'
                        style={{
                          background: '#EEE4F6',
                          border: 'none',
                          color: '#57009',
                          display: 'flex',
                          alignContent: 'center',
                          justifyContent: 'center',
                        }}
                        onClick={() => history.push('/dashboard')}
                      >
                        No changes
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
          {/**
           * @END RIGHT CARD
           */}
        </div>
      </div>
      {/* MODAL CITY HERE */}
      <SizeGuideModal show={modalShow} onHide={() => setModalShow(false)} />
      <CancelOrderModal
        show={showCancelOrderModal}
        onHide={() => setShowCancelOrderModal(false)}
        onCancel={async () => {
          /**
           * CANCEL ORDER HERE
           */
          /**
           * UPDATE SCHEDULED RETURNS BY FILTER
           */
          const filteredOrders = [
            ...scheduledReturns.filter(({ id }) => id !== scheduledReturnId),
          ];
          dispatch(updateOrders(filteredOrders));
          history.push('/dashboard');
        }}
      />
    </div>
  );
}

export default ViewConfirmedReturn;
