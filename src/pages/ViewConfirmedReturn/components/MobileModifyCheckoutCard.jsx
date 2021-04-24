import React, { useState } from 'react';
import { Row, Col, Spinner } from 'react-bootstrap';
import { useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { updateOrders } from '../../../actions/auth.action';
import SizeGuideModal from '../../../modals/SizeGuideModal';
import CancelOrderModal from '../../../modals/CancelOrderModal';

export default function MobileModifyCheckoutCard({
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
  inReturn,
}) {
  const dispatch = useDispatch();
  const [confirmed, setconfirmed] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [showCancelOrderModal, setShowCancelOrderModal] = useState(false);
  const history = useHistory();

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
    <div id='MobileCheckoutCard'>
      <div className='col m-col'>
        <div className='card shadow-sm'>
          <div className='card-body'>
            <Row>
              <Col>
                <h3 className='m-product-to-return'>
                  {inReturn.length} product to return
                </h3>
              </Col>
            </Row>
            {/* <Row>
              <Col>
                <h3 className='m-box-size-description'>
                  All products need to fit in a 12”W x 12”H x 20”L box
                </h3>
              </Col>
            </Row>
            <Row>
              <Col>
                <button
                  className='btn m-btn'
                  onClick={() => setModalShow(true)}
                >
                  <h3 className='m-btn-info'>More info</h3>
                </button>
              </Col>
            </Row>
            <SizeGuideModal
              show={modalShow}
              onHide={() => setModalShow(false)}
            /> */}
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
                        <h3 className='m-value-label'>
                          Potential Return Value
                        </h3>
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
                {/* <Row>
                  <Col>
                    <h3 className='m-confirmed-desc'>
                      Once the pick-up has been confirmed we’ll take care of
                      contacting your merchants. They will then be in charge of
                      the payment.
                    </h3>
                  </Col>
                </Row> */}
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
                        <h3 className='m-value-label'>
                          Potential Return Value
                        </h3>
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
                {/* <Row>
                  <Col>
                    <h3 className='m-value-label'>Return Total Cost</h3>
                  </Col>
                  <Col>
                    <h3 className='m-cost-value'>${returnFee}</h3>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <h3 className='m-value-label'>Taxes</h3>
                  </Col>
                  <Col>
                    <h3 className='m-cost-value'>${taxes.toFixed(2)}</h3>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <h3 className='m-total-pay'>Total to pay now</h3>
                  </Col>
                  <Col>
                    <h3 className='m-total-value'>${totalPayment}</h3>
                  </Col>
                </Row> */}
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
