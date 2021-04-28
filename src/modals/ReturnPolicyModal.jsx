import { get } from 'lodash-es';
import React from 'react';
import { Modal, Button, Row, Col } from 'react-bootstrap';
import { RETURN_SCORES } from '../constants/returns/scores';
import ReturnScore from '../components/ReturnsScore';
import ProductPlaceholder from '../assets/img/ProductPlaceholder.svg';

export default function ReturnPolicyModal(props) {
  const { item } = props;
  const thumbnail = get(item, 'vendor_data.thumbnail', '');
  const policy = get(item, 'vendor_data.policy', '');
  const website = get(item, 'vendor_data.website', '');
  const rating = get(item, 'vendor_data.rating', 1);
  const score = RETURN_SCORES.find(
    ({ rating: returnRating }) => rating === returnRating
  );
  const scoreTitle = get(score, 'title', '');
  const vendor = get(item, 'vendor_name', '');

  return (
    <Modal
      {...props}
      size='lg'
      aria-labelledby='contained-modal-title-vcenter'
      centered
      backdrop='static'
      keyboard={false}
      animation={false}
      id='ReturnPolicyModal'
    >
      <Modal.Header>
        <Modal.Title id='contained-modal-title-vcenter'>
          Return Policy
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className='sofia-pro'>
        <Row className='b-row'>
          <Col xs={4}>
            <div className='brand-group'>
              <img
                src={thumbnail || ProductPlaceholder}
                onError={(e) => {
                  e.currentTarget.src = ProductPlaceholder;
                }}
                alt=''
                className='brand-img'
              />
              <h4 className='sofia-pro brand'>{vendor}</h4>
            </div>
          </Col>
          <Col className='score-col'>
            <ReturnScore score={item.vendor_data.rating} />
            <h4 className='ml-2 sofia-pro text-score'>{scoreTitle}</h4>
          </Col>
        </Row>
        <Row className='ml-1'>
          {' '}
          <p className='sofia-pro info'>
            {policy == '' ? 'This is empty.' : policy}
          </p>
        </Row>
        <Row className='ml-1'>
          <a className='sofia-pro view-link' href={website} target="_blank" rel="noreferrer">
            View website
          </a>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button className='btn-ok' onClick={props.onHide}>
          OK, Got it
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
