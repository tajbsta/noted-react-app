import React, { useState, useEffect } from 'react';
import UserInfo from './components/UserInfo';
import Address from './components/Address';
import Payment from './components/Payment';
import ReturnHistory from './components/ReturnHistory';
import ScheduledReturn from './components/ScheduledReturn';
import Archive from './components/Archive';
import { getUser } from '../../api/auth';
import { scrollToTop } from '../../utils/window';
import ProductsInReview from './components/ProductsInReview';

export default function ProfilePage() {
  const [showEditPayment] = useState(true);
  const [user, setUser] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    scrollToTop();
    function handleResize() {
      setIsMobile(window.innerWidth <= 1199);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  useEffect(() => {
    function handleResize() {
      setIsTablet(window.innerWidth >= 541 && window.innerWidth <= 990);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  useEffect(() => {
    (async () => {
      const user = await getUser();
      setUser(user);
    })();
  }, []);

  return (
    <div id='Profile' className='container mt-6'>
      {!user && 'Loading...'}
      {user && (
        <div className='row'>
          <div className={isTablet ? 'col-sm-12' : 'col-sm-3'}>
            {/*LEFT CARD*/}
            <div className={`col ${!isMobile ? '' : 'm-no-col'}`}>
              <UserInfo user={user} />
            </div>
          </div>
          <div
            className={`${isTablet ? 'col-sm-12' : 'col-sm-9'} ${
              isMobile ? 'mt-4' : ''
            }`}
          >
            <Address user={user} />
            <hr />
            {showEditPayment && <Payment />}
            <hr />
            <ProductsInReview />
            <hr />
            <ScheduledReturn />
            <hr />
            <ReturnHistory user={user} />
            <hr />
            <Archive user={user} />
            <hr />
          </div>
        </div>
      )}
    </div>
  );
}
