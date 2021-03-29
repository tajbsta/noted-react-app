/* eslint-disable react/no-unescaped-entities */
import React, { useState } from 'react';
import { ArrowRight } from 'react-feather';
import { Link, useHistory } from 'react-router-dom';
import { Form, Spinner } from 'react-bootstrap';
import { Auth } from 'aws-amplify';
import { signInErrors } from '../library/errors.library';
import { get } from 'lodash';
import { Eye, EyeOff } from 'react-feather';

export default function LoginPage() {
  let history = useHistory();
  const [error, setError] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);
  const togglePasswordVisibility = () => {
    setPasswordShown(passwordShown ? false : true);
  };
  const eyeOff = <EyeOff />;
  const eye = <Eye />;

  const login = async () => {
    try {
      setError(null);
      setIsSubmitting(true);
      await Auth.signIn(email, password);
      history.push('/dashboard');
    } catch (error) {
      console.log('Error signing in', error.code);
      setError(
        get(
          signInErrors.find(({ code }) => code === error.code),
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

  return (
    <div id='LoginPage'>
      <div>
        <div className='row justify-content-center'>
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
                Continue with Google
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
                  className='form-control form-control-lg'
                  type='email'
                  name='email'
                  placeholder='Your email...'
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>
              <Form.Group>
                <div>
                  <Form.Control
                    className='form-control form-control-lg'
                    type={passwordShown ? 'text' : 'password'}
                    name='password'
                    placeholder='Your password...'
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <i
                    className={!error ? 'fe-eye' : 'fe-eye-error'}
                    onClick={togglePasswordVisibility}
                  >
                    {passwordShown ? eye : eyeOff}
                  </i>
                </div>
              </Form.Group>
              <h3 className='text-forgot'>
                <Link
                  to='forgot-password'
                  className='text-decoration-underline'
                >
                  Forgot Password?
                </Link>
              </h3>
              <button
                className='btn btn-lg btn-block btn-green mb-3 btn-submit'
                type='submit'
                disabled={isSubmitting}
                onClick={login}
              >
                {!isSubmitting ? (
                  <>
                    <i className='fe fe-arrow-right'>
                      <ArrowRight />
                    </i>
                    Sign In
                  </>
                ) : (
                  <Spinner animation='border' size='sm' className='spinner' />
                )}
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
                  Privacy Policy
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
              Not a member?{' '}
              <Link to='join' className='text-decoration-underline text-login'>
                {' '}
                Sign up now
              </Link>
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}
