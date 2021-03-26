import React, { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';

export default function Payment({
  fullName,
  cardNumber,
  expirationMonth,
  expirationYear,
  cvc,
  errors,
  handleChange,
  onDoneClick,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const noBorder = !isEditing
    ? {
        style: {
          border: 'none',
        },
        disabled: true,
      }
    : {};
  return (
    <div>
      <div className='container mt-6'>
        <div className='row'>
          <div className='col-sm-9 mt-4'>
            <h3 className='sofia-pro text-18 mb-3-profile'>Payment Method</h3>
            <div className='card shadow-sm mb-2 p-3 w-840'>
              <div className='card-body'>
                <Form id='PaymentForm'>
                  <Row>
                    <Col xs={6}>
                      <Form.Group>
                        <Form.Label>Cardholder Name</Form.Label>
                        <Form.Control
                          className='form-control-lg'
                          type='name'
                          name='fullName'
                          value={fullName}
                          onChange={handleChange}
                          {...noBorder}
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group>
                        <Form.Label>Expiration Date</Form.Label>
                        <div className='exp-form'>
                          <Form.Control
                            className='form-control-sm'
                            name='expirationMonth'
                            value={expirationMonth}
                            onChange={handleChange}
                            {...noBorder}
                          />
                          <div className='separator'>
                            <h4>&nbsp;&nbsp;/&nbsp;&nbsp;</h4>
                          </div>
                          <Form.Control
                            className='form-control-sm'
                            name='expirationYear'
                            value={expirationYear}
                            onChange={handleChange}
                            {...noBorder}
                          />
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col xs={6}>
                      <Form.Group>
                        <Form.Label>Card Number</Form.Label>
                        <Form.Control
                          className='form-control-lg'
                          name='cardNumber'
                          value={cardNumber}
                          onChange={handleChange}
                          {...noBorder}
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={6} md={3}>
                      <Form.Group>
                        <Form.Label>CVC</Form.Label>
                        <Form.Control
                          className='form-control-sm'
                          type='phone number'
                          name='cvc'
                          value={cvc}
                          onChange={handleChange}
                          {...noBorder}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col className='btn-container'>
                      {isEditing && (
                        <Button
                          className='btn-save'
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
                          className='btn-save'
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
        </div>
      </div>
    </div>
  );
}
