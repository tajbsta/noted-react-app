import React, { useEffect, useState } from 'react';
import SizeGuideModal from '../../../modals/SizeGuideModal';
import { Spinner } from 'react-bootstrap';
import ReturnValueInfoIcon from '../../../components/ReturnValueInfoIcon';
import { get } from 'lodash';
import OverlayLoader from '../../../components/OverlayLoader';

export default function CheckoutCard({
  confirmed,
  onReturnConfirm,
  loading,
  validOrder = false,
  pricingDetails = {},
  isFetchingPrice
}) {
  const [modalShow, setModalShow] = useState(false);

  // TODO: hookup pricing
  const potentialReturnValue = get(pricingDetails, 'potentialReturnValue', 0);
  const inReturn = get(pricingDetails, 'totalReturns', 0);
  const inDonation = get(pricingDetails, 'totalDonations', 0);
  const inTaxes = get(pricingDetails, 'tax', 0)
  const inTotalPrice = get(pricingDetails, 'totalPrice', 0)
  const inPrice = get(pricingDetails, 'price', 0)

  return (
    <div id='CheckoutCard'>
      <div>
        <div
          className='position-relative'
          style={{
            width: '248px',
          }}
        >
          <OverlayLoader loading={isFetchingPrice} />
          <div className='card shadow-sm p-3 pick-up-card'>
            <h3 className='sofia-pro products-to-return mb-1'>
              {inReturn} {inReturn > 1 ? 'products' : 'product'}{' '}
              to return
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
                  {inDonation}
                </h3>
                <h3 className='return-type sofia-pro value-label'>Donations</h3>
                <hr className='line-break-1' />
                <p className='pick-up-reminder sofia-pro'>
                  Once the pick-up has been confirmed we’ll take care of
                  contacting your merchants. They will then be in charge of the
                  payment.
                </p>
              </div>
            )}

            {!confirmed && (
              <>
                <h3 className='sofia-pro pick-up-price mb-0'>
                  ${potentialReturnValue.toFixed(2) || 0.0}
                </h3>
                <h3 className='return-type sofia-pro value-label mb-3 d-flex'>
                  <span className='my-auto mr-2'>Potential Return Value</span>
                  <ReturnValueInfoIcon />
                </h3>

                <h3 className='sofia-pro pick-up-price mb-0'>
                {inDonation}
                </h3>
                <h3 className='return-type sofia-pro value-label'>Donations</h3>

                <hr className='line-break-2' />
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
                    <h5 className='sofia-pro text-muted value-label'>Taxes</h5>
                  </div>
                  <div className='col'>
                    <h5 className='sofia-pro text-right'>${inTaxes}</h5>
                  </div>
                </div>
                <hr className='line-break-3' />
                <div className='row'>
                  <div className='col'>
                    <h5 className='sofia-pro text-muted'>Total to pay now</h5>
                  </div>
                  <div className='col'>
                    <h5 className='sofia-pro text-right total-now'>${inTotalPrice}</h5>
                  </div>
                </div>
                <button
                  disabled={loading}
                  className='btn btn-confirm text-16'
                  style={{
                    background: validOrder ? '#570097' : 'grey',
                    border: 'none',
                    cursor: validOrder ? 'pointer' : 'not-allowed',
                    opacity: loading ? '0.6' : '1',
                  }}
                  onClick={() => {
                    if (validOrder) {
                      onReturnConfirm();
                    }
                  }}
                >
                  {loading && (
                    <Spinner
                      animation='border'
                      size='sm'
                      className='mr-3 spinner btn-spinner'
                    />
                  )}
                  {loading ? 'Confirming' : 'Confirm Order'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
