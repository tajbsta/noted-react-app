import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';
import SizeGuideModal from '../../../modals/SizeGuideModal';
import CancelOrderModal from '../../../modals/CancelOrderModal';

export default function ModifyCheckoutCard({
  potentialReturnValue,
  inDonation,
  taxes,
  totalPayment,
  items,
  isEmpty,
  orderInMemory,
  hasModifications,
  scheduledReturn,
  scheduledReturns,
  scheduledReturnId,
  updateOrders,
  returnFee,
}) {
  const dispatch = useDispatch();
  const [confirmed, setconfirmed] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [showCancelOrderModal, setShowCancelOrderModal] = useState(false);
  const history = useHistory();

  const initiateCancelOrder = () => {
    setShowCancelOrderModal(true);
  };

  const onConfirm = async () => {
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
    <div id='ModifyCheckoutCard'>
      <div>
        <div
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
              {items.length} {items.length > 1 ? 'products' : 'product'} to
              return
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
                  contacting your merchants. They will then be in charge of the
                  payment.
                </p>
              )}
            </div>
            {!confirmed && (
              <>
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
                    <h5 className='sofia-pro text-muted value-label'>Taxes</h5>
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
              </>
            )}
          </div>
        </div>
      </div>
      {/* MODALS */}
      <SizeGuideModal show={modalShow} onHide={() => setModalShow(false)} />
      <CancelOrderModal
        show={showCancelOrderModal}
        onHide={() => setShowCancelOrderModal(false)}
        onCancel={async () => {
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
