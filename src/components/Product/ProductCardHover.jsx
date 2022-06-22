import React, { useState, useEffect, useRef } from 'react';
import ReturnPolicyModal from '../../modals/ReturnPolicyModal';
import moment from 'moment';
import { get } from 'lodash';
import { RETURN_SCORES } from '../../constants/returns/scores';
import ReturnScore from './ReturnsScore';
import { useHistory } from 'react-router';
import { Col, Row, Overlay, Tooltip } from 'react-bootstrap';
import ArchiveIcon from '../../assets/icons/archive-icon.svg';

export default function ProductCardHover({ item, onArchive, onEdit }) {
  const {
    location: { pathname },
  } = useHistory();
  const [modalPolicyShow, setModalPolicyShow] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentScore, setCurrentScore] = useState(null);
  const target = useRef(null);
  const [showToolTip, setShowToolTip] = useState(false);

  useEffect(() => {
    const vendorRating = get(item, 'vendor_data.rating', 0);
    const score = RETURN_SCORES.find(({ rating }) => vendorRating === rating);
    setCurrentScore(score);
  }, []);
  // Check if device is mobile
  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 991);
    }
    handleResize(); // Run on load to set the default value
    window.addEventListener('resize', handleResize);
    // Clean up event listener
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  const inDashboard = ['/dashboard'].includes(pathname);
  const inCheckout = ['/checkout'].includes(pathname);

  const RenderRating = (
    <Row className='render-rating text-left-3'>
      <Col
        xs={2}
        style={{
          paddingLeft: 0,
        }}
      >
        <span className='score-container mr-2 d-flex'>
          <ReturnScore score={get(item.vendor_data, 'rating', 0)} />
        </span>
      </Col>
      <Col xs={10}>
        <Row xs={10}>
          <p className='text-14 sofia-pro line-height-16 text-score'>
            {get(currentScore, 'title', '')}
          </p>
        </Row>
        <Row xs={8}>
          <button
            className='btn-policy sofia-pro btn p-0 pt-1'
            onClick={() => setModalPolicyShow(true)}
          >
            Return policy
          </button>
        </Row>
      </Col>
    </Row>
  );

  return (
    <div>
      {!isMobile && (
        <div id='OnHoverProductCard'>
          <Row className='flex align-items-center justify-content-center flex-nowrap mr-2'>
            {inDashboard && (
              <>
                <Col sm={5} className='edit'>
                  <h4 className='date text-14 sofia-pro line-height-16'>
                    {item.order_date
                      ? moment(item.order_date).format('MMM DD, YYYY')
                      : '----'}
                  </h4>
                  {item.provider === 'manual' && (
                    <div className='info-container'>
                      <p className='text-wrong-info sofia-pro'>
                        Wrong info?&nbsp;
                      </p>
                      <div
                        disabled
                        className='btn-hover-edit sofia-pro btn'
                        onClick={onEdit}
                      >
                        Edit
                      </div>
                    </div>
                  )}
                </Col>

                <Col sm={2}>
                  <img
                    src={ArchiveIcon}
                    alt='archive'
                    className='sofia-pro archive'
                    ref={target}
                    onMouseOver={() => setShowToolTip(true)}
                    onMouseLeave={() => setShowToolTip(false)}
                    onClick={() => onArchive(item._id)}
                  />
                </Col>
              </>
            )}

            <Col sm={inCheckout ? 12 : 5}>{RenderRating}</Col>

            {/* <Col sm={2}>
              <img
                src={vendorThumbnail || ProductPlaceholder}
                onError={(e) => {
                  e.currentTarget.src = ProductPlaceholder;
                }}
                alt=''
                className='avatar-img ml-2 rounded-circle noted-border brand-img'
                style={{
                  width: 35,
                  height: 35,
                  objectFit: 'contain',
                  background: '#fff',
                }}
              />
            </Col> */}
          </Row>
        </div>
      )}

      <ReturnPolicyModal
        item={item}
        show={modalPolicyShow}
        onHide={() => {
          setModalPolicyShow(false);
        }}
      />

      <Overlay target={target.current} show={showToolTip} placement='bottom'>
        {(props) => (
          <Tooltip id='overlay-example' {...props}>
            <span style={{ fontFamily: 'Sofia Pro !important' }}>
              Archive your item
            </span>
          </Tooltip>
        )}
      </Overlay>
    </div>
  );
}
