import React, { useEffect, useState } from 'react';
import ProductCard from '../components/Dashboard/ProductCard';
import PickUpConfirmed from '../components/ViewConfirmedReturn/PickUpConfirmed';
import PickUpDetails from '../components/ViewConfirmedReturn/PickUpDetails';
import { useDispatch, useSelector } from 'react-redux';
import { get } from 'lodash';
import SizeGuideModal from '../components/Dashboard/modals/SizeGuideModal';
import $ from 'jquery';
import CancelOrderModal from '../components/Dashboard/modals/CancelOrderModal';
import { updateOrders } from '../actions/auth.action';
import { useHistory } from 'react-router';

function ViewConfirmedReturn({
  location: {
    state: { scheduledReturnId },
  },
}) {
  const dispatch = useDispatch();
  const [confirmed, setconfirmed] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [showCancelOrderModal, setShowCancelOrderModal] = useState(false);
  const history = useHistory();

  const { inDonation, scheduledReturns } = useSelector(
    ({
      runtime: { forReturn, lastCall, forDonation },
      auth: { scheduledReturns },
    }) => ({
      scheduledReturns,
      inReturn: [...forReturn, ...lastCall],
      inDonation: [...forDonation],
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

  const scheduledReturn = scheduledReturns.find(
    ({ id }) => id === scheduledReturnId
  );

  const { returnFee, taxes, address, payment } = scheduledReturn;
  const items = get(scheduledReturn, 'items', []);
  const potentialReturnValue = [...items]
    .map(({ amount }) => parseFloat(amount))
    .reduce((acc, curr) => (acc += curr), 0);
  const totalPayment = (returnFee + taxes).toFixed(2);

  const checkoutTitle = items.length > 0 ? 'returns' : 'donate';

  const initiateCancelOrder = () => {
    setShowCancelOrderModal(true);
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
                <PickUpDetails address={address} payment={payment} />
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
                scannedItem={item}
                key={item.id}
                selectable={false}
                clickable={false}
              />
            ))}

            {inDonation.map((item) => (
              <ProductCard
                scannedItem={item}
                key={item.id}
                selectable={false}
                clickable={false}
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
                {/* MODAL CITY HERE */}
                <SizeGuideModal
                  show={modalShow}
                  onHide={() => setModalShow(false)}
                />
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
                      ...scheduledReturns.filter(
                        ({ id }) => id !== scheduledReturnId
                      ),
                    ];
                    console.log(filteredOrders);
                    dispatch(updateOrders(filteredOrders));
                    history.push('/dashboard');
                  }}
                />

                <hr className='line-break-1' />

                {confirmed && (
                  <div>
                    <h3 className='sofia-pro pick-up-price mb-0'>
                      ${potentialReturnValue.toFixed(2) || 0.0}
                    </h3>
                    <h3 className='return-type sofia-pro value-label'>
                      Potential Return Value
                    </h3>
                    <p className='pick-up-reminder sofia-pro'>
                      Once the pick-up has been confirmed we’ll take care of
                      contacting your merchants. They will then be in charge of
                      the payment.
                    </p>
                  </div>
                )}

                <>
                  {/* <h2 className='sofia-pro mb-0 donate-quantity'>1</h2>
                    <h5 className='sofia-pro text-muted value-label'>
                      Donation
                    </h5> */}

                  {items.length > 0 && (
                    <>
                      <h3 className='sofia-pro pick-up-price mb-0'>
                        ${potentialReturnValue.toFixed(2) || 0.0}
                      </h3>
                      <h3 className='return-type sofia-pro value-label'>
                        Potential Return Value
                      </h3>
                    </>
                  )}
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
                        result in a $5 penalty More info
                      </h3>
                    </div>
                  </div>
                </>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewConfirmedReturn;
