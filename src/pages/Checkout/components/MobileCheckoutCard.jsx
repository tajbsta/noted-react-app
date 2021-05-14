import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { Spinner } from 'react-bootstrap';

export default function MobileCheckoutCard({
  confirmed,
  loading,
  onReturnConfirm,
  validOrder = false,
}) {
  // TODO: hookup pricing
  const inReturn = [];
  const potentialReturnValue = 123;
  const inDonation = [];
  const returnFee = 123;
  const taxes = 123;
  const totalPayment = 123;

  return (
    <div id='MobileCheckoutCard'>
      <div className='card shadow-sm' style={{ borderRadius: '0' }}>
        <div className='card-body'>
          <Row>
            <Col>
              <h3 className='m-product-to-return'>
                {inReturn.length} {inReturn.length > 1 ? 'products' : 'product'}{' '}
                to return
              </h3>
            </Col>
          </Row>
          <>
            <Row>
              <Col>
                <Row>
                  <Col>
                    <h3 className='m-value'>
                      ${potentialReturnValue.toFixed(2) || 0.0}
                    </h3>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <h3 className='m-value-label'>Potential Return Value</h3>
                  </Col>
                </Row>
              </Col>
              <Col>
                <Row>
                  <h3 className='m-value'>{inDonation.length}</h3>
                </Row>
                <Row>
                  <h3 className='m-value-label'>Donations</h3>
                </Row>
              </Col>
            </Row>
            {!confirmed && (
              <Row>
                <Col>
                  <button
                    className={`btn ${loading ? 'm-loader' : 'm-btn-confirm'}`}
                    onClick={onReturnConfirm}
                    disabled={!validOrder || loading}
                  >
                    {loading ? (
                      <Spinner
                        animation='border'
                        size='sm'
                        className='spinner btn-spinner'
                      />
                    ) : (
                      <>
                        <span>Confirm Order</span>
                        <span>$9.99</span>
                      </>
                    )}
                  </button>
                </Col>
              </Row>
            )}
          </>
        </div>
      </div>
    </div>
  );
}
