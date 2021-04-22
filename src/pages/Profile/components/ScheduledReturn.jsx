import { get } from 'lodash-es';
import React, { useState } from 'react';
import { Col, Row, Accordion, Card } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import ReturnScore from '../../../components/ReturnsScore';
import CancelOrderModal from './../../../modals/CancelOrderModal';

export default function ScheduledReturn() {
  const { push } = useHistory();
  const { scheduledReturns } = useSelector(
    ({ auth: { scheduledReturns } }) => ({
      scheduledReturns,
    })
  );

  const renderScheduledReturnItem = (item) => {
    const vendorName = get(item, 'vendor_name', '');
    const name = get(item, 'name', '');
    const price = get(item, 'price', '');
    const rating = get(item, 'vendor_data.rating', 1);
    const thumbnail = get(item, 'thumbnail', '');

    return (
      <Row className='mt-4'>
        <Col xs={1}>
          <img src={thumbnail} />
        </Col>
        <Col className='ml-4 mt-2'>
          <Row>
            <h4 className='mb-0 sofia-pro mb-1 distributor-name text-18'>
              {vendorName}
            </h4>
          </Row>
          <Row>
            <h5 className='sofia-pro mb-2 product-name'>{name}</h5>
          </Row>
          <Row>
            <h4 className='sofia-pro mb-0 product-price text-18'>${price}</h4>
          </Row>
        </Col>
        <Col xs={1} className='mr-4'>
          <Row>
            <Col
              className='ml-0'
              xs={1}
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <ReturnScore score={rating} />
            </Col>
            <Col xs={1}>
              <div className='m-brand-logo-cont'>
                <img src={thumbnail} alt='' className='m-brand-img' />
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  };

  const renderScheduledReturn = (scheduledReturn) => {
    const [activeKey, setActiveKey] = useState('1');
    const [showCancelOrderModal, setShowCancelOrderModal] = useState(false);
    const items = get(scheduledReturn, 'items', []);
    const renderAllScheduledItems = items.slice(0, 5).map((product) => {
      return (
        <li key={product}>
          <img src={product.thumbnail} />
        </li>
      );
    });

    const moreItemsCount = get(items, 'length', 0) - 5;

    const onCancel = () => {
      push('/view-return', { scheduledReturnId: scheduledReturn.id });
    };

    const onHide = () => {
      setShowCancelOrderModal(false);
    };

    return (
      <div className='row'>
        <Accordion
          className='accordion-container'
          defaultActiveKey='1'
          activeKey={activeKey}
        >
          <Card>
            <CancelOrderModal
              show={showCancelOrderModal}
              onHide={onHide}
              onCancel={onCancel}
            />
            {activeKey === '1' && (
              <div className='card-body'>
                <Row className='align-items-center'>
                  <Col xs={2} className='title-col'>
                    <Row>
                      <div className='title'>Scheduled Return</div>
                    </Row>
                    <Row>
                      <div className='total'>
                        {get(items, 'length', 0)} items in total
                      </div>
                    </Row>
                  </Col>
                  <Col className='product-img-col'>
                    {renderAllScheduledItems}
                  </Col>
                  <Col xs={1} className='plus-more'>
                    {items.length > 5 && `+${moreItemsCount} more...`}
                  </Col>
                  <Col xs={3} className='button-col'>
                    <div>
                      <button
                        className='btn btn-show'
                        onClick={() => setActiveKey('0')}
                      >
                        Show details
                      </button>
                      <span className='arrow'>▼</span>
                    </div>
                  </Col>
                </Row>
              </div>
            )}
            <Accordion.Collapse eventKey='0'>
              <div>
                <div className='p-4'>
                  {/**
                   * IS A CARD PRODUCT
                   */}
                  <Row
                    className='align-items-center'
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Col xs={2} className='title-col'>
                      <Row>
                        <div className='title'>Scheduled Return</div>
                      </Row>
                      <Row>
                        <div className='total'>1 item total</div>
                      </Row>
                    </Col>
                    <Col xs={2} className='title-col'>
                      <div className='button-col mr-3'>
                        <button
                          className='btn btn-show'
                          onClick={() => setActiveKey('1')}
                        >
                          Hide details
                        </button>
                        <span className='arrow'>▲</span>
                      </div>
                    </Col>
                  </Row>

                  {items.map((item) => renderScheduledReturnItem(item))}
                  <hr className='hr-line' />
                  <Row className='action-container'>
                    <Col xs={2}>
                      <Row className='pick-up-duration-container'>
                        <h5 className='sofia-pro mb-2 product-name'>
                          Pick-up in
                        </h5>
                        <h4 className='sofia-pro product-price mt-1'>{`59 minutes`}</h4>
                      </Row>
                      <Row className='total-items-container'>
                        <h5 className='sofia-pro mb-2 product-name'>Total</h5>
                        <h4 className='sofia-pro product-price mt-1'>{`1 item`}</h4>
                      </Row>
                      <Row className='cancel-action-container'>
                        <button
                          className='btn btn-show p-0 m-0'
                          onClick={() => {
                            setShowCancelOrderModal(true);
                          }}
                        >
                          Cancel return
                        </button>
                      </Row>
                    </Col>
                  </Row>
                </div>
              </div>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      </div>
    );
  };

  return (
    <div id='ScheduledReturn'>
      <h3 className='sofia-pro text-18 mb-3-profile mb-3 triggerText'>
        Your scheduled return
      </h3>
      {scheduledReturns.map((scheduledReturn) => {
        return renderScheduledReturn(scheduledReturn);
      })}
    </div>
  );
}
