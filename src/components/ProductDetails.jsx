import React from 'react';
import Row from './Row';
import { useHistory } from 'react-router-dom';

function ProductDetails({ item, isHovering = false }) {
  const history = useHistory();
  const pageLocation = history.location.pathname;
  const orderViews = ['/view-return', '/view-scan'];

  const toTitleCase = (str) => {
    let replacedDash = str.replace('-', ' ');
    return replacedDash.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  const formattedProductName = toTitleCase(item.name);
  const inDashboard = ['/dashboard'].includes(pageLocation);
  return (
    <div
      className={`col-sm-7 p-0 mt-1 p-details ${
        orderViews.indexOf(pageLocation) != -1 ? 'scheduled-height' : ''
      }`}
    >
      <Row>
        <h4 className='mb-0 sofia-pro mb-1 distributor-name'>
          {item.vendor_data.name}
        </h4>
      </Row>
      <Row>
        <h5 className='sofia-pro mb-2 product-name'>{formattedProductName}</h5>
      </Row>
      <Row>
        <h4 className='sofia-pro mb-0 product-price'>
          ${item.price}{' '}
          {isHovering && inDashboard && (
            <>
              <button type='button' className='btn alternateActionText ml-2'>
                Donate instead
              </button>
            </>
          )}
        </h4>
      </Row>
    </div>
  );
}

export default ProductDetails;
