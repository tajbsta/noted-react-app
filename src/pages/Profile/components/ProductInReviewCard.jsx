import ProductPlaceholder from '../../../assets/img/ProductPlaceholder.svg';
import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { get } from 'lodash-es';
import ReturnScore from '../../../components/ReturnsScore';

export default function ProductInReviewCard({ item }) {
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileSmaller, setIsMobileSmaller] = useState(false); // <320px

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
  const formatPrice = item.amount.toFixed(2);

  const RenderStatus = (status) => {
    switch (status) {
      case 'pending':
        return <h4 className='sofia-pro pending-status mb-0'>Pending</h4>;
      case 'rejected':
        return <h4 className='sofia-pro rejected-status mb-0'>Rejected</h4>;
      case 'accepted':
        return <h4 className='sofia-pro accepted-status mb-0'>Accepted</h4>;
      default:
        return <></>;
    }
  };

  return (
    <div id='productCard'>
      <div className={`card scanned-item-card max-w-840 mb-3 p-0`}>
        <div
          className='card-body pt-3 pb-3 p-0 m-0'
          style={{ marginTop: isMobile ? '1px' : '' }}
        >
          <Row>
            <div className='product-img-container'>
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
            <Col xs={3}>
              <Container>
                <div className='title-container'>
                  <h4
                    className='mb-0 sofia-pro distributor-name'
                    style={{ marginBottom: '0px', lineHeight: 'inherit' }}
                  >
                    {get(item, 'vendorTag', 'Product Name')}
                  </h4>
                  <h4
                    className='sofia-pro mb-2 product-name'
                    style={{ lineHeight: 'inherit' }}
                  >
                    {formattedProductName}
                  </h4>
                  <h4 className='sofia-pro product-price'>${formatPrice}</h4>
                </div>
              </Container>
            </Col>
            <Col
              xs={7}
              style={{
                display: 'flex',
                alignItems: 'center',
                paddingRight: '0px',
                marginLeft: '2em',
                justifyContent: 'flex-end',
              }}
            >
              <Row
                xs={5}
                style={{
                  minWidth: '50%',
                }}
              >
                <Col
                  xs={9}
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    paddingRight: '0px',
                  }}
                >
                  <Row
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Col
                      style={{
                        display: 'flex',
                        alignContent: 'center',
                      }}
                    >
                      {RenderStatus(get(item, 'status', 'pending'))}
                    </Col>
                    <Col>
                      <ReturnScore score={get(item, 'vendor_data.rating', 1)} />
                    </Col>
                  </Row>
                </Col>
                <Col
                  style={{
                    marginLeft: 5,
                  }}
                >
                  <img
                    src={get(item, 'vendor_data.thumbnail', ProductPlaceholder)}
                    onError={(e) => {
                      e.currentTarget.src = ProductPlaceholder;
                    }}
                    alt=''
                    className='avatar-img rounded-circle noted-border brand-img'
                    style={{
                      width: 35,
                      height: 35,
                      objectFit: 'contain',
                      background: '#fff',
                    }}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
}
