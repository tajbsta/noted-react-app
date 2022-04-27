import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { Spinner } from 'react-bootstrap';
import { get } from 'lodash';
import ReturnValueInfoIcon from '../../../components/ReturnValueInfoIcon';

export default function MobileCheckoutCard({
  confirmed,
  loading,
  confirmOrder,
  validOrder = false,
  pricingDetails = {},
  user,
}) {
  // TODO: hookup pricing
  const potentialReturnValue = get(pricingDetails, 'potentialReturnValue', 0);
  const inReturn = get(pricingDetails, 'totalReturns', 0);
  const inDonation = get(pricingDetails, 'totalDonations', 0);
  const inTotalPrice = get(pricingDetails, 'totalPrice', 0);

  return (
    <div id='MobileCheckoutCard'>
      <div className='card shadow-sm' style={{ borderRadius: '0' }}>
        <div className='card-body'>
          <Row>
            <Col>
              <h3 className='m-product-to-return'>
                {inReturn} {inReturn > 1 ? 'products' : 'product'} to return
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
                    <h3 className='m-value-label d-flex'>
                      <span className='my-auto mr-2'>
                        {' '}
                        Potential Return Value
                      </span>{' '}
                      <ReturnValueInfoIcon isMobile />{' '}
                    </h3>
                  </Col>
                </Row>
              </Col>
              <Col>
                <Row>
                  <h3 className='m-value'>{inDonation}</h3>
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
                    onClick={confirmOrder}
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
                        <span>
                          {Number(user?.['custom:user_pickups']) > 0
                            ? '-1 pickup'
                            : `$${inTotalPrice}`}
                        </span>
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
