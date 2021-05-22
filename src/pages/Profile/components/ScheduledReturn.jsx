import React, { useState, useEffect } from 'react';
import { isEmpty } from 'lodash-es';
import { ProgressBar } from 'react-bootstrap';
import Collapsible from 'react-collapsible';
import { getOrders } from '../../../utils/orderApi';
import { getUserId } from '../../../utils/auth';
import { ScheduledReturnItem } from './ScheduledReturnItem';

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
    // empty orders
    if (orders.length === 0) {
      getScheduledOrders();
      setIsOpen(true);
    }
  }, []);

  const renderEmptiness = () => {
    return (
      <>
        <h3 className='sofia pro empty-message mt-5 mb-4'>
          Your scheduled return is empty
        </h3>
      </>
    );
  };

  const activeOrders = () => {
    return (
      <>
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
            <ProgressBar animated striped now={80} className='mt-4 m-3' />
          )}
          {!fetchingOrders &&
            orders.map((order) => (
              <ScheduledReturnItem order={order} key={order.id} />
            ))}
          {!fetchingOrders && isEmpty(orders) && renderEmptiness()}
        </Collapsible>
      </>
    );
  };

  return (
    <div id='ScheduledReturn'>
      {isOpen && activeOrders()}
      {!isOpen && activeOrders()}
    </div>
  );
}
