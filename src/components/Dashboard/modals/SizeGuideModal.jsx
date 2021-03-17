import React from 'react';
import { Modal, Button, Container, Row, Col } from 'react-bootstrap';
import SizeGuideImg from '../../../../src/assets/img/SizeGuide.svg';

export default function SizeGuideModal(props) {
  return (
    <Modal
      {...props}
      size='lg'
      aria-labelledby='contained-modal-title-vcenter'
      centered
      backdrop='static'
      keyboard={false}
      modalOptions={{ dismissible: false }}
      id='SizeGuideModal'
    >
      <Modal.Header>
        <Modal.Title id='contained-modal-title-vcenter'>
          noted return size guide
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className='sofia-pro'>
        <p className='sofia-pro info'>
          One noted pick-up order should fit in one of our custom boxes. They
          are 12”W x 12”H x 20”L box. If your item don’t fit you may be charged
          an extra order, of the price of the first one you purchased.
        </p>
        <Container>
          <Row>
            <Col xs={12} md={8}>
              <img src={SizeGuideImg} />
            </Col>
            <Col xs={6} md={5}>
              <h4>Typically fit:</h4>
              <ul>
                <li>5 T-shirts</li>
                <li>3 Shoe boxes</li>
                <li>4 pairs of pants</li>
              </ul>
            </Col>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button className='btn-ok' onClick={props.onHide}>
          OK, Got it
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
