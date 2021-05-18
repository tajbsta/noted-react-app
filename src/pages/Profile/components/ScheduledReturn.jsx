import React, { useState, useEffect } from 'react';
import { isEmpty } from 'lodash-es';
import { ProgressBar } from 'react-bootstrap';
import Collapsible from 'react-collapsible';
import { getOrders } from '../../../utils/orderApi';
import { getUserId } from '../../../utils/auth';
import { ScheduledReturnCard } from './ScheduledReturnItem';

export default function ScheduledReturn({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [fetchingOrders, setFetchingOrders] = useState(false);

  const getScheduledOrders = async () => {
    try {
      setFetchingOrders(true);
      const userId = await getUserId();
      const res = await getOrders(userId, 'active');

      setFetchingOrders(false);
      setOrders(res.orders);
      // console.log(res.orders);
    } catch (error) {
      // TODO: ERROR HANDLING
      console.log(error);
    }
  };

  useEffect(() => {
    // open and empty orders
    if (isOpen && orders.length === 0) {
      getScheduledOrders();
    }
  }, [isOpen]);

  const renderEmptiness = () => {
    return (
      <>
        <h5 className='sofia pro empty-message mt-4'>
          Your scheduled return is empty
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
      <Collapsible
        open={isOpen}
        onTriggerOpening={() => setIsOpen(true)}
        onTriggerClosing={() => setIsOpen(false)}
        trigger={
          <div className='triggerContainer'>
            <h3 className='sofia-pro text-18 mb-3-profile ml-3 mb-0 triggerText'>
              Your Scheduled Return
            </h3>
            <span className='triggerArrow'>{isOpen ? '▲' : '▼'} </span>
          </div>
        }
      >
        {fetchingOrders && (
          <ProgressBar animated striped now={80} className='mt-4' />
        )}
        {!fetchingOrders &&
          orders.map((order) => (
            <ScheduledReturnCard order={order} key={order._id} />
          ))}
        {!fetchingOrders && isEmpty(orders) && renderEmptiness()}
      </Collapsible>{' '}
    </div>
  );
}
