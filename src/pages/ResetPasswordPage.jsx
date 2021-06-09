/* eslint-disable react/no-unescaped-entities */
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Form, Spinner } from 'react-bootstrap';
import { useFormik } from 'formik';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'react-feather';
import { Auth } from 'aws-amplify';
import { get } from 'lodash';
import { resetPassErrors } from '../library/errors.library';
import { resetPasswordSchema } from '../models/formSchema';
import { scrollToTop } from '../utils/window';
import { showError, showSuccess } from '../library/notifications.library';

export default function ResetPasswordPage(props) {
  const history = useHistory();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [newPasswordShown, setNewPasswordShown] = useState(false);
  const [confirmPasswordShown, setConfirmPasswordShown] = useState(false);
  const toggleNewPasswordVisibility = () => {
    setNewPasswordShown(newPasswordShown ? false : true);
  };
  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordShown(confirmPasswordShown ? false : true);
  };

  useEffect(() => {
    scrollToTop();
  }, []);

  const eyeOff = <EyeOff />;
  const eye = <Eye />;

  const { errors, handleChange, values } = useFormik({
    initialValues: {
      code: '',
      newPassword: '',
      confirmNewPassword: '',
    },
    validationSchema: resetPasswordSchema,
  });

  const renderInlineError = (error) => (
    <small className='form-text p-0 m-0 noted-red'>{error}</small>
  );

  const { code, newPassword, confirmNewPassword } = values;
  const resetPassword = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      // console.log({
      //   username: props.location.state.username,
      // });

      await Auth.forgotPasswordSubmit(
        props.location.state.username,
        values.code,
        values.newPassword
      );

      setIsSubmitting(false);

      showSuccess({
        message: (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <CheckCircle />
            <h4 className='ml-3 mb-0' style={{ lineHeight: '16px' }}>
              Success! Please login with your new password.
            </h4>
          </div>
        ),
      });

      setTimeout(() => {
        history.push('/login');
      }, 3500);
    } catch (err) {
      setIsSubmitting(false);

      showError({
        message: get(
          resetPassErrors.find(({ code }) => code === err.code),
          'message',
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <AlertCircle />
            <h4 className='ml-3 mb-0' style={{ lineHeight: '16px' }}>
              An error occurred resetting password
            </h4>
          </div>
        ),
      });
    }
  };

  return (
    <div id='ResetPasswordPage'>
      <div>
        <div className='row justify-content-center'>
          <div className='text-header-title col-md-5 col-xl-4'>
            <p className='text-center'>Reset your password</p>
            <div className='text-choose'>
              <p>Please choose your new password</p>
            </div>
            <Form>
              <div className='form-group'>
                <input
                  className='form-control form-control-appended'
                  type='code'
                  pattern='[0-9]*'
                  name='code'
                  placeholder='Enter code from email'
                  onChange={(e) => {
                    const re = /^[0-9\b]+$/;
                    if (e.target.value === '' || re.test(e.target.value)) {
                      handleChange(e);
                    }
                  }}
                  maxLength={6}
                />
                {renderInlineError(errors.code)}
              </div>

              <div className='form-group'>
                <div className='input-group input-group-merge'>
                  <input
                    className='form-control form-control-appended form-pass'
                    placeholder='Enter your new password'
                    type={newPasswordShown ? 'text' : 'password'}
                    name='newPassword'
                    onChange={handleChange}
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
                {newPassword.length > 0 &&
                  renderInlineError(errors.newPassword)}
              </div>

              <div className='form-group'>
                <div className='input-group input-group-merge'>
                  <input
                    className='form-control form-control-appended form-pass'
                    isValid={
                      !errors.confirmNewPassword &&
                      confirmNewPassword.length > 0
                    }
                    type={confirmPasswordShown ? 'text' : 'password'}
                    name='confirmNewPassword'
                    placeholder='Confirm your new password'
                    onChange={handleChange}
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
                {renderInlineError(errors.confirmNewPassword)}
              </div>

              <button
                className='btn btn-lg btn-block btn-green mb-3 btn-submit'
                type='submit'
                disabled={
                  isSubmitting ||
                  code.length < 1 ||
                  confirmNewPassword.length === 0 ||
                  newPassword.length === 0 ||
                  (newPassword.length > 0 && errors.newPassword) ||
                  (confirmNewPassword.length > 0 && errors.confirmNewPassword)
                }
                onClick={resetPassword}
              >
                {!isSubmitting ? (
                  'Save New Password'
                ) : (
                  <Spinner
                    animation='border'
                    size='sm'
                    className='spinner btn-spinner'
                  />
                )}
              </button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
