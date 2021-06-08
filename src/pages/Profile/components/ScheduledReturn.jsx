import React, { useState, useEffect } from 'react';
import { isEmpty } from 'lodash-es';
import { ProgressBar } from 'react-bootstrap';
import Collapsible from 'react-collapsible';
import { getOrders } from '../../../api/orderApi';
import { getUserId } from '../../../api/auth';
import { ScheduledReturnItem } from './ScheduledReturnItem';
import { timeout } from '../../../utils/time';
import { showError } from '../../../library/notifications.library';
import { AlertCircle } from 'react-feather';

export default function ScheduledReturn({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [fetchingOrders, setFetchingOrders] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  const getScheduledOrders = async () => {
    try {
      setFetchingOrders(true);

      setLoadProgress(20);
      await timeout(200);
      setLoadProgress(35);
      await timeout(200);
      setLoadProgress(65);

      const userId = await getUserId();
      const res = await getOrders(userId, 'active');

      setOrders(res.orders);

      setLoadProgress(80);
      await timeout(200);
      setLoadProgress(100);
      await timeout(1000);
      /**
       * Give animation some time
       */
      setTimeout(() => {
        setFetchingOrders(false);
      }, 600);

      // console.log(res.orders);
    } catch (error) {
      showError({
        message: (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <AlertCircle />
            <h4 className='ml-3 mb-0' style={{ lineHeight: '16px' }}>
              Error getting scheduled orders!
            </h4>
          </div>
        ),
      });
      setFetchingOrders(false);
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
            <ProgressBar
              animated
              striped
              now={loadProgress}
              className='mt-4 m-3'
            />
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
