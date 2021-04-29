import React from 'react';
import { Row, Col } from 'react-bootstrap';

export default function MobileCheckoutCard({
  inReturn,
  confirmed,
  isTablet,
  potentialReturnValue,
  inDonation,
  returnFee,
  taxes,
  totalPayment,
  onReturnConfirm,
}) {
  return (
    <div id='MobileCheckoutCard'>
      <div className='card shadow-sm'>
        <div className='card-body'>
          <Row>
            <Col>
              <h3 className='m-product-to-return'>
                {inReturn.length} product to return
              </h3>
            </Col>
          </Row>
          {confirmed && (
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
            </>
          )}

          {!confirmed && (
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
              <Row>
                <Col>
                  <button
                    className='btn m-btn-confirm'
                    onClick={onReturnConfirm}
                  >
                    Confirm Order
                  </button>
                </Col>
              </Row>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
