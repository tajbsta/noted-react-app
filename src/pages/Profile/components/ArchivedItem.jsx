import React, { useEffect, useState } from 'react';
import { Accordion, Card, Col, Row } from 'react-bootstrap';
import ReturnIcon from '../../../assets/icons/return-arrow-icon.svg';
import ProductPlaceholder from '../../../assets/img/ProductPlaceholder.svg';
import { toTitleCase } from '../../../utils/data';

export default function ArchivedItem({ archivedItem, onArchive }) {
  const [isMobile, setIsMobile] = useState(false);
  const { _id, name, vendor, price, thumbnail, vendor_data } = archivedItem;

  // Truncate name if longer than 45 characters
  const truncateProductNameInDesktop = (str, num = 35) => {
    if (str && str.length > num) {
      return str.slice(0, num) + '...';
    } else {
      return str;
    }
  };

  const formattedProductName = toTitleCase(name);
  const truncatedName = truncateProductNameInDesktop(formattedProductName);

  return (
    <div className='row'>
      <Card className={`col mt-1 shadow-sm ${isMobile ? 'ml-0' : 'ml-4 m-3'}`}>
        <Card.Body className='py-3 px-4'>
          {!isMobile && (
            <div className='flex row align-items-center justify-content-between'>
              <Col sm={6} className='flex row'>
                <img
                  src={thumbnail}
                  className='mr-3'
                  style={{
                    border: '1px solid #f0f0f0',
                    borderRadius: '8px',
                    justifyContent: 'center',
                    width: '48px',
                    height: '48px',
                    background: '#fff',
                    objectFit: 'contain',
                  }}
                />

                <div>
                  <strong className='my-0' style={{ fontSize: 13 }}>
                    {truncatedName}
                  </strong>
                  <p
                    className='my-0'
                    style={{ fontSize: 13, color: '#2E1D3A' }}
                  >
                    {vendor}
                  </p>
                  <strong className='my-0' style={{ fontSize: 13 }}>
                    ${price}{' '}
                  </strong>
                  <span className='' style={{ fontSize: 12, color: '#0E0018' }}>
                    Cash back
                  </span>
                </div>
              </Col>
              <Col
                sm={6}
                className='flex row align-items-center justify-content-end'
              >
                <img
                  src={ReturnIcon}
                  alt='icon'
                  style={{ cursor: 'pointer' }}
                  onClick={() => onArchive(_id)}
                />
                <div>
                  <img
                    src={
                      (vendor_data && vendor_data.thumbnail) ||
                      ProductPlaceholder
                    }
                    onError={(e) => {
                      e.currentTarget.src = ProductPlaceholder;
                    }}
                    alt=''
                    style={{
                      border: '1px solid #f0f0f0',
                      borderRadius: '8px',
                      justifyContent: 'center',
                      width: '48px',
                      height: '48px',
                      background: '#fff',
                      objectFit: 'contain',
                      marginLeft: 10,
                    }}
                  />
                </div>
              </Col>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}
