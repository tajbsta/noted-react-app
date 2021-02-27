import React from 'react';
import ReturnScore from '../ReturnsScore';
import Row from '../Row';
import ProductDetails from './ProductDetails';

function ProductCard({
  scannedItem: {
    distributor,
    productName,
    scannedItem,
    returnScore,
    price,
    compensationType,
  },
}) {
  return (
    <div
      className='card shadow-sm scanned-item-card mb-3 p-0'
      key={productName}
    >
      <div className='card-body pt-3 pb-3 p-0 m-0'>
        <Row>
          <div className='row align-items-center p-4'>
            <input type='checkbox' value='' id='flexCheckDefault' />
          </div>
          <div
            className='col-sm-1 ml-1 mr-3'
            style={{
              backgroundImage: "url('https://via.placeholder.com/150')",
              backgroundSize: 'cover',
            }}
          />
          <ProductDetails
            scannedItem={{
              distributor,
              productName,
              scannedItem,
              returnScore,
              price,
              compensationType,
            }}
          />
          <div
            className='col-sm-5'
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyItems: 'center',
            }}
          >
            <div
              className='col-sm-11 text-right p-0 noted-red sofia-pro'
              style={{
                color: '#FF1C29',
              }}
            >
              2 days left
            </div>
            <div className='col-sm-1 p-0 ml-3 '>
              <ReturnScore score={returnScore} />
            </div>
            <img
              src='https://i.pinimg.com/originals/bd/c8/1a/bdc81a948abd4361288cf3a2d709261e.jpg'
              alt=''
              className='avatar-img avatar-sm ml-3 rounded-circle'
            />
          </div>
        </Row>
      </div>
    </div>
  );
}

export default ProductCard;
