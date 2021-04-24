import { get } from 'lodash-es';
import React, { useState } from 'react';
import { Col, Row, Accordion, Card } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import ReturnScore from '../../../components/ReturnsScore';
import ProductPlaceholder from '../../../assets/img/ProductPlaceholder.svg';
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
      <div id='ScheduledReturnProduct'>
        <Row className='mt-4'>
          <Col className='sched-product-col col-9'>
            <div className='sched-img-col'>
              <img
                className='product-img'
                style={{
                  border: '1px solid #f0f0f0',
                  borderRadius: '8px',
                  justifyContent: 'center',
                  width: '48px',
                  height: '48px',
                  background: '#fff',
                }}
                src={thumbnail || ProductPlaceholder}
                onError={(e) => {
                  e.currentTarget.src = ProductPlaceholder;
                }}
              />
            </div>
            <div style={{ marginLeft: '16px' }}>
              <h4 className='sofia-pro sched-distributor-name'>{vendorName}</h4>
              <h4 className='sofia-pro sched-product-name'>{name}</h4>
              <h4 className='sofia-pro sched-product-price'>${price}</h4>
            </div>
          </Col>
          <Col className='sched-vendor-col col-3'>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}
            >
              <Col
                className='ml-0'
                style={{ display: 'flex', alignItems: 'center' }}
              >
                <ReturnScore score={rating} />
              </Col>
              <div className='m-brand-logo-cont'>
                <img
                  src='https://pbs.twimg.com/profile_images/1159166317032685568/hAlvIeYD_400x400.png'
                  alt=''
                  className='m-brand-img'
                />
              </div>
            </div>
          </Col>
        </Row>
      </div>
    );
  };

  const renderScheduledReturn = (scheduledReturn) => {
    const [activeKey, setActiveKey] = useState('1');
    const [showCancelOrderModal, setShowCancelOrderModal] = useState(false);
    const items = get(scheduledReturn, 'items', []);
    const renderAllScheduledItems = items.slice(0, 5).map((product) => {
      return (
        <li key={product}>
          <img
            style={{
              border: '1px solid #f0f0f0',
              borderRadius: '8px',
              justifyContent: 'center',
              width: '48px',
              height: '48px',
              background: '#fff',
            }}
            src={product.thumbnail || ProductPlaceholder}
            onError={(e) => {
              e.currentTarget.src = ProductPlaceholder;
            }}
          />
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
              <div className='card-body initial-card-body'>
                <Row
                  className='align-items-center'
                  style={{ marginLeft: '0px' }}
                >
                  <Col className='title-col'>
                    <div className='title'>Scheduled Return</div>
                    <div className='total'>
                      {get(items, 'length', 0)} items in total
                    </div>
                  </Col>
                  <Col className='product-img-col'>
                    {renderAllScheduledItems}
                  </Col>
                  {items.length > 5 && (
                    <Col className='plus-more'>
                      {items.length > 5 && `+${moreItemsCount} more...`}
                    </Col>
                  )}

                  <Col className='button-col'>
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
                <div style={{ padding: '24px', paddingBottom: '39px' }}>
                  <Row
                    className='align-items-center'
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginLeft: '0px',
                    }}
                  >
                    <Col className='title-col'>
                      <div className='title'>Scheduled Return</div>
                      <div className='total'>1 item total</div>
                    </Col>
                    <Col className='title-col'>
                      <div className='button-col'>
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

                  <div className='sched-info-container'>
                    <Row
                      style={{ marginRight: '0px', justifyContent: 'flex-end' }}
                    >
                      <div className='sched-time-container'>
                        <h4>Pick-up in &nbsp;</h4>
                        <h4 className='sched-value'>{`59 minutes`}</h4>
                      </div>
                    </Row>
                    <Row
                      style={{
                        justifyContent: 'flex-end',
                        marginRight: '0px',
                      }}
                    >
                      <div className='total-items-container'>
                        <h4>Total&nbsp;</h4>
                        <h4 className='sched-value'>{`1 item`}</h4>
                      </div>
                    </Row>

                    <Row
                      className='cancel-action-container'
                      style={{
                        marginRight: '0px',
                      }}
                    >
                      <button
                        className='btn btn-show p-0 m-0'
                        onClick={() => {
                          onCancel();
                        }}
                      >
                        Modify or cancel return
                      </button>
                    </Row>
                  </div>
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
