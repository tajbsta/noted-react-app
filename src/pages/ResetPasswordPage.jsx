/* eslint-disable react/no-unescaped-entities */
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Form, Spinner } from 'react-bootstrap';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { PASSWORD_REGEX_FORMAT } from '../constants/errors/regexFormats';
import { Eye, EyeOff } from 'react-feather';

export default function ForgotPasswordPage() {
  let history = useHistory();
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newPasswordShown, setNewPasswordShown] = useState(false);
  const [confirmPasswordShown, setConfirmPasswordShown] = useState(false);

  const toggleNewPasswordVisiblity = () => {
    setNewPasswordShown(newPasswordShown ? false : true);
  };
  const toggleConfirmPasswordVisiblity = () => {
    setConfirmPasswordShown(confirmPasswordShown ? false : true);
  };
  const eyeOff = <EyeOff />;
  const eye = <Eye />;

  const sendResetLink = () => {
    history.push('/');
  };

  const resetPasswordSchema = Yup.object().shape({
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
      newPassword: '',
      confirmNewPassword: '',
    },
    validationSchema: resetPasswordSchema,
  });

  console.log(errors);

  const renderLocalNewPasswordValidationError = () => (
    <small className='form-text p-0 m-0 noted-red error-msg'>
      {errors.newPassword}
    </small>
  );

  const renderLocalConfirmNewPasswordValidationError = () => (
    <small className='form-text p-0 m-0 noted-red'>
      {errors.confirmNewPassword}
    </small>
  );

  const { newPassword, confirmNewPassword } = values;
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
              {error && <div>{error.message}</div>}
              <Form.Group>
                <div>
                  <Form.Control
                    isValid={
                      !errors.confirmNewPassword && newPassword.length > 0
                    }
                    isInvalid={errors.newPassword}
                    className='form-control form-control-lg'
                    type={newPasswordShown ? 'text' : 'password'}
                    name='newPassword'
                    placeholder='Enter your new password'
                    onChange={handleChange}
                  />
                  <i
                    className='fe-eye-new'
                    onClick={toggleNewPasswordVisiblity}
                  >
                    {newPasswordShown ? eye : eyeOff}
                  </i>
                </div>
                {errors.newPassword && renderLocalNewPasswordValidationError()}
              </Form.Group>
              <Form.Group>
                <div>
                  <Form.Control
                    isValid={
                      !errors.confirmNewPassword &&
                      confirmNewPassword.length > 0
                    }
                    isInvalid={errors.confirmNewPassword}
                    className='form-control form-control-lg'
                    type={confirmPasswordShown ? 'text' : 'password'}
                    name='confirmNewPassword'
                    placeholder='Confirm your new password'
                    onChange={handleChange}
                  />
                  <i
                    className={
                      errors.confirmNewPassword || errors.newPassword
                        ? 'fe-eye-error'
                        : 'fe-eye-confirm'
                    }
                    onClick={toggleConfirmPasswordVisiblity}
                  >
                    {confirmPasswordShown ? eye : eyeOff}
                  </i>
                </div>
                {errors.confirmNewPassword &&
                  renderLocalConfirmNewPasswordValidationError()}
              </Form.Group>
              <button
                className='btn btn-lg btn-block btn-green mb-3 btn-submit'
                type='submit'
                disabled={
                  isSubmitting ||
                  confirmNewPassword.length === 0 ||
                  newPassword.length === 0 ||
                  (newPassword.length > 0 && errors.newPassword) ||
                  (confirmNewPassword.length > 0 && errors.confirmNewPassword)
                }
                onClick={sendResetLink}
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
