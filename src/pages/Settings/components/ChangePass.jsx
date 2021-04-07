import React, { useState } from 'react';
import { Form, Button, Row, Col, Spinner } from 'react-bootstrap';
import { Eye, EyeOff } from 'react-feather';
import { Auth } from 'aws-amplify';
import { changePassErrors } from '../../../library/errors.library';
import { PASSWORD_REGEX_FORMAT } from '../../../constants/errors/regexFormats';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { get } from 'lodash';
import { AlertCircle } from 'react-feather';
import PassChangeSuccessModal from '../../../modals/PassChangeSuccessModal';

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
            <Form>
              <Row>
                <Col>
                  <div className='form-group'>
                    <div className='col col-pass'>
                      <label>Current Password</label>
                    </div>
                    <div className='input-group input-group-merge'>
                      <input
                        className='form-control form-control-appended form-pass'
                        type={oldPasswordShown ? 'text' : 'password'}
                        name='oldPassword'
                        onChange={handleChange}
                        value={values.oldPassword}
                        disabled={loading}
                      />
                      <div className='input-group-append'>
                        <span className='input-group-text'>
                          <i
                            className='fe fe-eye'
                            onClick={toggleOldPasswordVisibility}
                          >
                            {oldPasswordShown ? eye : eyeOff}
                          </i>
                        </span>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col>
                  <Row>
                    <Col>
                      <div className='form-group'>
                        <div className='col col-pass'>
                          <label>New Password</label>
                        </div>
                        <div className='input-group input-group-merge'>
                          <input
                            className='form-control form-control-appended form-pass'
                            type={newPasswordShown ? 'text' : 'password'}
                            name='newPassword'
                            onChange={handleChange}
                            value={values.newPassword}
                            disabled={loading}
                          />
                          <div className='input-group-append'>
                            <span className='input-group-text'>
                              <i
                                className='fe fe-eye'
                                onClick={toggleNewPasswordVisibility}
                              >
                                {newPasswordShown ? eye : eyeOff}
                              </i>
                            </span>
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <div className='form-group'>
                        <div className='col col-pass'>
                          <label>Confirm Password</label>
                        </div>
                        <div className='input-group input-group-merge'>
                          <input
                            className='form-control form-control-appended form-pass'
                            type={confirmPasswordShown ? 'text' : 'password'}
                            name='confirmPassword'
                            onChange={handleChange}
                            value={values.confirmPassword}
                            disabled={loading}
                          />
                          <div className='input-group-append'>
                            <span className='input-group-text'>
                              <i
                                className='fe fe-eye'
                                onClick={toggleConfirmPasswordVisibility}
                              >
                                {confirmPasswordShown ? eye : eyeOff}
                              </i>
                            </span>
                          </div>
                        </div>
                      </div>
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
