import React, { useState, useEffect } from 'react';
import { isEmpty } from 'lodash-es';
import { ProgressBar } from 'react-bootstrap';
import { getOrders } from '../../../utils/orderApi';
import { getUserId } from '../../../utils/auth';
import { ReturnHistoryItem } from './ReturnHistoryItem';

export default function ReturnHistory({ user }) {
  const [orders, setOrders] = useState([]);
  const [fetchingOrders, setFetchingOrders] = useState(false);
  const [lastEvaluatedKey, setLastEvaluatedKey] = useState(null);

  const getOrderHistory = async (nextPageKey = null) => {
    try {
      setFetchingOrders(true);
      const currentOrders = orders;
      const userId = await getUserId();
      const res = await getOrders(userId, 'history', nextPageKey);
      console.log(res);
      const newOrders = currentOrders.concat(res.orders);

      setFetchingOrders(false);
      setOrders(newOrders);

      if (res.lastEvaluatedKey) {
        setLastEvaluatedKey(res.lastEvaluatedKey);
      } else {
        setLastEvaluatedKey(null);
      }
    } catch (error) {
      // TODO: ERROR HANDLING
      console.log(error);
    }
  };

  const showMore = () => {
    if (lastEvaluatedKey) {
      getOrderHistory(lastEvaluatedKey);
    } else {
      setLastEvaluatedKey(null);
    }
  };

  useEffect(() => {
    // empty orders
    if (orders.length === 0) {
      getOrderHistory();
    }
  }, []);

  const renderEmptiness = () => {
    return (
      <>
        <h3 className='sofia pro empty-message mt-5'>No returns yet!</h3>
        <h5 className='sofia pro empty-submessage mb-5'>
          I&apos;m sorry {(user && user.name) || (user && user.email)}, I&apos;m
          afraid there&apos;s nothing here. Change that by {''}
          <a href='/dashboard' className='start-returning'>
            start returning.
          </a>
        </h5>
      </>
    );
  };

  return (
    <div id='ReturnHistory'>
      <div className='container'>
        <div className='row'>
          <div className='col-sm-12 mt-2 pl-0'>
            <h3 className='sofia-pro text-18 section-title mb-0'>
              Return History
            </h3>
          </div>
        </div>
      </div>
      {fetchingOrders && (
        <ProgressBar animated striped now={80} className='mt-4 m-3' />
      )}
      {!fetchingOrders && isEmpty(orders) && renderEmptiness()}
      {orders &&
        orders.map((order) => (
          <ReturnHistoryItem order={order} key={order.id} />
        ))}
      {lastEvaluatedKey && (
        <div className='d-flex justify-content-center'>
          <button
            className='sofia-pro btn btn-show-more noted-purple'
            onClick={showMore}
          >
            Show more
          </button>
        </div>
      )}
    </div>
  );
}
