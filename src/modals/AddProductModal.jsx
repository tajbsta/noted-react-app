import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import ProductPlaceholder from '../assets/img/ProductPlaceholder.svg';

export default function AddProductModal(props) {
  return (
    <div>
      <Modal
        {...props}
        size='lg'
        aria-labelledby='contained-modal-title-vcenter'
        centered
        backdrop='static'
        keyboard={false}
        id='AddProductModal'
      >
        <Modal.Body className='sofia-pro'>
          <Form id='passForm'>
            <Row>
              <Col xs={2}>
                <Form.Group controlId='image'>
                  <Form.Label>Image</Form.Label>
                  {/* <div className='product-img-container'>
                    <img className='product-img' src={ProductPlaceholder} />
                  </div> */}

                  {/* <div className='avatar-wrapper'>
                    <img className='profile-pic' src='' />
                    <div className='upload-button'>
                      <i
                        className='fa fa-arrow-circle-up'
                        aria-hidden='true'
                      ></i>
                    </div>
                    <input
                      className='file-upload'
                      type='file'
                      accept='image/*'
                    />
                  </div> */}
                </Form.Group>
              </Col>
              <Col>
                <Row>
                  <Col>
                    <Form.Group controlId='productUrl'>
                      <Form.Label>Product URL</Form.Label>
                      <Form.Control />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group controlId='merchant'>
                      <Form.Label>Merchant</Form.Label>
                      <div>
                        <Form.Control />
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group controlId='productName'>
                      <Form.Label>Product Name</Form.Label>
                      <div>
                        <Form.Control />
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group controlId='merchant'>
                      <Form.Label>Merchant</Form.Label>
                      <div>
                        <Form.Control />
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group controlId='price'>
                      <Form.Label>Price</Form.Label>
                      <div>
                        <Form.Control />
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group controlId='returnDocuments'>
                      <Form.Label>
                        Return Documents (ie. Amazon QR code, receipts, and
                        shipping labels)
                      </Form.Label>
                      <div>
                        <Form.Control />
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
              </Col>
            </Row>

            <Row>
              <Col className='btn btn-container'>
                <Button className='btn-cancel' onClick={props.onHide}>
                  Cancel
                </Button>
                <Button className='btn-save' type='submit'>
                  Save Changes
                </Button>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
