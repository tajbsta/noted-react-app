import React from 'react';
import UserInfo from '../components/Profile/UserInfo';
import Address from '../components/Profile/Address';
import Payment from '../components/Profile/Payment';
import ReturnHistory from '../components/Profile/ReturnHistory';

export default function ProfilePage() {
  return (
    <div>
      <div className='container mt-6'>
        <div className='row'>
          <div className='col-sm-3'>
            {/*RIGHT CARD*/}
            <div className='col'>
              <UserInfo />
            </div>
          </div>
          <div className='col-sm-9'>
            {/*LEFT CARD*/}
            <Address />
            <Payment />
            <ReturnHistory />
          </div>
        </div>
      </div>
    </div>
  );
}
