import React, { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { Eye, EyeOff } from 'react-feather';
import { Auth } from 'aws-amplify';

export default function ChangePass() {
  const [oldPasswordShown, setOldPasswordShown] = useState(false);
  const [newPasswordShown, setNewPasswordShown] = useState(false);
  const [confirmPasswordShown, setConfirmPasswordShown] = useState(false);

  const toggleOldPasswordVisiblity = () => {
    setOldPasswordShown(oldPasswordShown ? false : true);
  };
  const toggleNewPasswordVisiblity = () => {
    setNewPasswordShown(newPasswordShown ? false : true);
  };
  const toggleConfirmPasswordVisiblity = () => {
    setConfirmPasswordShown(confirmPasswordShown ? false : true);
  };
  const eyeOff = <EyeOff />;
  const eye = <Eye />;

  const changePassword = async () => {
    try {
      Auth.currentAuthenticatedUser()
        .then((user) => {
          return Auth.changePassword(user, 'oldPassword', 'newPassword');
        })
        .then((data) => console.log(data))
        .catch((err) => console.log(err));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div id='ChangePass'>
      <div className='mt-5'>
        <h3 className='sofia-pro text-18 mb-4'>Change Password</h3>
        <div className='card shadow-sm mb-2 p-3 w-840 change-container'>
          <div className='card-body'>
            <Form id='AddressForm'>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>Old Password</Form.Label>
                    <div>
                      <Form.Control
                        className='form-control-lg'
                        type={oldPasswordShown ? 'text' : 'password'}
                      />
                      <i
                        className='fe-eye'
                        onClick={toggleOldPasswordVisiblity}
                      >
                        {oldPasswordShown ? eye : eyeOff}
                      </i>
                    </div>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>New Password</Form.Label>
                    <div>
                      <Form.Control
                        className='form-control-lg'
                        type={newPasswordShown ? 'text' : 'password'}
                      />
                      <i
                        className='fe-eye'
                        onClick={toggleNewPasswordVisiblity}
                      >
                        {newPasswordShown ? eye : eyeOff}
                      </i>
                    </div>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col xs={6}></Col>
                <Col xs={6}>
                  <Form.Group>
                    <Form.Label>Confirm New Password</Form.Label>
                    <div>
                      <Form.Control
                        className='form-control-lg'
                        type={confirmPasswordShown ? 'text' : 'password'}
                      />
                      <i
                        className='fe-eye'
                        onClick={toggleConfirmPasswordVisiblity}
                      >
                        {confirmPasswordShown ? eye : eyeOff}
                      </i>
                    </div>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col className='btn btn-container'>
                  <Button
                    className='btn-change'
                    type='submit'
                    onClick={changePassword}
                  >
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
