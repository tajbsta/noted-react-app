import { get, isEmpty } from 'lodash-es';
import React, { useState } from 'react';
import { Col, Row, Accordion, Card } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import ReturnScore from '../../../components/ReturnsScore';
import ProductPlaceholder from '../../../assets/img/ProductPlaceholder.svg';
import CancelOrderModal from './../../../modals/CancelOrderModal';
import Collapsible from 'react-collapsible';

export default function ScheduledReturn({ user }) {
  const { push } = useHistory();
  const [isOpen, setIsOpen] = useState(false);
  const { scheduledReturns } = useSelector(
    ({ auth: { scheduledReturns } }) => ({
      scheduledReturns,
    })
  );
  console.log(user);

  const renderScheduledReturnItem = (item) => {
    const vendorName = get(item, 'vendor_name', '');
    const name = get(item, 'name', '');
    const price = get(item, 'price', '');
    const rating = get(item, 'vendor_data.rating', 1);
    const thumbnail = get(item, 'thumbnail', ''); // product img

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
                  // marginLeft: '12px',
                  // marginRight: '12px',
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
              <h4 className='sofia-pro sched-product-price'>
                ${price.toFixed(2)}
              </h4>
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
                  src={item.vendor_data.thumbnail || ProductPlaceholder}
                  onError={(e) => {
                    e.currentTarget.src = ProductPlaceholder;
                  }}
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
          <Card className='mt-4 m-3 ml-4 shadow-sm'>
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
                  <div className='product-img-col col-6'>
                    {renderAllScheduledItems}
                  </div>
                  {items.length > 5 && (
                    <div className='plus-more col-1'>
                      {items.length > 5 && `+${moreItemsCount} more...`}
                    </div>
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
                      <div className='total'>
                        {get(items, 'length', 0)}{' '}
                        {`${get(items, 'length', 0) === 1 ? 'item' : 'items'}`}{' '}
                        in total
                      </div>
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

  const renderEmptiness = () => {
    return (
      <>
        <h5 className='sofia pro empty-message mt-4'>
          Your scheduled return is Empty
        </h5>
        <h5 className='sofia pro empty-submessage mb-5'>
          I&apos;m sorry {user.name || user.email}, I&apos;m afraid there&apos;s
          nothing here. Change that by {''}
          <a href='/dashboard' className='start-returning'>
            start returning.
          </a>
        </h5>
      </>
    );
  };

  return (
    <div id='ScheduledReturn'>
      <div className='row'>
        <Collapsible
          open={isOpen}
          onTriggerOpening={() => setIsOpen(true)}
          onTriggerClosing={() => setIsOpen(false)}
          trigger={
            <div className='triggerContainer ml-3'>
              <h3 className='sofia-pro text-18 mb-3-profile mb-0 triggerText'>
                Your scheduled return
              </h3>
              <span className='triggerArrow'>{isOpen ? '▲' : '▼'} </span>
            </div>
          }
        >
          {scheduledReturns.map((scheduledReturn) => {
            return renderScheduledReturn(scheduledReturn);
          })}
          {/**
           * When there is nothing
           */}
          {isEmpty(scheduledReturns) && renderEmptiness()}
        </Collapsible>
      </div>
    </div>
  );
}
