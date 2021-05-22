import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useHistory } from 'react-router';
import ReturnValueInfoIcon from '../../../components/ReturnValueInfoIcon';

export default function MobileModifyCheckoutCard() {
  //   {
  //   potentialReturnValue,
  //   inDonation,
  //   taxes,
  //   totalPayment,
  //   items,
  //   isEmpty,
  //   orderInMemory,
  //   hasModifications,
  //   scheduledReturn,
  //   scheduledReturns,
  //   scheduledReturnId,
  //   updateOrders,
  //   returnFee,
  //   inReturn,
  // }
  const [confirmed, setConfirmed] = useState(false);
  const history = useHistory();

  return (
    <div id='MobileCheckoutCard'>
      <div className='col m-col'>
        <div className='card shadow-sm' style={{ borderRadius: '0' }}>
          <div className='card-body'>
            <Row>
              <Col>
                <h3 className='m-product-to-return'>
                  {/* {inReturn.length}{' '}
                  {inReturn.length > 1 ? 'products' : 'product'} to return */}
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
                          {/* ${potentialReturnValue.toFixed(2) || 0.0} */}
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
                      <h3 className='m-value'>{/* {inDonation.length} */}</h3>
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
                        <h3 className='m-value'>$100</h3>
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
                      <h3 className='m-value'>1</h3>
                    </Row>
                    <Row>
                      <h3 className='m-value-label'>Donations</h3>
                    </Row>
                  </Col>
                </Row>
                {/* <Row>
                  <Col>
                    <button className='btn m-btn-confirm'>Confirm Order</button>
                  </Col>
                </Row> */}
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
