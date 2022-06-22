import React, { useEffect, useState, useRef } from 'react';
import { Card, Col, Overlay, Tooltip } from 'react-bootstrap';
import ReturnIcon from '../../../assets/icons/return-arrow-icon.svg';
import ProductPlaceholder from '../../../assets/img/ProductPlaceholder.svg';
import { toTitleCase } from '../../../utils/data';

export default function ArchivedItem({ archivedItem, onArchive }) {
  const [isMobile, setIsMobile] = useState(false);
  const { _id, name, vendor, price, thumbnail, vendor_data } = archivedItem;
  const target = useRef(null);
  const [showToolTip, setShowToolTip] = useState(false);

  // Truncate name if longer than 45 characters
  const truncateProductNameInDesktop = (str) => {
    const truncLength = isMobile ? 20 : 35;
    if (str && str.length > truncLength) {
      return str.slice(0, truncLength) + '...';
    } else {
      return str;
    }
  };

  const formattedProductName = toTitleCase(name);
  const truncatedName = truncateProductNameInDesktop(formattedProductName);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 991);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  return (
    <div className='row'>
      <Card className={`col mt-1 shadow-sm ${isMobile ? 'ml-0' : 'ml-4 m-3'}`}>
        <Card.Body className='py-3 px-4'>
          <div className='flex row align-items-center justify-content-between'>
            <Col sm={6} className='flex row px-0'>
              <img
                src={thumbnail ? thumbnail : ProductPlaceholder}
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
                <p className='my-0' style={{ fontSize: 13, color: '#2E1D3A' }}>
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
              className='flex row align-items-center justify-content-end px-0'
            >
              <img
                src={ReturnIcon}
                alt='icon'
                style={{ cursor: 'pointer' }}
                onClick={() => onArchive(_id)}
                ref={target}
                onMouseOver={() => setShowToolTip(true)}
                onMouseLeave={() => setShowToolTip(false)}
              />
              <div>
                <img
                  src={
                    (vendor_data && vendor_data.thumbnail) || ProductPlaceholder
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
        </Card.Body>
      </Card>

      <Overlay target={target.current} show={showToolTip} placement='bottom'>
        {(props) => (
          <Tooltip id='overlay-example' {...props}>
            <span style={{ fontFamily: 'Sofia Pro !important' }}>
              Unarchive your item
            </span>
          </Tooltip>
        )}
      </Overlay>
    </div>
  );
}
