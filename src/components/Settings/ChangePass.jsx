import React, { useState } from 'react';
import { Form, Button, Row, Col, Spinner } from 'react-bootstrap';
import { Eye, EyeOff } from 'react-feather';
import { Auth } from 'aws-amplify';
import { changePassErrors } from '../../library/errors.library';
import { PASSWORD_REGEX_FORMAT } from '../../constants/errors/regexFormats';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { get } from 'lodash';
import { AlertCircle } from 'react-feather';
import PassChangeSuccessModal from '../../modals/PassChangeSuccessModal';

export default function ChangePass() {
  const [oldPasswordShown, setOldPasswordShown] = useState(false);
  const [newPasswordShown, setNewPasswordShown] = useState(false);
  const [confirmPasswordShown, setConfirmPasswordShown] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [modalShow, setModalShow] = useState(null);

  const changePassSchema = Yup.object({
    oldPassword: Yup.string().required('Your old password is required'),
    newPassword: Yup.string()
      .required(
        'Your password must be 8-20 characters long and must contain a letter, symbol and a number'
      )
      .matches(PASSWORD_REGEX_FORMAT, {
        message:
          'Your password must be 8-20 characters long and must contain a letter, symbol and a number',
      })
      .resolve(),
    confirmPassword: Yup.string().oneOf(
      [Yup.ref('newPassword'), null],
      'Passwords do not match'
    ),
  });

  const { handleChange, values } = useFormik({
    initialValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: changePassSchema,
  });

  const eyeOff = <EyeOff />;
  const eye = <Eye />;

  const toggleOldPasswordVisibility = () => {
    setOldPasswordShown(oldPasswordShown ? false : true);
  };
  const toggleNewPasswordVisibility = () => {
    setNewPasswordShown(newPasswordShown ? false : true);
  };
  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordShown(confirmPasswordShown ? false : true);
  };

  const changePassword = async (e) => {
    e.preventDefault();

    setError(null);
    setSuccess(null);
    setModalShow(null);

    setLoading(true);

    try {
      if (values.oldPassword === values.newPassword) {
        setError('New password cannot be the same as old password');
        setLoading(false);
        return;
      } else if (values.newPassword !== values.confirmPassword) {
        setError('New passwords do not match');
        setLoading(false);
        return;
      }

      const user = await Auth.currentAuthenticatedUser();
      await Auth.changePassword(user, values.oldPassword, values.newPassword);
      // console.log({ values });

      setLoading(false);

      setSuccess(true);
      setModalShow(true);
    } catch (err) {
      setLoading(false);

      setError(
        get(
          changePassErrors.find(({ code }) => code === err.code),
          'message',
          'An error occurred changing password'
        )
      );
    }
  };

  return (
    <div id='ChangePass'>
      <PassChangeSuccessModal
        show={modalShow}
        onChange={() => setModalShow(true)}
        onHide={() => setModalShow(false)}
      />
      <div className='mt-5'>
        <h3 className='sofia-pro text-18 mb-4'>Change Password</h3>
        {error && (
          <div className='alert alert-danger w-840' role='alert'>
            <div>
              <h4 className='text-center text-alert'>
                <AlertCircle />
                &nbsp;&nbsp;&nbsp;{error}
              </h4>
            </div>
          </div>
        )}
        <div className='card shadow-sm mb-2 w-840 change-container'>
          <div className='card-body'>
            <Form id='passForm'>
              <Row>
                <Col>
                  <Form.Group controlId='oldPassword'>
                    <Form.Label>Current Password</Form.Label>
                    <div>
                      <Form.Control
                        className='form-control-lg'
                        type={oldPasswordShown ? 'text' : 'password'}
                        onChange={handleChange}
                        value={values.oldPassword}
                        disabled={loading}
                      />
                      <i
                        className='fe-eye-old'
                        onClick={toggleOldPasswordVisibility}
                      >
                        {oldPasswordShown ? eye : eyeOff}
                      </i>
                    </div>
                  </Form.Group>
                </Col>
                <Col>
                  <Row>
                    <Col>
                      <Form.Group controlId='newPassword'>
                        <Form.Label>New Password</Form.Label>
                        <div>
                          <Form.Control
                            className='form-control-lg'
                            type={newPasswordShown ? 'text' : 'password'}
                            onChange={handleChange}
                            value={values.newPassword}
                            disabled={loading}
                          />
                          <i
                            className='fe-eye-new'
                            onClick={toggleNewPasswordVisibility}
                          >
                            {newPasswordShown ? eye : eyeOff}
                          </i>
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={6}>
                      <Form.Group controlId='confirmPassword'>
                        <Form.Label>Confirm New Password</Form.Label>
                        <div>
                          <Form.Control
                            className='form-control-lg'
                            type={confirmPasswordShown ? 'text' : 'password'}
                            onChange={handleChange}
                            value={values.confirmPassword}
                            disabled={loading}
                          />
                          <i
                            className='fe-eye-confirm'
                            onClick={toggleConfirmPasswordVisibility}
                          >
                            {confirmPasswordShown ? eye : eyeOff}
                          </i>
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Row>
                <Col className='btn btn-container'>
                  <Button
                    className='btn-change'
                    type='submit'
                    onClick={changePassword}
                    disabled={loading}
                  >
                    {!loading ? (
                      <>Change Password</>
                    ) : (
                      <Spinner
                        animation='border'
                        size='sm'
                        className='spinner'
                      />
                    )}
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
