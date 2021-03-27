import React, { useEffect } from 'react';
import { Card, Container } from 'react-bootstrap';
import ProfileIcon from '../../../src/assets/icons/Profile.svg';
import { getUser } from '../../utils/auth';
export default function UserInfo() {
  useEffect(() => {
    (async () => {
      const user = await getUser();
      console.log({
        user,
      });
    })();
  }, []);

  return (
    <div>
      <Card id='UserInfo'>
        <div className='card-body text-center'>
          <div className='img-container'>
            <img src={ProfileIcon} className='avatar-placeholder' alt='...' />
          </div>
          <h2 className='card-title name'>Jason Chan</h2>
          <p className='small text-muted mb-3 date'>
            User since Augst 24, 2021
          </p>
          <hr className='line-break-user' />
          <div className='row align-items-center justify-content-between'>
            <div className='col-auto'>
              <div>
                <h4 className='text-left total'>200</h4>
                <h5 className='total-label'>Total Returns</h5>
              </div>
            </div>
            <div className='col-auto'>
              <div>
                <h4 className='text-left total'>99</h4>
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
