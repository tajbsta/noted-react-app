/* eslint-disable react/no-unescaped-entities */
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Form, Spinner } from 'react-bootstrap';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { PASSWORD_REGEX_FORMAT } from '../constants/errors/regexFormats';
import { Eye, EyeOff } from 'react-feather';
import { Auth } from 'aws-amplify';
import { get } from 'lodash';
import { resetPassErrors } from '../library/errors.library';

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
  const eyeOff = <EyeOff />;
  const eye = <Eye />;

  const resetPasswordSchema = Yup.object().shape({
    code: Yup.number()
      .min(6, 'Not correct length')
      .required('Code is required'),
    newPassword: Yup.string()
      .required(
        'Your password must be 8-20 characters long and must contain a letter, symbol and a number'
      )
      .matches(PASSWORD_REGEX_FORMAT, {
        message:
          'Your password must be 8-20 characters long and must contain a letter, symbol and a number',
      }),
    confirmNewPassword: Yup.string().when('newPassword', {
      is: (val) => (val && val.length > 0 ? true : false),
      then: Yup.string().oneOf(
        [Yup.ref('newPassword')],
        'Passwords do not match'
      ),
    }),
  });

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
      console.log({
        username: props.location.state.username,
      });

      await Auth.forgotPasswordSubmit(
        props.location.state.username,
        values.code,
        values.newPassword
      );

      setIsSubmitting(false);
      setSuccess(true);

      setTimeout(() => {
        history.push('/login');
      }, 4000);
    } catch (err) {
      console.log(err);
      setIsSubmitting(false);

      setError(
        get(
          resetPassErrors.find(({ code }) => code === err.code),
          'message',
          'An error occurred resetting password'
        )
      );
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
              {error && (
                <div className='alert alert-danger w-840' role='alert'>
                  <div>
                    <h4 className='text-center text-alert'>{error}</h4>
                  </div>
                </div>
              )}
              {success && (
                <div className='alert alert-success w-840' role='alert'>
                  <div>
                    <h4 className='text-center text-alert'>
                      Success! Please login with your new password.
                    </h4>
                  </div>
                </div>
              )}

              <div className='form-group'>
                <input
                  className='form-control form-control-appended'
                  isValid={!errors.code && code.length > 0}
                  isInvalid={errors.code}
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
                    isValid={
                      !errors.confirmNewPassword && newPassword.length > 0
                    }
                    isInvalid={errors.newPassword}
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
                    isInvalid={errors.confirmNewPassword}
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
                  <Spinner animation='border' size='sm' className='spinner' />
                )}
              </button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
