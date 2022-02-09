import React, { useState, useEffect } from 'react';
import Collapsible from 'react-collapsible';
import ArchivedItem from './ArchivedItem';
import { getProducts } from '../../../api/productsApi';
import { timeout } from '../../../utils/time';
import { isEmpty } from 'lodash-es';
import { ProgressBar } from 'react-bootstrap';
import { AlertCircle } from 'react-feather';
import { showError } from '../../../library/notifications.library';
import { toggleArchiveItem } from '../../../api/productsApi';

export default function Archive({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const [archivedItems, setArchivedItems] = useState(null);
  const [lastEvaluatedKey, setLastEvaluatedKey] = useState(null);
  const [loadProgress, setLoadProgress] = useState(0);
  const [fetchingOrders, setFetchingOrders] = useState(false);
  const [isItemUnArchived, setIsItemunArchived] = useState(false);

  const onArchive = (id) => {
    toggleArchiveItem({ _id: id, isArchived: false });
    setIsItemunArchived(true);
  };

  const fetchArchivedItems = async (nextPageKey = null) => {
    const params = {
      userId: user.sub,
      sortBy: 'updated_at,_id',
      sort: 'asc,asc',
      isArchived: true,
    };

    try {
      setFetchingOrders(true);

      setLoadProgress(20);
      await timeout(200);
      setLoadProgress(35);
      await timeout(200);
      setLoadProgress(65);

      const products = await getProducts(params);
      setArchivedItems(products);

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

  const renderTrigger = () => {
    return (
      <div className='triggerContainer'>
        <h3 className='sofia-pro text-18 mb-3-profile mb-0 ml-3 triggerText'>
          Archived Items
        </h3>

        <span className='triggerArrow'>{isOpen ? '▲' : '▼'} </span>
      </div>
    );
  };

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

  const showMore = () => {
    // if (lastEvaluatedKey) {
    //   getOrderHistory(lastEvaluatedKey);
    // } else {
    //   setLastEvaluatedKey(null);
    // }
  };

  useEffect(() => {
    fetchArchivedItems();
    setIsItemunArchived(false);
  }, [isItemUnArchived]);

  return (
    <Collapsible
      animation={false}
      open={isOpen}
      onTriggerOpening={() => setIsOpen(true)}
      onTriggerClosing={() => setIsOpen(false)}
      trigger={renderTrigger()}
    >
      {!fetchingOrders && isEmpty(archivedItems) && renderEmptiness()}
      {!isEmpty(archivedItems) &&
        archivedItems.map((item) => (
          <ArchivedItem
            archivedItem={item}
            key={item.id}
            onArchive={onArchive}
          />
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
  );
}
