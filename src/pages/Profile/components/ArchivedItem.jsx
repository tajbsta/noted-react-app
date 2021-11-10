import React, { useEffect, useState } from 'react';
import { Accordion, Card, Col, Row } from 'react-bootstrap';
import NikeIcon from '../../../assets/icons/nike-sample-icon.svg';
import ReturnIcon from '../../../assets/icons/return-arrow-icon.svg';
import SampleProduct from '../../../assets/img/sample-product.png';

export default function ArchivedItem() {
  const [isMobile, setIsMobile] = useState(false);
  return (
    <div className='row history-row' key=''>
      <Card className={`col mt-1 shadow-sm ${isMobile ? 'ml-0' : 'ml-4 m-3'}`}>
        <Card.Body className='py-3 px-4'>
          {!isMobile && (
            <div className='flex row align-items-center justify-content-between'>
              <Col sm={6} className='flex row'>
                <img
                  src={SampleProduct}
                  className='mr-3'
                  style={{ width: 60, height: 60 }}
                />

                <div>
                  <strong className='my-0' style={{ fontSize: 13 }}>
                    Nike
                  </strong>
                  <p
                    className='my-0'
                    style={{ fontSize: 13, color: '#2E1D3A' }}
                  >
                    Metcon 6
                  </p>
                  <strong className='my-0' style={{ fontSize: 13 }}>
                    $130.00{' '}
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
                />
                <img src={NikeIcon} alt='icon' className='ml-3' />
              </Col>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}
