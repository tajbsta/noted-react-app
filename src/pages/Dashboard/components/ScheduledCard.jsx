import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Col, Row } from 'react-bootstrap';
import NoteeIcon from '../../../assets/icons/NoteeIcon.svg';
import { getUserId } from '../../../api/auth';
import { getActiveOrderCounts } from '../../../api/orderApi';
import { showError } from '../../../library/notifications.library';
import { AlertCircle } from 'react-feather';

export default function ScheduledCard() {
  const [isMobile, setIsMobile] = useState(false);
  const [orderCount, setOrderCount] = useState(false);
  const [fetchingOrderCount, setFetchingOrderCount] = useState(false);

  const getOrderItemActiveCount = async () => {
    try {
      setFetchingOrderCount(true);
      const userId = await getUserId();
      const orderCount = await getActiveOrderCounts(userId);

      setFetchingOrderCount(false);
      setOrderCount(orderCount);
      // console.log(orderCount);
    } catch (error) {
      showError({
        message: (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <AlertCircle />
            <h4 className='ml-3 mb-0' style={{ lineHeight: '16px' }}>
              Error getting item count!
            </h4>
          </div>
        ),
      });
    }
  };

  useEffect(() => {
    getOrderItemActiveCount();
  }, []);

  const { totalReturns, totalDonations } = orderCount;

  const totalBoth = () => {
    totalReturns !== 0 && totalDonations !== 0;
  };

  const totalActiveCounts = () => {
    if (orderCount && totalReturns > 0 && totalDonations == 0) {
      return (
        <h4 className='items-info'>
          You have {totalReturns}{' '}
          {orderCount && totalReturns > 1 ? 'items' : 'item'} scheduled for
          return
        </h4>
      );
    } else if (orderCount && totalDonations > 0 && totalReturns == 0) {
      return (
        <h4 className='items-info'>
          You have {totalDonations}{' '}
          {orderCount && totalDonations > 1 ? 'items' : 'item'} scheduled for
          donate
        </h4>
      );
    } else if (totalBoth) {
      return (
        <h4 className='items-info'>
          You have {totalReturns}{' '}
          {orderCount && totalReturns > 1 ? 'items' : 'item'} scheduled for
          return and {totalDonations}{' '}
          {orderCount && totalDonations > 1 ? 'items' : 'item'} for donate
        </h4>
      );
    }
  };

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
                <img src={NoteeIcon} alt='NoteeIcon' />
              </div>
            </Col>
            {!isMobile && (
              <>
                <Col xs={6} className='info-col'>
                  <Row>
                    <div className='title'>Your scheduled return</div>
                  </Row>
                  <Row>
                    <div className='items-info'>{totalActiveCounts()}</div>
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
                    <div className='items-info'>{totalActiveCounts()}</div>
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
