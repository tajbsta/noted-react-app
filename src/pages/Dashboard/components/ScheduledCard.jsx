import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Col, Row } from 'react-bootstrap';
import NoteeIcon from '../../../assets/icons/NoteeIcon.svg';
import { useSelector } from 'react-redux';
import { get } from 'lodash-es';

export default function ScheduledCard() {
  const [isMobile, setIsMobile] = useState(false);
  const { scheduledReturns } = useSelector(
    ({ auth: { scheduledReturns } }) => ({
      scheduledReturns,
    })
  );

  const allScheduledItems = scheduledReturns
    .map((scheduledReturn) => {
      return get(scheduledReturn, 'items', []);
    })
    .flat();

  const history = useHistory();

  const profile = () => {
    history.push('/profile');
  };

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 540);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  return (
    <div className='col sched-col' id='ScheduledCard'>
      <div className='card'>
        <div className='card-body'>
          <Row style={{ alignItems: 'center' }}>
            <Col xs={1} className='icon-col'>
              <div className='notee-container'>
                <img src={NoteeIcon} />
              </div>
            </Col>
            {!isMobile && (
              <>
                <Col xs={6} className='info-col'>
                  <Row>
                    <div className='title'>Your scheduled return</div>
                  </Row>
                  <Row>
                    <div className='items-info'>
                      You have {get(allScheduledItems, 'length', 0)} items
                      scheduled for return
                    </div>
                  </Row>
                </Col>
                <Col className='button-col'>
                  <div>
                    <button
                      className='btn btn-view-scheduled'
                      onClick={profile}
                    >
                      View scheduled returns
                    </button>
                  </div>
                </Col>
              </>
            )}
            {/* START OF MOBILE VIEWS */}
            {isMobile && (
              <>
                <Col className='info-col ml-5'>
                  <Row>
                    <div className='title'>Your scheduled return</div>
                  </Row>
                  <Row>
                    <div className='items-info'>
                      You have {get(allScheduledItems, 'length', 0)} items
                      scheduled for return
                    </div>
                  </Row>
                  <Row>
                    <button
                      className='btn btn-view-scheduled'
                      onClick={profile}
                    >
                      View scheduled returns
                    </button>
                  </Row>
                </Col>
              </>
            )}
            {/* END OF MOBILE VIEWS*/}
          </Row>
        </div>
      </div>
    </div>
  );
}
