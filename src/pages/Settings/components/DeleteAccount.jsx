import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';

export default function DeleteAccount() {
  const [isMobile, setIsMobile] = useState(false);

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
    <div id='DeleteAccount'>
      <div className='mt-5'>
        <h3 className='sofia-pro text-18 mb-4'>Delete Account</h3>

        <div className='card shadow-sm mb-2 max-w-840 change-container'>
          <div className='card-body'>
            <Row>
              <Col style={{ flexBasis: isMobile ? 'auto' : '0' }}>
                <h4 className='delete-info'>
                  Deleting your account will permanently clear all scanned items
                  and account information. All open orders will continue to be
                  picked up and charged unless canceled through the order
                  history page.
                </h4>
              </Col>
              <Col className='d-flex justify-content-center'>
                <button className='btn btn-delete'>Delete Account</button>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </div>
  );
}
