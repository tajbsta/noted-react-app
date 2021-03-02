import React, { useState } from 'react';
import Row from '../Row';
import ProductCard from './ProductCard';
import QuestionMarkSvg from '../../assets/icons/QuestionMark.svg';
import { useHistory } from 'react-router-dom';

function LastCall({ scannedItems, typeTitle }) {
  const { push } = useHistory();
  const [selected, setSelected] = useState([]);
  const [selectedAll, setSelectedAll] = useState(
    scannedItems.length === selected.length
  );

  const addSelected = (id) => {
    if (selected.includes(id)) {
      return;
    }
    setSelected([...selected, scannedItems.find((item) => item.id === id).id]);
  };

  const removeSelected = (id) => {
    if (selected.includes(id)) {
      setSelected([...selected.filter((itemId) => itemId !== id)]);
    }
  };

  const handleSelectAll = () => {
    if (selectedAll) {
      setSelected([]);
      setSelectedAll(!selectedAll);
      return;
    }
    setSelected([...scannedItems.map(({ id }) => id)]);
    setSelectedAll(true);
  };

  return (
    <>
      <Row className='mb-2'>
        <div className='ml-3 p-0 purchase-type-checkbox-container'>
          <input
            type='checkbox'
            onChange={handleSelectAll}
            checked={selected.length === scannedItems.length}
          />
        </div>
        <h4
          className='sofia-pro purchase-types purchase-type-title mb-0'
          style={{
            display: 'flex',
            alignItems: 'center',
            marginLeft: 16,
            textAlign: 'center',
          }}
        >
          {typeTitle}
        </h4>
        <img
          className='ml-3 mb-2'
          src={QuestionMarkSvg}
          alt=''
          style={{
            opacity: 0.6,
          }}
        />
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
    </>
  );
}

export default LastCall;
