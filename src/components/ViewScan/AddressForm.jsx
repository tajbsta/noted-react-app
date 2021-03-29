import React, { useEffect, useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { formatPhoneNumber } from '../../utils/form';
import USA_STATES from '../../assets/usa_states.json';
import { isFormEmpty } from '../../utils/form';
import $ from 'jquery';
import AddPickupModal from '../../modals/AddPickupModal';

export default function AddressForm({
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
  const [modalShow, setModalShow] = useState(false);

  const disableSubmit =
    isFormEmpty({
      fullName,
      state,
      zipCode,
      line1,
      line2,
      phoneNumber,
    }) || !isFormEmpty({ ...errors });

  const renderInlineError = (error) => (
    <small className='form-text p-0 m-0 noted-red'>{error}</small>
  );

  useEffect(() => {
    const platform = window.navigator.platform;
    const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];

    if (windowsPlatforms.indexOf(platform) !== -1) {
      // Windows 10 Chrome
      $('.btn-done').css('padding-top', '9px');
    }
  }, []);

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
                          isInvalid={errors.fullName}
                          className='form-control-lg'
                          onChange={(e) => {
                            if (/^[a-zA-Z\s]*$/g.test(e.target.value)) {
                              handleChange(e);
                            }
                          }}
                          type='name'
                          name='fullName'
                          value={fullName || ''}
                        />
                        {renderInlineError(errors.fullName)}
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
                            <option
                              value={abbreviation}
                              key={`${abbreviation}`}
                            >
                              {name}
                            </option>
                          ))}
                        </Form.Control>
                        {renderInlineError(errors.state)}
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group>
                        <Form.Label>Zip Code</Form.Label>
                        <Form.Control
                          className='form-control-sm'
                          onChange={(e) => {
                            const re = /^[0-9\b]+$/;
                            if (
                              e.target.value === '' ||
                              re.test(e.target.value)
                            ) {
                              handleChange(e);
                            }
                          }}
                          type='zip code'
                          value={zipCode || ''}
                          name='zipCode'
                          maxLength={6}
                        />
                        {zipCode.length > 0 &&
                          renderInlineError(errors.zipCode)}
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col>
                      <Form.Group>
                        <Form.Label>Address Line 1</Form.Label>
                        <Form.Control
                          className='form-control-lg'
                          onChange={handleChange}
                          type='name'
                          value={line1 || ''}
                          name='line1'
                        />
                        {line1.length > 0 && renderInlineError(errors.line1)}
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group>
                        <Form.Label>Phone</Form.Label>
                        <Form.Control
                          className='form-control-lg'
                          onChange={(e) => {
                            const re = /^[0-9\b]+$/;
                            if (
                              e.target.value === '' ||
                              re.test(e.target.value)
                            ) {
                              handleChange(e);
                            }
                          }}
                          value={formatPhoneNumber(phoneNumber) || ''}
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
                          className='form-control-lg'
                          type='name'
                          value={line2 || ''}
                          name='line2'
                          onChange={handleChange}
                        />
                        {line2.length > 0 && renderInlineError(errors.line2)}
                      </Form.Group>
                    </Col>

                    <Col className='add-pick-up'>
                      <button
                        className='btn-instructions'
                        onClick={() => setModalShow(true)}
                      >
                        <h4 className='text-instructions'>
                          Add pick-up instructions
                        </h4>
                      </button>
                    </Col>

                    <AddPickupModal
                      show={modalShow}
                      onHide={() => setModalShow(false)}
                    />

                    <Col className='btn-container'>
                      <Button
                        disabled={disableSubmit}
                        className='btn-done'
                        onClick={onDoneClick}
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
