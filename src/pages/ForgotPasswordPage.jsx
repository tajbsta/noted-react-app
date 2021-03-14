/* eslint-disable react/no-unescaped-entities */
import React, { useState } from 'react';
import { Mail } from 'react-feather';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Form, Spinner } from 'react-bootstrap';
import * as Yup from 'yup';
import { useFormik } from 'formik';

export default function ForgotPasswordPage() {
  let history = useHistory();
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useDispatch();

  const sendResetLink = () => {
    history.push('/');
  };

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
            <Form>
              {error && <div>{error.message}</div>}
              <Form.Group>
                <Form.Control
                  isInvalid={email.length > 0 && errors.email}
                  className='form-control form-control-lg'
                  type='email'
                  name='email'
                  placeholder='Your email...'
                  onChange={handleChange}
                  value={email}
                />
              </Form.Group>
              <button
                className='btn btn-lg btn-block btn-green mb-3 btn-submit'
                type='submit'
                disabled={
                  isSubmitting ||
                  email.length === 0 ||
                  (email.length > 0 && errors.email)
                }
                onClick={sendResetLink}
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
