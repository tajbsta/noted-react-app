import React, { useState, useEffect } from 'react';
import { isEmpty } from 'lodash-es';
import { ProgressBar } from 'react-bootstrap';
import { getOrders } from '../../../utils/orderApi';
import { getUserId } from '../../../utils/auth';
import { ReturnHistoryItem } from './ReturnHistoryItem';

export default function ReturnHistory({ user }) {
  const [orders, setOrders] = useState([]);
  const [fetchingOrders, setFetchingOrders] = useState(false);

  const getOrderHistory = async () => {
    try {
      setFetchingOrders(true);
      const userId = await getUserId();
      const res = await getOrders(userId, 'history');

      setFetchingOrders(false);
      setOrders(res.orders);
      // console.log(res.orders);
    } catch (error) {
      // TODO: ERROR HANDLING
      console.log(error);
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
      {!fetchingOrders &&
        orders.map((order) => (
          <ReturnHistoryItem order={order} key={order._id} />
        ))}
      {!fetchingOrders && isEmpty(orders) && renderEmptiness()}
    </div>
  );
}
