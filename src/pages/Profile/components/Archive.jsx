import React, { useState, useEffect } from 'react';
import Collapsible from 'react-collapsible';
import ArchivedItem from './ArchivedItem';
import { getProducts } from '../../../api/productsApi';
import { timeout } from '../../../utils/time';
import { isEmpty } from 'lodash-es';
import { ProgressBar } from 'react-bootstrap';
import { AlertCircle, CheckCircle } from 'react-feather';
import { showError, showSuccess } from '../../../library/notifications.library';
import { toggleArchiveItem } from '../../../api/productsApi';

export default function Archive({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const [archivedItems, setArchivedItems] = useState(null);
  // const [lastEvaluatedKey, setLastEvaluatedKey] = useState(null);
  const [loadProgress, setLoadProgress] = useState(0);
  const [fetchArchivedItems, setFetchArchivedItems] = useState(false);
  const [isitemArchived, setIsItemArchived] = useState(false);
  const lastEvaluatedKey = null;

  const initFetchArchivedItems = async () => {
    const params = {
      userId: user.sub,
      sortBy: 'updated_at,_id',
      sort: 'asc,asc',
      isArchived: true,
    };

    try {
      setFetchArchivedItems(true);

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
        setFetchArchivedItems(false);
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
      setFetchArchivedItems(false);
    }
  };

  const onArchive = async (id) => {
    const response = await toggleArchiveItem({ _id: id, isArchived: false });

    if (response) {
      showSuccess({
        message: (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <CheckCircle />
            <h4 className='ml-3 mb-0' style={{ lineHeight: '16px' }}>
              Successfully unarchived your item, check your dashboard.
            </h4>
          </div>
        ),
      });
    } else {
      showError({
        message: (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <AlertCircle />
            <h4 className='ml-3 mb-0' style={{ lineHeight: '16px' }}>
              Failed to unarchive your item, try again later.
            </h4>
          </div>
        ),
      });
    }

    setIsItemArchived(true);
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
        <h3 className='sofia pro empty-message mt-5'>No archived items yet!</h3>
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
    initFetchArchivedItems();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      initFetchArchivedItems();
    }, 1000);
    setIsItemArchived(false);
  }, [isitemArchived]);

  return (
    <Collapsible
      animation={false}
      open={isOpen}
      onTriggerOpening={() => setIsOpen(true)}
      onTriggerClosing={() => setIsOpen(false)}
      trigger={renderTrigger()}
    >
      {!fetchArchivedItems && isEmpty(archivedItems) && renderEmptiness()}
      {!isEmpty(archivedItems) &&
        !fetchArchivedItems &&
        archivedItems.map((item) => (
          <ArchivedItem
            archivedItem={item}
            key={item.id}
            onArchive={onArchive}
          />
        ))}
      {fetchArchivedItems && (
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
