/* eslint-disable react/no-unescaped-entities */
import React, { useState } from 'react';
import { Mail } from 'react-feather';
import { Link, useHistory } from 'react-router-dom';
import { Form, Spinner } from 'react-bootstrap';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Auth } from 'aws-amplify';
import { forgotPassErrors } from '../library/errors.library';
import { get } from 'lodash';

export default function ForgotPasswordPage() {
  const history = useHistory();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const forgotPasswordSchema = Yup.object({
    email: Yup.string()
      .email('Enter a valid email address')
      .required('Email is required'),
  });

  const { errors, handleChange, values } = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: forgotPasswordSchema,
  });

  const { email } = values;

  const forgotPass = async (e) => {
    e.preventDefault();
    console.log(values.email);
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      await Auth.forgotPassword(values.email);
      setIsSubmitting(false);
      setSuccess(true);

      // redirect user to reset pass
      setTimeout(() => {
        history.push({
          pathname: '/reset-password',
          state: {
            username: values.email,
          },
        });
      }, 4000);
    } catch (err) {
      setIsSubmitting(false);

      setError(
        get(
          forgotPassErrors.find(({ err }) => err === err),
          'err',
          'Error while trying to reset password'
        )
      );
    }
  };

  return (
    <div id='ForgotPasswordPage'>
      <div>
        <div className='row justify-content-center'>
          <div className='text-header-title col-md-5 col-xl-4'>
            <p className='text-center'>Forgot password?</p>
            <p className='text-center'>Let's go!</p>
            <div className='text-enter'>
              <p>
                Enter the email address you used when you joined and we’ll send
                you instructions to reset your password.
              </p>
            </div>
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
                    Password reset request sent! Please check your inbox.
                  </h4>
                </div>
              </div>
            )}
            <Form>
              <Form.Group>
                <Form.Control
                  isValid={email.length > 0 && errors.email}
                  className={`form-control form-control-lg ${
                    errors.email ? 'change-mb' : ''
                  }`}
                  type='email'
                  name='email'
                  placeholder='Your email...'
                  onChange={handleChange}
                  value={email}
                />
                {errors && (
                  <small className='form-text p-0 m-0 noted-red'>
                    {errors.email}
                  </small>
                )}
              </Form.Group>
              <button
                className='btn btn-lg btn-block btn-green mb-3 btn-submit'
                type='submit'
                disabled={
                  isSubmitting ||
                  email.length === 0 ||
                  (email.length > 0 && errors.email)
                }
                onClick={forgotPass}
              >
                {!isSubmitting ? (
                  <>
                    <i className='fe fe-mail'>
                      <Mail />
                    </i>
                    Send Reset Instructions
                  </>
                ) : (
                  <Spinner animation='border' size='sm' className='spinner' />
                )}
              </button>
            </Form>
            <h3 className='text-go-back'>
              <Link to='login' className='text-decoration-underline text-link'>
                {' '}
                Go back
              </Link>
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}
