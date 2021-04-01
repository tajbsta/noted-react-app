import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import ProductPlaceholder from '../assets/img/ProductPlaceholder.svg';
import { UploadCloud } from 'react-feather';

export default function AddProductModal(props) {
  const [file, setFile] = useState('');
  const [loading, setLoading] = useState(false);

  // Handles file upload event and updates state
  const handleUpload = (event) => {
    // const file = event.target.files[0];
    setFile(event.target.files[0]);

    if (file && file.size > 5097152) {
      alert('File is too large! The maximum size for file upload is 5 MB.');
    }

    setLoading(true);

    // Upload file to server (code goes under)

    setLoading(false);
  };

  // Display Image Component
  const ImageThumb = ({ image }) => {
    return (
      <img
        src={URL.createObjectURL(image)}
        alt={image.name}
        className='product-placeholder'
      />
    );
  };

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
                  {/* <Form.Label>Image</Form.Label> */}

                  <div className='img-container'>
                    <img
                      src={ProductPlaceholder}
                      className={`${
                        file ? 'no-placeholder' : 'default-placeholder'
                      }`}
                    />
                    {file && <ImageThumb image={file} />}
                    <div className='upload-button'>
                      <i className='fa fa-upload-icon' aria-hidden='true'>
                        <UploadCloud />
                        <input
                          className='file-upload'
                          type='file'
                          accept='.jpg, .jpeg, .png'
                          onChange={handleUpload}
                        />
                      </i>
                    </div>
                  </div>
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
