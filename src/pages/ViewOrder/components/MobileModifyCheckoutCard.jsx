import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';

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
  const dispatch = useDispatch();
  const [confirmed, setconfirmed] = useState(false);
  const history = useHistory();

  const onConfirm = async () => {
    // if (hasModifications) {
    //   const filteredOrders = [
    //     ...scheduledReturns.filter(({ id }) => id !== scheduledReturnId),
    //     orderInMemory,
    //   ];

    //   dispatch(await updateOrders(filteredOrders));
    //   return setconfirmed(true);
    // }
    history.push('/dashboard');
  };

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
                        <h3 className='m-value-label'>
                          Potential Return Value
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
                        <h3 className='m-value'>
                          {/* ${potentialReturnValue.toFixed(2) || 0.0} */}
                        </h3>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <h3 className='m-value-label'>
                          Potential Return Value
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
                <Row>
                  <Col>
                    <button className='btn m-btn-confirm' onClick={onConfirm}>
                      Confirm Order
                    </button>
                  </Col>
                </Row>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
