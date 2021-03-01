import React from 'react';
import Row from '../Row';

function ProductDetails({
  scannedItem: { productName, distributor, price, compensationType },
}) {
  return (
    <div className='col-sm-4 p-0 mt-1'>
      <Row>
        <h4 className='mb-0 sofia-pro mb-1 distributor-name'>{distributor}</h4>
      </Row>
      <Row>
        <h5 className='sofia-pro mb-2 product-name'>{productName}</h5>
      </Row>
      <Row>
        <h4 className='sofia-pro mb-0 product-price'>
          ${price}{' '}
          <span
            className='sofia-pro product-compensation-type'
            style={{
              fontSize: 12,
              opacity: 0.6,
              color: '#0e0018',
            }}
          >
            {compensationType}
          </span>
        </h4>
      </Row>
    </div>
  );
}

export default ProductDetails;
