import React, { useEffect, useState } from 'react';
import USA_STATES from '../../assets/usa_states.json';
import { formatPhoneNumber } from '../../utils/form';
import { Form, Button, Row, Col } from 'react-bootstrap';
import $ from 'jquery';

export default function Address({ state, phoneNumber, handleChange }) {
  const [isEditing, setIsEditing] = useState(false);
  useEffect(() => {
    const platform = window.navigator.platform;
    const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];

    if (windowsPlatforms.indexOf(platform) !== -1) {
      // Windows 10 Chrome
      $('.btn-done').css('padding-bottom', '10px');
    }
  }, []);

  const noBorder = !isEditing
    ? {
        style: {
          border: 'none',
          padding: '0px',
        },
        disabled: true,
      }
    : {};
  return (
    <div id='BasicInfo'>
      <h3 className='sofia-pro text-18 mb-3-profile'>Pick-up Address</h3>
      <div className='card shadow-sm mb-2 p-3 w-840'>
        <div className='card-body'>
          <Form id='Address'>
            <Row>
              <Col xs={6}>
                <Form.Group>
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    className='form-control-lg'
                    type='name'
                    {...noBorder}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>State</Form.Label>

                  <Form.Control
                    className='form-control-md'
                    as='select'
                    value={state}
                    name='state'
                    onChange={handleChange}
                    placeholder='Select State'
                    defaultValue='null'
                    {...noBorder}
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

                  {/* {!isEditing && (
                    <Form.Control
                      className='form-control-sm'
                      type='zip code'
                      value={state}
                      {...noBorder}
                    />
                  )} */}
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Zip Code</Form.Label>
                  <Form.Control
                    className='form-control-sm'
                    type='zip code'
                    {...noBorder}
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
                    {...noBorder}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    className='form-control-lg'
                    type='phone number'
                    onChange={(e) => {
                      const re = /^[0-9\b]+$/;
                      if (e.target.value === '' || re.test(e.target.value)) {
                        handleChange(e);
                      }
                    }}
                    value={formatPhoneNumber(phoneNumber) || ''}
                    name='phoneNumber'
                    maxLength={13}
                    {...noBorder}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col xs={6}>
                <Form.Group>
                  <Form.Label>Address Line 2</Form.Label>
                  <Form.Control
                    className='form-control-lg'
                    type='name'
                    {...noBorder}
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
                {isEditing && (
                  <Button
                    className='btn-done'
                    type='submit'
                    onClick={(e) => {
                      e.preventDefault();
                      setIsEditing(false);
                    }}
                  >
                    Done
                  </Button>
                )}
                {!isEditing && (
                  <Button
                    className='btn-done'
                    type='submit'
                    onClick={(e) => {
                      e.preventDefault();
                      setIsEditing(true);
                    }}
                  >
                    Edit
                  </Button>
                )}
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    </div>
  );
}
