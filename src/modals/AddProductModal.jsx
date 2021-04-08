import React, { useState, useCallback, useRef } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import ProductPlaceholder from '../assets/img/ProductPlaceholder.svg';
import { UploadCloud } from 'react-feather';
import { useDropzone } from 'react-dropzone';
import Flatpickr from 'react-flatpickr';

export default function AddProductModal(props) {
  const [file, setFile] = useState('');
  const [loading, setLoading] = useState(false);

  const hiddenFileInput = React.useRef(null);

  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');
      reader.onload = () => {
        // Do whatever with the file contents
        const binaryStr = reader.result;
        console.log(binaryStr);
      };
      reader.readAsArrayBuffer(file);
    });
  }, []);
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

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
                  <div className='img-container'>
                    <img
                      src={ProductPlaceholder}
                      className={`${
                        file ? 'no-placeholder' : 'default-placeholder'
                      }`}
                    />
                    {file && <ImageThumb image={file} />}
                    <div className='upload-button'>
                      <i
                        className='fa fa-upload-icon'
                        aria-hidden='true'
                        onClick={handleClick}
                        style={{ cursor: 'pointer' }}
                      >
                        <UploadCloud />
                        <input
                          style={{ display: 'none' }}
                          className='file-upload'
                          type='file'
                          accept='.jpg, .jpeg, .png'
                          onChange={handleUpload}
                          ref={hiddenFileInput}
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
                    <Form.Group controlId='orderDate'>
                      <Form.Label>Order Date</Form.Label>
                      <div>
                        <Flatpickr
                          className='c-date-picker'
                          options={{
                            dateFormat: 'M j, Y',
                            monthSelectorType: 'static',
                            showMonths: 1,
                          }}
                        />
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
                      <Form.Label className='documents-title'>
                        Return Documents{' '}
                        <small style={{ fontSize: '12px' }}>
                          (ie. Amazon QR code, receipts, and shipping labels)
                        </small>
                      </Form.Label>
                      <div className='dropzone-container' {...getRootProps()}>
                        <input {...getInputProps()} />
                        <p className='sofia-pro text-drag'>
                          Drag & drop or click to upload
                        </p>
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
