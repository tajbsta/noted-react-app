/* eslint-disable react/no-unescaped-entities */
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Form } from 'react-bootstrap';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { PASSWORD_REGEX_FORMAT } from '../constants/errors/regexFormats';

export default function ForgotPasswordPage() {
  let history = useHistory();
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useDispatch();

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
    <small className='form-text p-0 m-0 noted-red'>{errors.newPassword}</small>
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
                <Form.Control
                  isValid={!errors.confirmNewPassword && newPassword.length > 0}
                  isInvalid={errors.newPassword}
                  className='form-control form-control-lg'
                  type='password'
                  name='newPassword'
                  placeholder='Enter your new password'
                  onChange={handleChange}
                />
                {errors.newPassword && renderLocalNewPasswordValidationError()}
              </Form.Group>
              <Form.Group>
                <Form.Control
                  isValid={
                    !errors.confirmNewPassword && confirmNewPassword.length > 0
                  }
                  isInvalid={errors.confirmNewPassword}
                  className='form-control form-control-lg'
                  type='password'
                  name='confirmNewPassword'
                  placeholder='Confirm your new password'
                  onChange={handleChange}
                />
                {errors.confirmNewPassword &&
                  renderLocalConfirmNewPasswordValidationError()}
              </Form.Group>
              <button
                className='btn btn-lg btn-block btn-green mb-3 btn-submit'
                type='submit'
                disabled={isSubmitting}
                onClick={sendResetLink}
              >
                Save New Password
              </button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
