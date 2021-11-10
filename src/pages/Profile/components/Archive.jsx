import React, { useState, useEffect } from 'react';
import Collapsible from 'react-collapsible';
import ArchivedItem from './ArchivedItem';

export default function Archive() {
  const [isOpen, setIsOpen] = useState(false);

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

  return (
    <Collapsible
      animation={false}
      open={isOpen}
      onTriggerOpening={() => setIsOpen(true)}
      onTriggerClosing={() => setIsOpen(false)}
      trigger={renderTrigger()}
    >
      <ArchivedItem />
      {/* {!fetchingOrders && isEmpty(orders) && renderEmptiness()}
      {!isEmpty(orders) &&
        orders.map((order) => (
          <ReturnHistoryItem order={order} key={order.id} />
        ))} */}
      {/* {fetchingOrders && (
          <ProgressBar
            animated
            striped
            now={loadProgress}
            className='m-bar mt-4 m-3'
          />
        )} */}
      {/* {lastEvaluatedKey && (
          <div className='d-flex justify-content-center'>
            <button
              className='sofia-pro btn btn-show-more noted-purple'
              onClick={showMore}
            >
              Show more
            </button>
          </div>
        )} */}
    </Collapsible>
  );
}
