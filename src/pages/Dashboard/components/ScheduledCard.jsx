import React from 'react';
import { Col, Row } from 'react-bootstrap';
import NoteeIcon from '../../../assets/icons/NoteeIcon.svg';

export default function ScheduledCard() {
  return (
    <div id='ScheduledCard'>
      <div className='card'>
        <div className='card-body'>
          <Row style={{ alignItems: 'center' }}>
            <Col xs={1} className='icon-col'>
              <div className='notee-container'>
                <img src={NoteeIcon} />
              </div>
            </Col>
            <Col xs={6}>
              <Row>
                <div className='title'>Your scheduled return</div>
              </Row>
              <Row>
                <div className='items-info'>
                  You have 8 items scheduled for return
                </div>
              </Row>
            </Col>
            <Col className='button-col'>
              <div>
                <button className='btn btn-view-scheduled'>
                  View scheduled returns
                </button>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
}
