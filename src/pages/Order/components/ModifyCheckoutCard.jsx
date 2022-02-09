import React, { useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { useHistory } from 'react-router';
import SizeGuideModal from '../../../modals/SizeGuideModal';
import CancelOrderModal from '../../../modals/CancelOrderModal';
import { get } from 'lodash';
import ReturnValueInfoIcon from '../../../components/ReturnValueInfoIcon';
import OverlayLoader from '../../../components/OverlayLoader';

export default function ModifyCheckoutCard({
  showCancelOrderModal,
  ConfirmCancellation,
  ConfirmUpdate,
  initiateCancelOrder,
  removeCancelOrderModal,
  loading,
  cancelled,
  hasModifications,
  pricingDetails = {},
  isFetchingPrice,
  confirmed,
  user,
}) {
  const potentialReturnValue = get(pricingDetails, 'potentialReturnValue', 0);
  const inReturn = get(pricingDetails, 'totalReturns', 0);
  const inDonation = get(pricingDetails, 'totalDonations', 0);
  const inTaxes = get(pricingDetails, 'tax', 0);
  const inTotalPrice = get(pricingDetails, 'totalPrice', 0);
  const inPrice = get(pricingDetails, 'price', 0);
  const [modalShow, setModalShow] = useState(false);
  const history = useHistory();

  return (
    <div id='ModifyCheckoutCard'>
      <div>
        <div
          className='position-relative'
          style={{
            width: '248px',
          }}
        >
          <OverlayLoader loading={isFetchingPrice} />
          <div
            className={`card shadow-sm p-3 pick-up-card ${
              confirmed == true ? 'auto' : 'h-400'
            }`}
          >
            <h3 className='sofia-pro products-to-return mb-1'>
              {inReturn} {inReturn > 1 ? 'products' : 'product'} to return
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
              <h3 className='return-type sofia-pro value-label mb-3 d-flex'>
                <span className=' my-auto mr-2'>Potential Return Value</span>
                <ReturnValueInfoIcon />
              </h3>
              <h3 className='sofia-pro pick-up-price mb-0'>{inDonation}</h3>
              <h3 className='return-type sofia-pro value-label'>Donations</h3>
              {confirmed && (
                <>
                  <hr className='line-break-2' />
                  <p className='pick-up-reminder sofia-pro'>
                    Once the pick-up has been confirmed we’ll take care of
                    contacting your merchants. They will then be in charge of
                    the payment.
                  </p>
                </>
              )}
            </div>
            {!confirmed && (
              <>
                <hr className='line-break-2' />
                {Number(user?.['custom:no_of_pickups']) > 0 ? (
                  <>
                    <div className='row'>
                      <div className='col'>
                        <h5 className='sofia-pro text-muted value-label'>
                          Return total cost
                        </h5>
                      </div>
                      <div className='col'>
                        <h5 className='sofia-pro text-right'>${inPrice}</h5>
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
                          ${inTaxes.toFixed(2)}
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
                          ${inTotalPrice}
                        </h5>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className='row'>
                    <div className='col'>
                      <h5 className='sofia-pro text-muted value-label'>
                        Pick-up spent
                      </h5>
                    </div>
                    <div className='col'>
                      <h5 className='sofia-pro text-right'>1</h5>
                    </div>
                  </div>
                )}

                {!cancelled && (
                  <>
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
                          Canceling pick-ups less than 24h before schedule will
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
                  </>
                )}
              </>
            )}

            {hasModifications && !confirmed && (
              <div
                className='btn mt-2'
                style={{
                  background: '#570097',
                  border: 'none',
                  color: '#FFFFFF',
                  opacity: loading ? '0.6' : '1',
                }}
                onClick={ConfirmUpdate}
              >
                {loading && (
                  <Spinner
                    animation='border'
                    size='sm'
                    className='mr-3 spinner btn-spinner'
                    style={{ alignContent: 'center' }}
                  />
                )}
                {loading ? 'Updating' : 'Update Changes'}
              </div>
            )}

            {!hasModifications && !confirmed && (
              <div
                className='btn btn-no-changes noted-purple mt-2'
                style={{
                  background: '#EEE4F6',
                  border: 'none',
                  color: '#570097',
                  display: 'flex',
                  alignContent: 'center',
                  justifyContent: 'center',
                }}
                onClick={() => history.push('/dashboard')}
              >
                No changes
              </div>
            )}
          </div>
        </div>
      </div>
      {/* MODALS */}
      <SizeGuideModal show={modalShow} onHide={() => setModalShow(false)} />
      <CancelOrderModal
        show={showCancelOrderModal}
        onHide={removeCancelOrderModal}
        ConfirmCancellation={ConfirmCancellation}
        initiateCancelOrder={initiateCancelOrder}
        removeCancelOrderModal={removeCancelOrderModal}
        loading={loading}
      />
    </div>
  );
}
