import React from 'react';
import Row from '../Row';
import ProductCard from './ProductCard';
import QuestionMarkSvg from '../../assets/icons/QuestionMark.svg';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateForReturn } from '../../actions/runtime.action';
import { FOR_RETURN } from '../../constants/actions/runtime';

function InReturnBox({
  typeTitle,
  compensationType,
  disabled,
  scheduledReturnId,
  selected,
  setSelected,
}) {
  const dispatch = useDispatch();
  const { push } = useHistory();

  const { scheduledReturns } = useSelector(
    ({
      runtime: { forReturn, lastCall, forDonation },
      auth: { scheduledReturns },
      scans,
    }) => ({
      localDonationsCount: forDonation.length,
      forReturn,
      lastCall,
      scheduledReturns,
      inReturn: [...forReturn, ...lastCall],
      inDonation: [...forDonation],
      scans,
    })
  );

  const scheduledReturn = scheduledReturns.find(
    ({ id }) => id === scheduledReturnId
  );
  const { items } = scheduledReturn;

  const isSelected = (itemId) =>
    [...selected.map(({ id }) => id)].includes(itemId);

  const addSelected = (id) => {
    if (selected.map(({ id }) => id).includes(id)) {
      return;
    }
    setSelected([...selected, items.find((item) => item.id === id)]);
    if (compensationType === FOR_RETURN) {
      dispatch(
        updateForReturn({
          scans: [...selected],
        })
      );
    }
  };

  const removeSelected = (id) => {
    if (selected.map(({ id }) => id).includes(id)) {
      setSelected([...selected.filter(({ id: itemId }) => itemId !== id)]);
    }
  };

  const handleSelectAll = () => {
    if (selected.length === items.length) {
      setSelected([]);
    }

    if (selected.length !== items.length) {
      setSelected([...items.map((scannedItem) => scannedItem)]);
    }
  };

  return (
    <div id='ReturnCategory'>
      <Row>
        <div className='category-title'>
          <div className='ml-3 p-0 purchase-type-checkbox-container'>
            <input
              disabled={disabled}
              className='checkbox'
              type='checkbox'
              onChange={handleSelectAll}
              checked={selected.length === items.length}
            />
          </div>
          <h4 className='sofia-pro purchase-types purchase-type-title'>
            {typeTitle}
          </h4>
          <img
            className='question-mark'
            src={QuestionMarkSvg}
            alt=''
            style={{
              opacity: 0.6,
            }}
            data-toggle='tooltip'
            data-placement='top'
            title='Tooltip message here :)'
          />
        </div>
      </Row>
      {[...items].map((scannedItem) => {
        return (
          <ProductCard
            disabled={disabled}
            key={scannedItem.id}
            scannedItem={scannedItem}
            selected={isSelected(scannedItem.id)}
            addSelected={addSelected}
            removeSelected={removeSelected}
            onClick={() => {
              push(`/view-scan?scanId=${scannedItem.id}`);
            }}
          />
        );
      })}
    </div>
  );
}

export default InReturnBox;
