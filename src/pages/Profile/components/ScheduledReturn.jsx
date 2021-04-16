import React, { useState } from 'react';
import { Col, Row, Accordion, Card, Button } from 'react-bootstrap';
import Collapsible from 'react-collapsible';
import ProductPlaceholder from '../../../assets/img/ProductPlaceholder.svg';
import ReturnScore from '../../../components/ReturnsScore';

export default function ScheduledReturn() {
  const [activeKey, setActiveKey] = useState('1');
  const products = [ProductPlaceholder, ProductPlaceholder, ProductPlaceholder];
  const list = products.map((product) => (
    <li key={product}>
      <img src={ProductPlaceholder} />
    </li>
  ));
  return (
    <div id='ScheduledReturn'>
      <div className='row'>
        <Accordion
          className='accordion-container'
          defaultActiveKey='1'
          activeKey={activeKey}
          onChange={(e) => console.log(e)}
        >
          <h3 className='sofia-pro text-18 mb-3-profile mb-3 triggerText ml-3'>
            Your scheduled return
          </h3>
          <Card>
            {activeKey === '1' && (
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
                      <button
                        className='btn btn-show'
                        onClick={() => setActiveKey('0')}
                      >
                        Show details
                      </button>
                      <span className='arrow'>▼</span>
                    </div>
                  </Col>
                </Row>
              </div>
            )}
            <Accordion.Collapse eventKey='0'>
              <div className='p-4'>
                {/**
                 * IS A CARD PRODUCT
                 */}
                <Row
                  className='align-items-center'
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <Col xs={2} className='title-col'>
                    <Row>
                      <div className='title'>Scheduled Return</div>
                    </Row>
                    <Row>
                      <div className='total'>1 item total</div>
                    </Row>
                  </Col>
                  <Col xs={2} className='title-col'>
                    <div className='button-col mr-3'>
                      <button
                        className='btn btn-show'
                        onClick={() => setActiveKey('1')}
                      >
                        Hide details
                      </button>
                      <span className='arrow'>▲</span>
                    </div>
                  </Col>
                </Row>
                <Row className='mt-4'>
                  <Col xs={1}>
                    <img src={ProductPlaceholder} />
                  </Col>
                  <Col className='ml-4 mt-2'>
                    <Row>
                      <h4 className='mb-0 sofia-pro mb-1 distributor-name text-18'>
                        Nordstorm
                      </h4>
                    </Row>
                    <Row>
                      <h5 className='sofia-pro mb-2 product-name'>
                        Long sleeve white shirt
                      </h5>
                    </Row>
                    <Row>
                      <h4 className='sofia-pro mb-0 product-price text-18'>
                        $58.29
                      </h4>
                    </Row>
                  </Col>

                  <Col xs={1} className='mr-4'>
                    <Row>
                      <Col
                        className='ml-0'
                        xs={1}
                        style={{ display: 'flex', alignItems: 'center' }}
                      >
                        <ReturnScore score={2} />
                      </Col>
                      <Col xs={1}>
                        <div className='m-brand-logo-cont'>
                          <img
                            src='https://pbs.twimg.com/profile_images/1159166317032685568/hAlvIeYD_400x400.png'
                            alt=''
                            className='m-brand-img'
                          />
                        </div>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <hr className='hr-line' />
                <Row className='action-container'>
                  <Col xs={2}>
                    <Row className='pick-up-duration-container'>
                      <h5 className='sofia-pro mb-2 product-name'>
                        Pick-up in
                      </h5>
                      <h4 className='sofia-pro product-price mt-1'>
                        {`59 minutes`}
                      </h4>
                    </Row>
                    <Row className='total-items-container'>
                      <h5 className='sofia-pro mb-2 product-name'>Total</h5>
                      <h4 className='sofia-pro product-price mt-1'>{`1 item`}</h4>
                    </Row>
                    <Row className='cancel-action-container'>
                      <button className='btn btn-show p-0  m-0'>
                        Cancel return
                      </button>
                    </Row>
                  </Col>
                </Row>
              </div>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      </div>
    </div>
  );
}
