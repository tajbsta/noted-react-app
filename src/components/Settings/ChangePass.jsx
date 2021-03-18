import React from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

export default function ChangePass() {
  return (
    <div>
      <div className='mt-5'>
        <h3 className='sofia-pro text-18 mb-4'>Change Password</h3>
        <div className='card shadow-sm mb-2 p-3 w-840'>
          <div className='card-body'>
            <Form id='AddressForm'>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>Old Password</Form.Label>
                    <Form.Control className='form-control-lg' type='name' />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                      className='form-control-lg'
                      type='phone number'
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col xs={6}></Col>
                <Col xs={6}>
                  <Form.Group>
                    <Form.Label>Confirm New Password</Form.Label>
                    <Form.Control
                      className='form-control-lg'
                      type='phone number'
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* <Row>
              <Col>
                <Button className='btn-done' type='submit'>
                  Done
                </Button>
              </Col>
            </Row> */}
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
