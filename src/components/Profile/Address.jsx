import React from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';

export default function Address() {
  return (
    <div>
      <h3 className='sofia-pro text-18 mb-4'>Pick-up Address</h3>
      <div className='card shadow-sm mb-2 p-3 w-840'>
        <div className='card-body'>
          <Form id='AddressForm'>
            <Row>
              <Col xs={6}>
                <Form.Group>
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control className='form-control-lg' type='name' />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>State</Form.Label>
                  <Form.Control className='form-control-md' as='select'>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Zip Code</Form.Label>
                  <Form.Control className='form-control-sm' type='zip code' />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>Address Line 1</Form.Label>
                  <Form.Control className='form-control-lg' type='name' />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    className='form-control-lg'
                    type='phone number'
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col xs={6}>
                <Form.Group>
                  <Form.Label>Address Line 2</Form.Label>
                  <Form.Control className='form-control-lg' type='name' />
                </Form.Group>
              </Col>

              <Col className='add-pick-up'>
                <div>
                  <h4 className='noted-purple text-instructions'>
                    Add pick-up instructions
                  </h4>
                </div>
              </Col>

              <Col className='btn-container'>
                <Button className='btn-done' type='submit'>
                  Done
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    </div>
  );
}
