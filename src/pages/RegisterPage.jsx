/* eslint-disable react/no-unescaped-entities */
import React, { useState } from 'react';
import { Mail } from 'react-feather';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Form, FormGroup, FormControl } from 'react-bootstrap';
import Amplify, { Auth } from 'aws-amplify';
import { setUser } from '../actions/auth.action';
import { signUpErrors } from '../library/errors.library';
import { get } from 'lodash';
import { PASSWORD_REGEX_FORMAT } from '../constants/errors/regexFormats';
import * as Yup from 'yup';
import { useFormik } from 'formik';

export default function RegisterPage() {
  const history = useHistory();
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const registerSchema = Yup.object({
    email: Yup.string()
      .email('Enter a valid email address')
      .required('Email is required'),
    password: Yup.string()
      .required(' Your password must be 8-20 characters long')
      .matches(PASSWORD_REGEX_FORMAT)
      .resolve(),
  });

  const { errors, handleChange, values } = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: registerSchema,
  });

  const { email, password } = values;

  const register = async () => {
    try {
      setError(null);
      setIsSubmitting(true);

      await Auth.signUp({
        username: email,
        password,
        attributes: {
          email,
        },
      });

      await Auth.signIn(email, password);

      history.push('/code');
    } catch (error) {
      console.log(Object.values(error));
      setError(
        get(
          signUpErrors.find(({ code }) => code === error.code),
          'message',
          'An error occurred signing up'
        )
      );
      setIsSubmitting(false);
    }
  };

  const policyStyle = {
    textDecoration: 'underline',
  };

  const renderLocalPasswordValidationError = () => (
    <small className='form-text p-0 m-0 noted-red'>
      Your password must be 8-20 characters long
    </small>
  );

  const renderLocalEmailValidationError = () => (
    <small className='form-text p-0 m-0 noted-red'>{errors.email}</small>
  );

  return (
    <div id='RegisterPage'>
      <div>
        <div className='row justify-content-center index-container'>
          <div className='text-need col-md-5 col-xl-4'>
            <p className='text-center'>Need to return or donate</p>
            <p className='text-center'>purchases made in the past?</p>
            <p className='text-center'>Let's go!</p>
            <div
              className='form-group'
              style={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <button
                onClick={() => Auth.federatedSignIn({ provider: 'Google' })}
                className='btn btn-md btn-block btn-google'
                style={{
                  background: 'white',
                  boxShadow: '0px 0px 4px 0.5px rgba(0,0,0,0.1)',
                  color: '#690098',
                  fontWeight: 'normal',
                  fontSize: '16px',
                  paddingTop: '10px',
                }}
              >
                <div className='avatar avatar-xs mr-2'>
                  <img
                    className='avatar-img'
                    src='https://i.pinimg.com/originals/39/21/6d/39216d73519bca962bd4a01f3e8f4a4b.png'
                  />
                </div>
                Join with Google
              </button>
            </div>
            <div>
              <p className='line-break'>
                <span>or</span>
              </p>
            </div>
            <Form>
              {error && (
                <div className='alert alert-danger' role='alert'>
                  <h4 className='text-center text-alert'>{error}</h4>
                </div>
              )}
              <Form.Group>
                <Form.Control
                  isValid={!errors.email && email.length > 0}
                  isInvalid={errors.email && email.length > 0}
                  className='form-control form-control-lg'
                  type='email'
                  name='email'
                  placeholder='Your email...'
                  onChange={handleChange}
                />
                {email.length > 0 &&
                  errors.email &&
                  renderLocalEmailValidationError()}
              </Form.Group>
              <Form.Group>
                <Form.Control
                  isValid={!errors.password && password.length > 0}
                  isInvalid={errors.password && password.length > 0}
                  className='form-control form-control-lg mb-0'
                  type='password'
                  name='password'
                  placeholder='Your password...'
                  onChange={handleChange}
                />
                {password.length > 0 &&
                  errors.password &&
                  renderLocalPasswordValidationError()}
              </Form.Group>
              <button
                className='btn btn-lg btn-block btn-green mb-3 btn-submit'
                type='submit'
                disabled={
                  isSubmitting || email.length === 0 || password.length === 0
                }
                onClick={register}
              >
                <i className='fe fe-mail'>
                  <Mail />
                </i>
                Join with email
              </button>
            </Form>
            <div className='text-left'>
              <small className='text-muted text-left'>
                By joining noted you agree to our{' '}
                <a
                  href='https://www.notedreturns.com/terms-and-conditions'
                  style={policyStyle}
                >
                  Terms of Service
                </a>{' '}
                and{' '}
                <a
                  href='https://www.notedreturns.com/privacy-policy'
                  style={policyStyle}
                >
                  Privacy
                </a>
                . Protected by Google's{' '}
                <a
                  href='https://policies.google.com/privacy'
                  style={policyStyle}
                >
                  Privacy
                </a>{' '}
                and{' '}
                <a href='https://policies.google.com/terms' style={policyStyle}>
                  Terms
                </a>
                .
              </small>
            </div>
            <h3 className='text-already'>
              Already a member?{' '}
              <Link to='login' className='text-decoration-underline text-login'>
                {' '}
                Log in
              </Link>
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}
