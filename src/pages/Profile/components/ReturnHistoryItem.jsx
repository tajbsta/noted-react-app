import { get, isEmpty } from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Accordion, Card, Col, Row } from 'react-bootstrap';
import ProductPlaceholder from '../../../assets/img/ProductPlaceholder.svg';
import ReturnScore from '../../../components/Product/ReturnsScore';
import { toTitleCase } from '../../../utils/data';

export const ReturnHistoryItem = ({ order }) => {
  const [eventKey, setEventKey] = useState('0');
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
  const formattedOrderStatus = toTitleCase(order.status);
  const formattedReturnValue = order.returnValue.toFixed(2);

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

  const renderReturnHistoryItem = (item) => {
    const vendorName = () => {
      if (item.vendor_data) {
        return get(item.vendor_data, 'name', '');
      } else {
        return get(item, 'vendor', '');
      }
    };
    const name = get(item, 'name', '');
    const price = get(item, 'price', '');
    const rating = !isEmpty(item.vendor_data.rating)
      ? item.vendor_data.rating
      : 1;
    const thumbnail = get(item, 'thumbnail', ''); // product img
    const category = get(item, 'category', '');
    const formattedPrice = price && price.toFixed(2);

    return (
      <div id='ReturnHistoryItem' key={item._id}>
        <Row className='mb-3'>
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
              <h4 className='sofia-pro sched-distributor-name'>
                {vendorName()}
              </h4>
              <h4 className='sofia-pro sched-product-name'>
                {toTitleCase(name)}
              </h4>
              <h4
                className={`sofia-pro sched-product-price ${
                  category == 'DONATE' ? 'donate-price' : ''
                }`}
              >
                {category == 'DONATE'
                  ? `$${formattedPrice} - Donate`
                  : `$${formattedPrice}`}
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
                style={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <ReturnScore score={rating} />
              </Col>
              <div className='m-brand-logo-cont'>
                <img
                  src={
                    (item.vendor_data && item.vendor_data.thumbnail) ||
                    ProductPlaceholder
                  }
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
    <div className='row history-row' key={order.id}>
      <Accordion
        className='accordion-container'
        defaultActiveKey='1'
        activeKey={activeKey}
      >
        <Card className={`mt-1 shadow-sm ${isMobile ? 'ml-0' : 'ml-4 m-3'}`}>
          <div className='card-body initial-card-body'>
            {isMobile && (
              <>
                <div className='row' style={{ paddingLeft: '12px' }}>
                  <div className='title-col'>
                    <div className='title m-history-title'>
                      Ordered:{' '}
                      {moment(order.order_date).format('MMMM DD, YYYY')}
                    </div>
                    <div className='total'>
                      {get(items, 'length', 0)}{' '}
                      {`${get(items, 'length', 0) === 1 ? 'item' : 'items'}`} in
                      total
                    </div>
                    {formattedOrderStatus == 'Cancelled' && (
                      <div className='title' style={{ color: 'red' }}>
                        {formattedOrderStatus}
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
                </div>

                <div className='row mt-3' style={{ justifyContent: 'center' }}>
                  <div className='product-img-col col'>
                    {eventKey === '0' && renderAllScheduledItems}
                    {items.length > 5 && (
                      <div
                        className='plus-more'
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                        }}
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
                    <div className='title'>
                      Ordered:{' '}
                      {moment(order.order_date).format('MMMM DD, YYYY')}
                    </div>
                    <div className='total'>
                      {order.orderItems.length}{' '}
                      {`${get(items, 'length', 0) === 1 ? 'item' : 'items'}`} in
                      total
                    </div>
                    {formattedOrderStatus == 'Cancelled' && (
                      <div className='title' style={{ color: 'red' }}>
                        {formattedOrderStatus}
                      </div>
                    )}
                    {formattedOrderStatus == 'Completed' && (
                      <div className='title' style={{ color: 'green' }}>
                        {formattedOrderStatus}
                      </div>
                    )}
                  </div>
                  <div className='product-img-col col-6'>
                    {eventKey === '0' && renderAllScheduledItems}
                    {items.length > 5 && (
                      <div
                        className='plus-more'
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                        }}
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
              <div style={{ padding: '0px 24px 24px 24px' }}>
                {items.map((item) => renderReturnHistoryItem(item))}
                <hr className='hr-line' />

                <div className='sched-info-container'>
                  <Row
                    style={{
                      marginRight: '0px',
                      justifyContent: 'flex-end',
                    }}
                  >
                    <div className='sched-time-container'>
                      <h4>Picked up on &nbsp;</h4>
                      <h4 className='sched-value'>
                        {moment(order.pickupDate).format('MMMM DD, YYYY')}
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
                      <h4>Total:&nbsp;</h4>
                      <h4 className='sched-value'>
                        {' '}
                        {get(items, 'length', 0)}{' '}
                        {`${get(items, 'length', 0) === 1 ? 'item' : 'items'}`}{' '}
                      </h4>
                    </div>
                  </Row>

                  {formattedReturnValue > 0 && (
                    <Row
                      style={{
                        justifyContent: 'flex-end',
                        marginRight: '0px',
                      }}
                    >
                      <div className='total-items-container'>
                        <h4>Potential Return Value:&nbsp;</h4>
                        <h4 className='sched-value'>${formattedReturnValue}</h4>
                      </div>
                    </Row>
                  )}
                </div>
              </div>
            </div>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    </div>
  );
};
