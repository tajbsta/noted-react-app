import React, { useState } from 'react';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import AddEmailModal from '../../../modals/AddEmailModal';

export default function EmailAddresses({ user }) {
  const [modalShow, setModalShow] = useState(false);

  console.log({ user });
  return (
    <div id='EmailAddresses'>
      <h3 className='sofia-pro text-18 mb-3 mt-5'>Email Addresses</h3>
      <div className='card shadow-sm mb-2 w-840'>
        <div className='card-body'>
          <Container>
            <Row>
              <Col className='info-col'>
                <h4 className='section-info'>
                  Here you will find all the email addresses we use to search
                  for the products you have purchased.
                </h4>
                <h4 className='section-info'>
                  You can change your primary email address in the section
                  below.
                </h4>
              </Col>
              <Col className='email-column'>
                <Form>
                  <Row>
                    <Col>
                      <Form.Group controlId='exampleForm.ControlInput1'>
                        <Form.Label>Account email</Form.Label>
                        {/* <Form.Control
                          type='email'
                          placeholder={user && user.email}
                        /> */}
                        <div className='master-email'>
                          <h4>{user && user.email}</h4>
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Form.Group controlId='exampleForm.ControlInput2'>
                        <div className='title-group'>
                          <Form.Label>Email #1</Form.Label>
                          <Button className='btn delete-email'>
                            Delete email
                          </Button>
                        </div>
                        <Form.Control
                          type='email'
                          placeholder='name@example.com'
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Form.Group controlId='exampleForm.ControlInput1'>
                        <div className='title-group'>
                          <Form.Label>Email #2</Form.Label>
                          <Button className='btn delete-email'>
                            Delete email
                          </Button>
                        </div>
                        <Form.Control
                          type='email'
                          placeholder='name@example.com'
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Form>
                <Row className='button-row'>
                  <Col className='btn-add-container'>
                    <Button
                      className='add-new-email'
                      onClick={() => setModalShow(true)}
                    >
                      Add new email
                    </Button>
                  </Col>
                </Row>
                <AddEmailModal
                  show={modalShow}
                  onHide={() => setModalShow(false)}
                />
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </div>
  );
}
