import React from 'react';
import Row from '../../../components/Row';
import ProductCard from '../../../components/ProductCard';
import NotedCheckbox from '../../../components/Product/NotedCheckbox';
import QuestionMarkSvg from '../../../assets/icons/QuestionMark.svg';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateForReturn } from '../../../actions/runtime.action';
import { FOR_RETURN } from '../../../constants/actions/runtime';
import { get } from 'lodash-es';
import { dedupeByKey } from '../../../utils/data';

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

  const { scheduledReturns, orderInMemory } = useSelector(
    ({
      runtime: { forReturn, lastCall, forDonation, orderInMemory },
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
      orderInMemory,
    })
  );

  const scheduledReturn = scheduledReturns.find(
    ({ id }) => id === scheduledReturnId
  );

  const currentOrderItems = get(orderInMemory, 'items', []);

  const items = dedupeByKey(
    [...get(scheduledReturn, 'items', []), ...currentOrderItems],
    '_id'
  );

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
            <NotedCheckbox
              onChangeState={handleSelectAll}
              checked={selected.length === items.length}
              disabled={items.length === 0}
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
            key={scannedItem._id}
            scannedItem={scannedItem}
            selected={isSelected(scannedItem.id)}
            item={scannedItem}
            addSelected={addSelected}
            removeSelected={removeSelected}
            onClick={() => {
              push(`/checkout?scanId=${scannedItem.id}`);
            }}
          />
        );
      })}
    </div>
  );
}

export default InReturnBox;
