import ProductPlaceholder from '../../../assets/img/ProductPlaceholder.svg';
import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { get, isEmpty } from 'lodash-es';
import ReturnScore from '../../../components/Product/ReturnsScore';

export default function ProductInReviewCard({ item }) {
  const [isMobile, setIsMobile] = useState(false);

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

  const formattedProductName = get(item, 'name', '');
  const formatPrice = item.price.toFixed(2);

  const RenderStatus = (status) => {
    switch (status) {
      case 'pending':
        return <h4 className='sofia-pro pending-status mb-0'>Pending</h4>;
      case 'rejected':
        return <h4 className='sofia-pro rejected-status mb-0'>Rejected</h4>;
      case 'approved':
        return <h4 className='sofia-pro accepted-status mb-0'>Approved</h4>;
      default:
        return <></>;
    }
  };

  return (
    <div id='ProductCard'>
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
            <Col xs={7}>
              <Container>
                <div className='title-container'>
                  <h4
                    className='mb-0 sofia-pro distributor-name'
                    style={{
                      marginBottom: '0px',
                      lineHeight: 'inherit',
                    }}
                  >
                    {get(item, 'vendor', 'Product Name')}
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
              xs={3}
              style={{
                display: 'flex',
                alignItems: 'center',
                paddingRight: '0px',
                margin: '0px',
                justifyContent: 'flex-end',
              }}
            >
              <Row
                // xs={5}
                style={{
                  // minWidth: '50%',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  margin: '0px',
                }}
              >
                <Col
                  style={{
                    display: 'flex',
                    alignContent: 'center',
                    marginRight: '0.3rem',
                  }}
                  xs={3}
                >
                  {RenderStatus(get(item, 'review_status', 'pending'))}
                </Col>
                <Col xs={3}>
                  <ReturnScore
                    score={
                      !isEmpty(item.vendor_data.rating)
                        ? item.vendor_data.rating
                        : 1
                    }
                  />
                </Col>

                <Col
                  style={{
                    marginLeft: 5,
                  }}
                  xs={3}
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
