import React, { useState, useEffect } from 'react';
import { isEmpty } from 'lodash-es';
import { ProgressBar } from 'react-bootstrap';
import { getOrders } from '../../../api/orderApi';
import { getUserId } from '../../../api/auth';
import { ReturnHistoryItem } from './ReturnHistoryItem';
import { timeout } from '../../../utils/time';
import { showError } from '../../../library/notifications.library';
import { AlertCircle } from 'react-feather';
import Collapsible from 'react-collapsible';

export default function ReturnHistory({ user }) {
  const [orders, setOrders] = useState([]);
  const [fetchingOrders, setFetchingOrders] = useState(false);
  const [lastEvaluatedKey, setLastEvaluatedKey] = useState(null);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const getOrderHistory = async (nextPageKey = null) => {
    try {
      setFetchingOrders(true);

      setLoadProgress(20);
      await timeout(200);
      setLoadProgress(35);
      await timeout(200);
      setLoadProgress(65);

      const currentOrders = orders;
      const userId = await getUserId();
      const res = await getOrders(userId, 'history', nextPageKey);
      // console.log(res);
      const newOrders = currentOrders.concat(res.orders);

      setOrders(newOrders);

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

      if (res.lastEvaluatedKey) {
        setLastEvaluatedKey(res.lastEvaluatedKey);
      } else {
        setLastEvaluatedKey(null);
      }
    } catch (error) {
      showError({
        message: (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <AlertCircle />
            <h4 className='ml-3 mb-0' style={{ lineHeight: '16px' }}>
              Error getting order history!
            </h4>
          </div>
        ),
      });
      setFetchingOrders(false);
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

  const renderTrigger = () => {
    return (
      <div className='triggerContainer'>
        <h3 className='sofia-pro text-18 mb-3-profile mb-0 ml-3 triggerText'>
          Return History
        </h3>

        <span className='triggerArrow'>{isOpen ? '▲' : '▼'} </span>
      </div>
    );
  };

  return (
    <div id='ReturnHistory'>
      <Collapsible
        animation={false}
        open={isOpen}
        onTriggerOpening={() => setIsOpen(true)}
        onTriggerClosing={() => setIsOpen(false)}
        trigger={renderTrigger()}
      >
        {!fetchingOrders && isEmpty(orders) && renderEmptiness()}
        {!isEmpty(orders) &&
          orders.map((order) => (
            <ReturnHistoryItem order={order} key={order.id} />
          ))}
        {fetchingOrders && (
          <ProgressBar
            animated
            striped
            now={loadProgress}
            className='m-bar mt-4 m-3'
          />
        )}
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
      </Collapsible>
    </div>
  );
}
