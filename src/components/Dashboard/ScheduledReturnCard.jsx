import React, { useState } from 'react';
import { GREAT } from '../../constants/returns/scores';
import ReturnScore from '../ReturnsScore';
import Row from '../Row';
import ProductDetails from './ProductDetails';
import OnHoverScheduledReturn from './OnHoverScheduledReturn';
import { useHistory } from 'react-router';

function ScheduledReturnCard({
  scheduledReturnId,
  selectable = true,
  selected,
  addSelected,
  removeSelected,
  clickable = true,
  scannedItem: {
    vendorTag,
    itemName,
    returnScore = GREAT,
    amount,
    id,
    imageUrl,
    orderDate,
  },
  disabled,
  scannedItem,
}) {
  const history = useHistory();
  const [isHover, setIsHover] = useState(false);

  const handleSelection = () => {
    if (selected) {
      removeSelected(id);
      return;
    }
    addSelected(id);
  };

  return (
    <div id='ScheduledReturnCard'>
      <div
        className={`card scanned-item-card w-840 mb-3 p-0 ${
          clickable && 'btn'
        }`}
        key={itemName}
        style={{
          border: selected
            ? '1px solid rgba(87, 0, 151, 0.8)'
            : '1px solid #EAE8EB',
        }}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        <div className='card-body pt-3 pb-3 p-0 m-0'>
          <Row className='scheduled-height'>
            {selectable && (
              <div className='row align-items-center p-4 product-checkbox'>
                <input
                  disabled={disabled}
                  type='checkbox'
                  checked={selected}
                  onChange={handleSelection}
                  style={{
                    zIndex: 999,
                  }}
                />
              </div>
            )}
            <div
              className='col-sm-1 product-img-container'
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <img
                className='product-img'
                src={imageUrl}
                alt=''
                style={{
                  maxWidth: 50,
                  maxHeight: 50,
                  objectFit: 'contain',
                }}
              />
            </div>

            <ProductDetails
              scannedItem={{
                vendorTag,
                itemName,
                scannedItem,
                returnScore,
                amount,
                compensationType: '',
              }}
            />
            <div
              className='col-sm-12 return-details-container'
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyItems: 'center',
              }}
            >
              {isHover && (
                <OnHoverScheduledReturn
                  timeLeft='in 59 minutes'
                  onClick={() => {
                    history.push('/view-return', { scheduledReturnId });
                  }}
                />
              )}

              {!isHover && (
                <>
                  <div className='col-sm-3 return-score'>
                    <ReturnScore score={returnScore} />
                  </div>
                </>
              )}

              <div className='col-sm-3 return-item-brand'>
                <img
                  src='https://pbs.twimg.com/profile_images/1159166317032685568/hAlvIeYD_400x400.png'
                  alt=''
                  className='avatar-img ml-2 rounded-circle noted-border brand-img'
                  style={{
                    width: 35,
                    height: 35,
                  }}
                />
              </div>
            </div>
          </Row>
        </div>
      </div>
    </div>
  );
}

export default ScheduledReturnCard;
