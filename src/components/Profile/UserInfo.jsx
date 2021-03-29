import React, { useEffect, useState } from 'react';
import { Card, Container } from 'react-bootstrap';
import ProfileIcon from '../../../src/assets/icons/Profile.svg';
import { getUser } from '../../utils/auth';
import moment from 'moment';

export default function UserInfo({ user: userData }) {
  const [user, setUser] = useState({});

  useEffect(() => {
    setUser(userData);
  }, [userData]);

  return (
    <div>
      <Card id='UserInfo'>
        <div className='card-body text-center'>
          <div className='img-container'>
            {user.profile && (
              <img
                src={user.profile}
                className='avatar-placeholder'
                alt='...'
              />
            )}
            {!user.profile && (
              <img src={ProfileIcon} className='default-avatar' alt='...' />
            )}
          </div>
          <h2 className='card-title name'>{user.name || user.email}</h2>
          <p className='small text-muted mb-3 date'>
            User since {moment(user.createdAt).format('MMMM DD, YYYY')}
          </p>
          <hr className='line-break-user' />
          <div className='row align-items-center justify-content-between'>
            <div className='col-auto'>
              <div>
                <h4 className='text-left total'>0</h4>
                <h5 className='total-label'>Total Returns</h5>
              </div>
            </div>
            <div className='col-auto'>
              <div>
                <h4 className='text-left total'>0</h4>
                <h5 className='total-label'>Total Donations</h5>
              </div>
            </div>
          </div>
        </div>
        <Container className='d-flex justify-content-center'>
          <button className='btn'>
            <a href='/settings' className='btn btn-lg btn-primary'>
              Account Settings
            </a>
          </button>
        </Container>
      </Card>
    </div>
  );
}
