import ProductPlaceholder from '../../../assets/img/ProductPlaceholder.svg';
import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { get } from 'lodash-es';

export default function ProductInReviewCard({ item }) {
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileSmaller, setIsMobileSmaller] = useState(false); // <320px

  console.log(item);

  // Check if device is mobile
  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 991);
    }
    handleResize(); // Run on load to set the default value
    window.addEventListener('resize', handleResize);
    // Clean up event listener
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  useEffect(() => {
    function handleResize() {
      setIsMobileSmaller(window.innerWidth <= 320);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  const toTitleCase = (str) => {
    const replacedDash = (str && str.replace('-', ' ')) || '';
    return replacedDash.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  // Truncate name if longer than 15 characters
  const truncateProductNameForSmallerScreens = (str, num = 12) => {
    if (str && str.length > num) {
      return str.slice(0, num) + '...';
    } else {
      return str;
    }
  };

  const formattedProductName = toTitleCase(item.itemName);

  return (
    <div id='productCard'>
      <div className={`card scanned-item-card max-w-840 mb-3 p-0`}>
        <div
          className='card-body pt-3 pb-3 p-0 m-0'
          style={{ marginTop: isMobile ? '1px' : '' }}
        >
          <Row>
            <div
              className='product-img-container'
              style={{
                display: 'flex',
              }}
            >
              <img
                className='product-img ml-3'
                src={item.thumbnail || ProductPlaceholder}
                onError={(e) => {
                  e.currentTarget.src = ProductPlaceholder;
                }}
                alt=''
                style={{
                  maxWidth: 50,
                  maxHeight: 50,
                  objectFit: 'contain',
                }}
              />
            </div>
            <Col>
              <Container>
                <div className='title-container'>
                  <h4
                    className='mb-0 sofia-pro distributor-name'
                    style={{ marginBottom: '0px', lineHeight: 'inherit' }}
                  >
                    {get(item, 'vendorTag', 'Product Name')}
                  </h4>
                  {isMobileSmaller && (
                    <h4
                      className='sofia-pro mb-2 product-name'
                      style={{ lineHeight: 'inherit' }}
                    >
                      {truncateProductNameForSmallerScreens(
                        formattedProductName
                      )}
                    </h4>
                  )}
                </div>
              </Container>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
}
