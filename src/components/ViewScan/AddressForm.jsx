import React from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { formatPhoneNumber } from '../../utils/form';
import USA_STATES from '../../assets/usa_states.json';
import { isFormEmpty } from '../../utils/form';

export default function AddressForm({
  fullName,
  state,
  zipCode,
  line1,
  line2,
  phoneNumber,
  errors,
  handleChange,
  setShowEditAddress,
}) {
  return (
    <div>
      <div className='container mt-0'>
        <div className='row'>
          <div className='col-sm-9 mt-2'>
            <h3 className='sofia-pro text-18 mb-4'>Pick-up Address</h3>
            <div className='card shadow-sm mb-2 p-3 w-840'>
              <div className='card-body'>
                <Form id='AddressForm' onSubmit={(e) => e.preventDefault()}>
                  <Row>
                    <Col xs={6}>
                      <Form.Group>
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control
                          onChange={handleChange}
                          type='name'
                          name='fullName'
                          value={fullName}
                          isInvalid={errors.fullName}
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group>
                        <Form.Label>State</Form.Label>
                        <Form.Control
                          as='select'
                          value={state}
                          name='state'
                          onChange={handleChange}
                          placeholder='Select State'
                        >
                          {USA_STATES.map(({ name, abbreviation }, index) => (
                            <option
                              value={abbreviation}
                              key={`${index - name - abbreviation}`}
                            >
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
                          onChange={handleChange}
                          type='zip code'
                          value={zipCode}
                          name='zipCode'
                          maxLength={6}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col>
                      <Form.Group>
                        <Form.Label>Address Line 1</Form.Label>
                        <Form.Control
                          onChange={handleChange}
                          type='name'
                          value={line1}
                          name='line1'
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group>
                        <Form.Label>Phone</Form.Label>
                        <Form.Control
                          onChange={handleChange}
                          value={formatPhoneNumber(phoneNumber)}
                          name='phoneNumber'
                          maxLength={13}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col xs={6}>
                      <Form.Group>
                        <Form.Label>Address Line 2</Form.Label>
                        <Form.Control
                          type='name'
                          value={line2}
                          name='line2'
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>

                    <Col className='add-pick-up'>
                      <div>
                        <h4 className='noted-purple'>
                          Add pick-up instructions
                        </h4>
                      </div>
                    </Col>

                    <Col className='btn-container'>
                      <Button
                        disabled={isFormEmpty({
                          fullName,
                          state,
                          zipCode,
                          line1,
                          line2,
                          phoneNumber,
                        })}
                        className='btn-done'
                        onClick={() => setShowEditAddress(false)}
                      >
                        Done
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
