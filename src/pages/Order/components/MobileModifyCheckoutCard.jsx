import React from 'react';
import { Row, Col, Spinner } from 'react-bootstrap';
import { useHistory } from 'react-router';
import { get } from 'lodash';
import ReturnValueInfoIcon from '../../../components/ReturnValueInfoIcon';

export default function MobileModifyCheckoutCard({
  pricingDetails,
  hasModifications,
  ConfirmUpdate,
  confirmed,
  loading,
}) {
  const potentialReturnValue = get(pricingDetails, 'potentialReturnValue', 0);
  const inReturn = get(pricingDetails, 'totalReturns', 0);
  const inDonation = get(pricingDetails, 'totalDonations', 0);
  const history = useHistory();

  return (
    <div id='MobileModifyCheckoutCard'>
      <div className='card shadow-sm' style={{ borderRadius: '0' }}>
        <div className='card-body'>
          <Row>
            <Col>
              <h3 className='m-product-to-return'>
                {inReturn} {inReturn > 1 ? 'products' : 'product'} to return
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
                      <h3 className='m-value-label d-flex'>
                        <span className=' my-auto mr-2'>
                          Potential Return Value
                        </span>
                        <ReturnValueInfoIcon isMobile />
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
                      <h3 className='m-value-label d-flex'>
                        <span className=' my-auto mr-2'>
                          Potential Return Value
                        </span>
                        <ReturnValueInfoIcon isMobile />
                      </h3>
                    </Col>
                  </Row>
                </Col>
                <Col>
                  <Row>
                    <h3 className='m-value mb-2'>{inDonation}</h3>
                  </Row>
                  <Row>
                    <h3 className='m-value-label'>Donations</h3>
                  </Row>
                </Col>
              </Row>
              {hasModifications && !confirmed && (
                <Row>
                  <Col>
                    <button
                      className='btn m-btn-confirm'
                      onClick={ConfirmUpdate}
                      style={{
                        opacity: loading ? '0.6' : '1',
                        justifyContent: loading ? 'center' : 'space-between',
                      }}
                    >
                      {loading ? (
                        <Spinner
                          animation='border'
                          size='sm'
                          className='spinner btn-spinner'
                        />
                      ) : (
                        'Update Changes'
                      )}
                    </button>
                  </Col>
                </Row>
              )}
              {!hasModifications && !confirmed && (
                <div
                  className='btn btn-no-changes noted-purple mt-3'
                  style={{
                    background: '#EEE4F6',
                    border: 'none',
                    color: '#570097',
                    display: 'flex',
                    alignContent: 'center',
                    justifyContent: 'flex-start',
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
  );
}
