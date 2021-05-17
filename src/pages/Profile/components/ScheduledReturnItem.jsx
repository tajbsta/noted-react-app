import { get } from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Accordion, Card, Col, Row } from 'react-bootstrap';
import { useHistory } from 'react-router';
import ProductPlaceholder from '../../../assets/img/ProductPlaceholder.svg';
import ReturnScore from '../../../components/ReturnsScore';

export const ScheduledReturnCard = ({ order }) => {
  const [eventKey, setEventKey] = useState('1');
  const { push } = useHistory();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 991);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  const activeKey = '1';
  const items = get(order, 'orderItems', []);
  const renderAllScheduledItems = items.slice(0, 5).map((product) => {
    return (
      <li key={product._id}>
        <img
          className='scheduled-return-item-image'
          style={{
            border: '1px solid #f0f0f0',
            borderRadius: '8px',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            background: '#fff',
            objectFit: 'contain',
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

  const viewOrder = () => {
    push('/order/' + order.id);
  };

  const renderScheduledReturnItem = (item) => {
    const vendorName = get(item, 'vendor_name', '');
    const name = get(item, 'name', '');
    const price = get(item, 'price', '');
    const rating = get(item, 'vendor_data.rating', 1);
    const thumbnail = get(item, 'thumbnail', ''); // product img
    const category = get(item, 'category', '');

    const formattedPrice = price.toFixed(2);

    return (
      <div id='ScheduledReturnProduct'>
        <Row className='mt-4'>
          <Col className='sched-product-col col-9'>
            <div className='sched-img-col'>
              <img
                className='product-img scheduled-return-item-image'
                style={{
                  border: '1px solid #f0f0f0',
                  borderRadius: '8px',
                  justifyContent: 'center',
                  width: '48px',
                  height: '48px',
                  background: '#fff',
                  objectFit: 'contain',
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
                {category == 'DONATE' ? 'Donate' : `$${formattedPrice}`}
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

  return (
    <div className='row' key={order.id}>
      <Accordion
        className='accordion-container'
        defaultActiveKey='1'
        activeKey={activeKey}
      >
        <Card className={`mt-4 m-3 shadow-sm ${isMobile ? 'ml-0' : 'ml-4'}`}>
          <div className='card-body initial-card-body'>
            {isMobile && (
              <>
                <div className='row' style={{ paddingLeft: '12px' }}>
                  <div className='title-col'>
                    <div className='title'>Scheduled Return</div>
                    <div className='total'>
                      {get(items, 'length', 0)}{' '}
                      {`${get(items, 'length', 0) === 1 ? 'item' : 'items'}`} in
                      total
                    </div>
                  </div>
                  <div className='button-col col'>
                    <div>
                      {eventKey === '0' ? (
                        <>
                          <button
                            className='btn btn-show'
                            onClick={() => setEventKey('1')}
                          >
                            Show details
                          </button>
                          <span className='arrow'>▼</span>
                        </>
                      ) : (
                        <>
                          <button
                            className='btn btn-show'
                            onClick={() => setEventKey('0')}
                          >
                            Hide details
                          </button>
                          <span className='arrow'>▲</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className='row mt-3' style={{ justifyContent: 'center' }}>
                  <div className='product-img-col col'>
                    {eventKey === '0' && renderAllScheduledItems}
                    {items.length > 5 && (
                      <div
                        className='plus-more'
                        style={{ display: 'flex', alignItems: 'center' }}
                      >
                        {items.length > 5 && `+${moreItemsCount} more...`}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {!isMobile && (
              <>
                <Row
                  className='align-items-center'
                  style={{ marginLeft: '0px' }}
                >
                  <div className='title-col col'>
                    <div className='title'>Scheduled Return</div>
                    <div className='total'>
                      {order.orderItems.length}{' '}
                      {`${get(items, 'length', 0) === 1 ? 'item' : 'items'}`} in
                      total
                    </div>
                  </div>
                  <div className='product-img-col col-6'>
                    {eventKey === '0' && renderAllScheduledItems}
                    {items.length > 5 && (
                      <div
                        className='plus-more'
                        style={{ display: 'flex', alignItems: 'center' }}
                      >
                        {items.length > 5 && `+${moreItemsCount} more...`}
                      </div>
                    )}
                  </div>

                  <div className='button-col col'>
                    <div>
                      {eventKey === '0' ? (
                        <>
                          <button
                            className='btn btn-show'
                            onClick={() => setEventKey('1')}
                          >
                            Show details
                          </button>
                          <span className='arrow'>▼</span>
                        </>
                      ) : (
                        <>
                          <button
                            className='btn btn-show'
                            onClick={() => setEventKey('0')}
                          >
                            Hide details
                          </button>
                          <span className='arrow'>▲</span>
                        </>
                      )}
                    </div>
                  </div>
                </Row>
              </>
            )}
          </div>

          <Accordion.Collapse eventKey={eventKey}>
            <div>
              <div style={{ padding: '24px', paddingBottom: '39px' }}>
                {items.map((item) => renderScheduledReturnItem(item))}
                <hr className='hr-line' />

                <div className='sched-info-container'>
                  <Row
                    style={{ marginRight: '0px', justifyContent: 'flex-end' }}
                  >
                    <div className='sched-time-container'>
                      <h4>Pick-up on &nbsp;</h4>
                      <h4 className='sched-value'>
                        {moment(order.pickupDate).format('MMMM DD, YYYY')}
                      </h4>
                    </div>
                  </Row>
                  <Row
                    style={{ marginRight: '0px', justifyContent: 'flex-end' }}
                  >
                    <div className='sched-time-container'>
                      <h4>Between &nbsp;</h4>
                      <h4 className='sched-value'>
                        {order.pickupTime == 'AM'
                          ? '9 am to 12 pm'
                          : '12pm to 3pm'}
                      </h4>
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
                      <h4 className='sched-value'>
                        {' '}
                        {get(items, 'length', 0)}{' '}
                        {`${get(items, 'length', 0) === 1 ? 'item' : 'items'}`}{' '}
                      </h4>
                    </div>
                  </Row>

                  <Row
                    className='cancel-action-container'
                    style={{
                      marginRight: '0px',
                      justifyContent: 'flex-end',
                    }}
                  >
                    <button
                      className='btn btn-show p-0 m-0'
                      onClick={() => {
                        viewOrder();
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
