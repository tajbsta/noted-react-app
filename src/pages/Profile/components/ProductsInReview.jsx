import React, { useState } from 'react';
import Collapsible from 'react-collapsible';

export default function ProductsInReview() {
  const [isOpen, setIsOpen] = useState(false);

  const renderEmptiness = () => {
    return (
      <>
        <h5 className='sofia pro empty-message mt-4'>No products found.</h5>
      </>
    );
  };

  return (
    <div id='ProductsInReview'>
      <Collapsible
        open={isOpen}
        onTriggerOpening={() => setIsOpen(true)}
        onTriggerClosing={() => setIsOpen(false)}
        trigger={
          <div className='triggerContainer'>
            <h3 className='sofia-pro text-18 mb-3-profile mb-0 ml-3 triggerText'>
              Products in Review
            </h3>

            <span className='triggerArrow'>{isOpen ? '▲' : '▼'} </span>
          </div>
        }
      >
        {renderEmptiness()}
      </Collapsible>
    </div>
  );
}
