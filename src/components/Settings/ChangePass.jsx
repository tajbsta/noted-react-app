import React from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { Auth } from 'aws-amplify';

export default function ChangePass() {
  Auth.currentAuthenticatedUser()
    .then((user) => {
      return Auth.changePassword(user, 'oldPassword', 'newPassword');
    })
    .then((data) => console.log(data))
    .catch((err) => console.log(err));

  return (
    <div>
      <div className='mt-5'>
        <h3 className='sofia-pro text-18 mb-4'>Change Password</h3>
        <div className='card shadow-sm mb-2 p-3 w-840 change-container'>
          <div className='card-body'>
            <Form id='AddressForm'>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>Old Password</Form.Label>
                    <Form.Control
                      className='form-control-lg'
                      type='oldPassword'
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                      className='form-control-lg'
                      type='newPassword'
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
                      type='confirmNewPassword'
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col className='btn btn-container'>
                  <Button className='btn-change' type='submit'>
                    Change Password
                  </Button>
                </Col>
              </Row>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
