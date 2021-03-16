import React, { useEffect, useState } from 'react';
import Row from '../Row';
import ProductCard from './ProductCard';
import QuestionMarkSvg from '../../assets/icons/QuestionMark.svg';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  updateForDonation,
  updateForReturn,
} from '../../actions/runtime.action';
import { FOR_DONATION, FOR_RETURN } from '../../constants/actions/runtime';

function ReturnCategory({ scannedItems, typeTitle, compensationType }) {
  const dispatch = useDispatch();
  const { push } = useHistory();
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    if (compensationType === FOR_RETURN) {
      dispatch(
        updateForReturn({
          scans: [...selected],
        })
      );
    }

    if (compensationType === FOR_DONATION) {
      dispatch(
        updateForDonation({
          scans: [...selected],
        })
      );
    }
  }, [selected]);

  const addSelected = (id) => {
    if (selected.includes(id)) {
      return;
    }
    setSelected([...selected, scannedItems.find((item) => item.id === id).id]);
    if (compensationType === FOR_RETURN) {
      dispatch(
        updateForReturn({
          scans: [...selected],
        })
      );
    }
  };

  const removeSelected = (id) => {
    if (selected.includes(id)) {
      setSelected([...selected.filter((itemId) => itemId !== id)]);
    }
  };

  const handleSelectAll = () => {
    if (selected.length === scannedItems.length) {
      setSelected([]);
    }

    if (selected.length !== scannedItems.length) {
      setSelected([...scannedItems.map(({ id }) => id)]);
    }
  };

  return (
    <div id='ReturnCategory'>
      <Row>
        <div className='category-title'>
          <div className='ml-3 p-0 purchase-type-checkbox-container'>
            <input
              className='checkbox'
              type='checkbox'
              onChange={handleSelectAll}
              checked={selected.length === scannedItems.length}
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
      {[...scannedItems].map((scannedItem) => {
        return (
          <ProductCard
            key={scannedItem.id}
            scannedItem={scannedItem}
            selected={selected.includes(scannedItem.id)}
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

export default ReturnCategory;
