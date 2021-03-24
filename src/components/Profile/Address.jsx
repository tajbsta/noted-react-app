import React from 'react';
import USA_STATES from '../../assets/usa_states.json';
import { Form, Button, Row, Col } from 'react-bootstrap';

export default function Address({
  fullName,
  state,
  zipCode,
  line1,
  line2,
  phoneNumber,
  errors,
  handleChange,
  onDoneClick,
}) {
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
                  <Form.Control
                    className='form-control-lg'
                    type='name'
                    name='fullName'
                    value={fullName}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>State</Form.Label>
                  <Form.Control
                    className='form-control-md'
                    as='select'
                    value={state || ''}
                    name='state'
                    onChange={handleChange}
                    placeholder='Select State'
                    defaultValue='null'
                  >
                    {[
                      { abbreviation: '', name: 'Select State' },
                      ...USA_STATES,
                    ].map(({ name, abbreviation }) => (
                      <option value={abbreviation} key={`${abbreviation}`}>
                        {name}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Zip Code</Form.Label>
                  <Form.Control
                    className='form-control-sm'
                    type='zip code'
                    name='zipCode'
                    value={zipCode}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>Address Line 1</Form.Label>
                  <Form.Control
                    className='form-control-lg'
                    type='name'
                    name='line1'
                    value={line1}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    className='form-control-lg'
                    type='phone number'
                    name='phoneNumber'
                    value={phoneNumber}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col xs={6}>
                <Form.Group>
                  <Form.Label va>Address Line 2</Form.Label>
                  <Form.Control
                    className='form-control-lg'
                    type='name'
                    name='line2'
                    value={line2}
                    onChange={handleChange}
                  />
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
                <Button
                  className='btn-done'
                  type='submit'
                  onClick={(e) => {
                    e.preventDefault();
                    onDoneClick();
                  }}
                >
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
