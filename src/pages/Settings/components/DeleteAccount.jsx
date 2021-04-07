import React from 'react';
import { Row, Col } from 'react-bootstrap';

export default function DeleteAccount() {
  return (
    <div id='DeleteAccount'>
      <div className='mt-5'>
        <h3 className='sofia-pro text-18 mb-4'>Delete Account</h3>

        <div className='card shadow-sm mb-2 w-840 change-container'>
          <div className='card-body'>
            <Row>
              <Col>
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
