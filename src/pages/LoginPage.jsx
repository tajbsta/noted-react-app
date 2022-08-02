/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'react-feather';
import { Link, useHistory } from 'react-router-dom';
import { Form, Spinner } from 'react-bootstrap';
import { Auth } from 'aws-amplify';
import { signInErrors } from '../library/errors.library';
import { get } from 'lodash';
import { Eye, EyeOff } from 'react-feather';
import { scrollToTop } from '../utils/window';
import { resetAuthorizeNewEmail } from '../utils/data';
import GoogleLogoItem from '../assets/img/google_signin.png';
import { initiateCheckout } from '../analytics/fbpixels';
import LoginBg from '../assets/img/login_bg.png';
import Footer from '../components/Footer/Footer';

export default function LoginPage() {
  const history = useHistory();
  const [error, setError] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);
  const [isEmailLogin, setIsEmailLogin] = useState(false);
  const togglePasswordVisibility = () => {
    setPasswordShown(passwordShown ? false : true);
  };

  useEffect(() => {
    resetAuthorizeNewEmail();
    scrollToTop();
  }, []);

  const eyeOff = <EyeOff />;
  const eye = <Eye />;

  const login = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      setIsSubmitting(true);
      await Auth.signIn(email, password);
      history.push('/dashboard');
    } catch (error) {
      // console.log('Error signing in', error.code);
      setError(
        get(
          signInErrors.find(({ code }) => code === error.code),
          'message',
          'An error occurred signing in'
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
      <div className='row login-container'>
        <div className='col-md-6'>
          <div className='row justify-content-center'>
            <div className='text-need col-md-10 col-xl-8'>
              <p className='text-center'>Need to return or donate</p>
              <p className='text-center'>purchases made in the past?</p>
              <p className='text-center'>Let's go!</p>
              {!isEmailLogin && (
                <>
                  <div className='form-group'>
                    <button
                      onClick={() =>
                        Auth.federatedSignIn({ provider: 'Google' })
                      }
                      style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        height: '48px',
                        margin: '40px 0 20px',
                      }}
                    >
                      <img
                        src={GoogleLogoItem}
                        style={{ height: '48px' }}
                        alt='google_sign_in'
                      />
                    </button>
                  </div>

                  <div className='d-flex justify-content-center'>
                    <button
                      className='text-login'
                      onClick={() => setIsEmailLogin(true)}
                      style={{
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        fontSize: 16,
                        marginBottom: 60,
                        color: '#570097',
                      }}
                    >
                      Login using Email instead
                    </button>
                  </div>
                </>
              )}

              {isEmailLogin && (
                <>
                  <Form style={{ marginTop: 40 }}>
                    {error && (
                      <div className='alert alert-danger' role='alert'>
                        <h4 className='text-center text-alert'>{error}</h4>
                      </div>
                    )}

                    <div className='form-group'>
                      <input
                        className='form-control form-control-appended'
                        type='email'
                        name='email'
                        placeholder='Your email...'
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>

                    <div className='form-group'>
                      <div className='input-group input-group-merge'>
                        <input
                          className='form-control form-control-appended form-pass'
                          type={passwordShown ? 'text' : 'password'}
                          name='password'
                          placeholder='Your password...'
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <div className='input-group-append'>
                          <span className='input-group-text'>
                            <i
                              className={!error ? 'fe-eye' : 'fe-eye-error'}
                              onClick={togglePasswordVisibility}
                            >
                              {passwordShown ? eye : eyeOff}
                            </i>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* <h3 className='text-forgot'>
      <Link
        to='forgot-password'
        className='text-decoration-underline'
      >
        Forgot Password?
      </Link>
    </h3> */}
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
                        <Spinner
                          animation='border'
                          size='sm'
                          className='spinner btn-spinner'
                        />
                      )}
                    </button>
                  </Form>

                  <div className='d-flex justify-content-center'>
                    <button
                      className='text-login'
                      onClick={() => setIsEmailLogin(false)}
                      style={{
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        fontSize: 16,
                        marginTop: 20,
                        marginBottom: 20,
                        color: '#570097',
                      }}
                    >
                      Login using GMAIL instead
                    </button>
                  </div>
                </>
              )}

              <h3 className='text-already'>
                Not a member?{' '}
                <Link
                  to='join'
                  className='text-decoration-underline text-login'
                  onClick={() =>
                    process.env.NODE_ENV === 'production' &&
                    initiateCheckout &&
                    window.gtag('event', 'sign_up')
                  }
                >
                  {' '}
                  Sign up now
                </Link>
              </h3>

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
                  <a
                    href='https://policies.google.com/terms'
                    style={policyStyle}
                  >
                    Terms
                  </a>
                  .
                </small>
              </div>
            </div>
          </div>
        </div>
        <div className='col-md-6 d-flex flex-column justify-content-center align-items-center'>
          <img src={LoginBg} className='login-bg' />
        </div>
      </div>
      <Footer />
    </div>
  );
}
