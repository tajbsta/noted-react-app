import React from 'react';
import { Col, Row } from 'react-bootstrap';
import ProductPlaceholder from '../../../assets/img/ProductPlaceholder.svg';

export default function ScheduledReturn() {
  const products = [ProductPlaceholder, ProductPlaceholder, ProductPlaceholder];
  const list = products.map((product) => (
    <li key={product}>
      <img src={ProductPlaceholder} />
    </li>
  ));
  return (
    <div id='ScheduledReturn'>
      <h3 className='sofia-pro text-18 mb-3-profile mb-0 triggerText'>
        Your scheduled return
      </h3>
      <div className='card mt-4'>
        <div className='card-body'>
          <Row className='align-items-center'>
            <Col xs={2} className='title-col'>
              <Row>
                <div className='title'>Scheduled Return</div>
              </Row>
              <Row>
                <div className='total'>16 items in total</div>
              </Row>
            </Col>
            <Col className='product-img-col'>{list}</Col>
            <Col xs={1} className='plus-more'>
              +2 more...
            </Col>
            <Col xs={3} className='button-col'>
              <div>
                <button className='btn btn-show'>Show details</button>
                <span className='arrow'>▼</span>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
}
