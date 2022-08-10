/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState } from 'react';
import { Mail, Eye, EyeOff } from 'react-feather';
import { Link, useHistory } from 'react-router-dom';
import { Form, Spinner } from 'react-bootstrap';
import { Auth, Hub } from 'aws-amplify';
import { signUpErrors } from '../library/errors.library';
import { get } from 'lodash';
import { useFormik } from 'formik';
import { registerSchema } from '../models/formSchema';
import { scrollToTop } from '../utils/window';
import { resetAuthorizeNewEmail } from '../utils/data';
import GoogleLogoItem from '../assets/img/google_signup.png';
import CheckZipcodeModal from '../modals/CheckZipcodeModal';
import { useDispatch } from 'react-redux';
import { setIsInfoAdded } from '../actions/auth.action';
import { lead } from '../analytics/fbpixels';
import RegisterBg from '../assets/img/signup_bg.png';
import Footer from '../components/Footer/Footer';

export default function RegisterPage() {
  const history = useHistory();
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);
  const [showCheckZipcodeModal, setShowCheckZipcodeModal] = useState(false);
  const dispatch = useDispatch();

  const togglePasswordVisibility = () => {
    setPasswordShown(passwordShown ? false : true);
  };

  useEffect(() => {
    resetAuthorizeNewEmail();
    scrollToTop();

    if (process.env.NODE_ENV === 'production') {
      lead();
    }
  }, []);

  const eyeOff = <EyeOff />;
  const eye = <Eye />;

  const { errors, handleChange, values } = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: registerSchema,
  });

  const { email, password } = values;

  const register = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      setIsSubmitting(true);

      await Auth.signUp({
        username: email,
        password,
        attributes: {
          email,
          'custom:created_at': new Date().getTime().toString(),
        },
      });

      await Auth.signIn(email, password);

      dispatch(setIsInfoAdded(false));
      history.push('/dashboard');
      return;
    } catch (error) {
      // console.log(Object.values(error));
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

  const renderPasswordValidationError = () => (
    <small className='form-text p-0 noted-red error-pass-msg'>
      {errors.password}
    </small>
  );

  const renderEmailValidationError = () => (
    <small className='form-text p-0 noted-red error-email'>
      {errors.email}
    </small>
  );

  return (
    <div id='RegisterPage'>
      <div className='row register-container'>
        <div className='col-lg-6'>
          <div className='row justify-content-center index-container'>
            <div className='text-need col-md-10 col-xl-8'>
              <p className='text-center'>Need to return or donate</p>
              <p className='text-center'>purchases made in the past?</p>
              <p className='text-center'>Let's go!</p>
              <div className='form-group'>
                <button
                  onClick={() => Auth.federatedSignIn({ provider: 'Google' })}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    height: '48px',
                    margin: '40px 0',
                  }}
                >
                  <img
                    src={GoogleLogoItem}
                    style={{ marginRight: '15px', height: '48px' }}
                    alt='google_sign_in'
                  />
                </button>
              </div>

              <h3 className='text-already'>
                Already a member?{' '}
                <Link
                  to='login'
                  className='text-decoration-underline text-login'
                >
                  {' '}
                  Log in
                </Link>
              </h3>
              {/* <div className='line-container'>
                <p className='line-break'>
                  <span>or</span>
                </p>
              </div> */}
              <Form>
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
                    onChange={handleChange}
                  />
                </div>
                {email.length > 0 &&
                  errors.email &&
                  renderEmailValidationError()}

                <div className='form-group'>
                  <div className='input-group input-group-merge'>
                    <input
                      className='form-control form-control-appended form-pass'
                      type={passwordShown ? 'text' : 'password'}
                      name='password'
                      placeholder='Your password...'
                      onChange={handleChange}
                    />
                    <div className='input-group-append'>
                      <span className='input-group-text'>
                        <i
                          className='fe fe-eye'
                          onClick={togglePasswordVisibility}
                        >
                          {passwordShown ? eye : eyeOff}
                        </i>
                      </span>
                    </div>
                  </div>
                </div>
                {password.length > 0 &&
                  errors.password &&
                  renderPasswordValidationError()}
                <button
                  className='btn btn-lg btn-block btn-green mb-3 btn-submit'
                  type='submit'
                  disabled={
                    isSubmitting ||
                    email.length === 0 ||
                    password.length === 0 ||
                    (errors.password && password.length > 0) ||
                    (errors.email && email.length > 0)
                  }
                  onClick={register}
                >
                  {!isSubmitting ? (
                    <>
                      <i className='fe fe-mail'>
                        <Mail />
                      </i>
                      Join with email
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
              <div className='text-left mb-4'>
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
        <div className='col-lg-6 d-none d-lg-flex'>
          <img src={RegisterBg} className='register-bg' />
        </div>
      </div>
      <CheckZipcodeModal
        show={showCheckZipcodeModal}
        onHide={() => setShowCheckZipcodeModal(false)}
      />
      <Footer />
    </div>
  );
}
