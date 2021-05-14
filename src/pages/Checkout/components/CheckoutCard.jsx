import React, { useState } from 'react'
import SizeGuideModal from '../../../modals/SizeGuideModal'
import { Spinner } from 'react-bootstrap'
import InfoIcon from '../../../components/InfoIcon'

export default function CheckoutCard({
  confirmed,
  isTablet,
  onReturnConfirm,
  loading,
  validOrder = false,
}) {
  const [modalShow, setModalShow] = useState(false)

  // TODO: hookup pricing
  const potentialReturnValue = 123
  const inReturn = []
  const inDonation = []

  return (
    <div id="CheckoutCard">
      <div>
        <div
          style={{
            maxWidth: '248px',
          }}
        >
          <div className="card shadow-sm p-3 pick-up-card">
            <h3 className="sofia-pro products-to-return mb-1">
              {inReturn.length} {inReturn.length > 1 ? 'products' : 'product'}{' '}
              to return
            </h3>
            <h3 className="box-size-description">
              All products need to fit in a 12”W x 12”H x 20”L box
            </h3>
            <button
              className="btn btn-more-info"
              onClick={() => setModalShow(true)}
            >
              <h3 className="noted-purple sofia-pro more-pick-up-info mb-0">
                More info
              </h3>
            </button>
            <SizeGuideModal
              show={modalShow}
              onHide={() => setModalShow(false)}
            />
            <hr className="line-break-1" />
            {confirmed && (
              <div>
                <h3 className="sofia-pro pick-up-price mb-0">
                  ${potentialReturnValue.toFixed(2) || 0.0}
                </h3>
                <h3 className="return-type sofia-pro value-label mb-3">
                  Potential Return Value
                </h3>
                <h3 className="sofia-pro pick-up-price mb-0">
                  {inDonation.length}
                </h3>
                <h3 className="return-type sofia-pro value-label">Donations</h3>
                <hr className="line-break-1" />
                <p className="pick-up-reminder sofia-pro">
                  Once the pick-up has been confirmed we’ll take care of
                  contacting your merchants. They will then be in charge of the
                  payment.
                </p>
              </div>
            )}

            {!confirmed && (
              <>
                <h3 className="sofia-pro pick-up-price mb-0">
                  ${potentialReturnValue.toFixed(2) || 0.0}
                </h3>
                <h3 className="return-type sofia-pro value-label mb-3 d-flex">
                  <span className="my-auto mr-2">Potential Return Value</span>
                  <InfoIcon />
                </h3>

                <h3 className="sofia-pro pick-up-price mb-0">
                  {inDonation.length}
                </h3>
                <h3 className="return-type sofia-pro value-label">Donations</h3>

                <hr className="line-break-2" />
                <div className="row">
                  <div className="col">
                    <h5 className="sofia-pro text-muted value-label">
                      Return total cost
                    </h5>
                  </div>
                  <div className="col">
                    <h5 className="sofia-pro text-right">$9.99</h5>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <h5 className="sofia-pro text-muted value-label">Taxes</h5>
                  </div>
                  <div className="col">
                    <h5 className="sofia-pro text-right">$0.70</h5>
                  </div>
                </div>
                <hr className="line-break-3" />
                <div className="row">
                  <div className="col">
                    <h5 className="sofia-pro text-muted">Total to pay now</h5>
                  </div>
                  <div className="col">
                    <h5 className="sofia-pro text-right total-now">$10.69</h5>
                  </div>
                </div>
                <button
                  disabled={loading}
                  className="btn btn-confirm text-16"
                  style={{
                    background: validOrder ? '#570097' : 'grey',
                    border: 'none',
                    cursor: validOrder ? 'pointer' : 'not-allowed',
                    opacity: loading ? '0.6' : '1',
                  }}
                  onClick={() => {
                    if (validOrder) {
                      onReturnConfirm()
                    }
                  }}
                >
                  {loading && (
                    <Spinner
                      animation="border"
                      size="sm"
                      className="mr-3 spinner btn-spinner"
                    />
                  )}
                  Confirm Order
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
