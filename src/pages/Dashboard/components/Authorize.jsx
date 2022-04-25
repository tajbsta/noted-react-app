import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';

import { submitApplication } from '../../../analytics/fbpixels';

import GoogleAuthorize from '../../../assets/img/authorize.png';
import AuthorizeImg from '../../../assets/img/AuthorizePlain.svg';

const Authorize = ({ triggerScanNow }) => {
  return (
    <div id='AuthorizeUpdate'>
      <Container className='main-body' fluid='lg'>
        <Row md='2' className='text-left align-items-center'>
          <Col xs='6' className='info'>
            <h1 className='bold text-title'>Everything is automatic!!</h1>
            <h4 className='text-noted'>
              noted will scan your email inbox and find all of your online
              purchases and their return limits.
            </h4>
            <div className='text-subtitle'>
              <h4 className='bold'>In time?</h4>
              <h4>Get your cash back with one click</h4>
            </div>
            <div className='text-subtitle'>
              <h4 className='bold'>Too late?</h4>
              <h4>Declutter your home and donate to local charities</h4>
            </div>

            <button
              onClick={() => {
                process.env.NODE_ENV === 'production' && submitApplication();
                triggerScanNow(3);
              }}
              className='authorize-now-button'
            >
              <img
                src={GoogleAuthorize}
                style={{ height: '48px' }}
                alt='google_authorize'
              />
            </button>

            <h4 className='text-first'>
              You first need to authorized noted to read your emails. Only bots
              will see the relevant emails and we will never sell or transfer
              any of your personal info to anyone.
            </h4>
            <h4 className='text-second'>
              Furthermore, noted&apos;s use and transfer to any other app of
              information received from Google APIs will adhere to{' '}
              <a
                href='https://developers.google.com/terms/api-services-user-data-policy'
                target='_blank'
                rel='noreferrer'
                className='sofia-pro text-underline'
              >
                Google API Services User Data Policy
              </a>{' '}
              , including the Limited Use requirements.
            </h4>
            <h4 className='text-underline' style={{ marginBottom: '1rem' }}>
              <a
                href='https://notedreturns.com/privacy-policy'
                target='_blank'
                rel='noreferrer'
                className='sofia-pro'
              >
                Learn more about security
              </a>
            </h4>
          </Col>
          <Col xs='6'>
            <div className='authorize-img'>
              <img src={AuthorizeImg} />
            </div>
          </Col>
        </Row>
      </Container>
      {/* MOBILE VIEW */}
      <Container
        className='main-body-mobile'
        fluid='lg'
        style={{ marginTop: '2.5rem' }}
      >
        <Row md='2' className='text-left align-items-end'>
          <Col xs='6'>
            <div className='authorize-img-mobile'>
              <img src={AuthorizeImg} />
            </div>
          </Col>
          <Col xs='6' className='info'>
            <h1 className='bold text-title'>Everything is automatic</h1>
            <h4 className='text-noted'>
              noted will scan your email inbox and find all of your online
              purchases and their return limits.
            </h4>
            <div className='text-subtitle'>
              <h4 className='bold'>In time?</h4>
              <h4 className='subtitle'>Get your cash back with one click</h4>
            </div>
            <div className='text-subtitle'>
              <h4 className='bold'>Too late?</h4>
              <h4 className='subtitle'>
                Declutter your home and donate to local charities
              </h4>
            </div>

            <h4 className='text-first'>
              You first need to authorized noted to read your emails. Only bots
              will see the relevant emails and we will never sell or transfer
              any of your personal info to anyone.
            </h4>
            <h4 className='text-second'>
              Furthermore, noted&apos;s use and transfer to any other app of
              information received from Google APIs will adhere to{' '}
              <a
                href='https://developers.google.com/terms/api-services-user-data-policy'
                target='_blank'
                rel='noreferrer'
                className='sofia-pro text-underline'
              >
                Google API Services User Data Policy
              </a>{' '}
              , including the Limited Use requirements.
            </h4>
            <h4 className='text-underline' style={{ marginBottom: '1rem' }}>
              <a href='#' className='sofia-pro'>
                Learn more about security
              </a>
            </h4>
            <button
              onClick={() => {
                if (process.env.NODE_ENV === 'production') {
                  submitApplication();
                }
                triggerScanNow(3);
              }}
              className='authorize-now-button'
            >
              <img
                src={GoogleAuthorize}
                style={{ height: '48px' }}
                alt='google_authorize'
              />
            </button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Authorize;
