import React, { useState, useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import UserInfo from './components/UserInfo';
import Address from './components/Address';
import Payment from './components/Payment';
import ReturnHistory from './components/ReturnHistory';
import ScheduledReturn from './components/ScheduledReturn';
import { useFormik } from 'formik';
import {
  paymentAddressSchema,
  pickUpAddressSchema,
} from '../../models/formSchema';
import { getUser } from '../../utils/auth';
import DatePicker from '../../components/DatePicker';

export default function ProfilePage() {
  const [showEditPayment] = useState(true);
  const [user, setUser] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
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
    (async () => {
      const user = await getUser();
      setUser(user);
    })();
  }, []);

  return (
    <div id='Profile'>
      <div className='container mt-6'>
        {!user && 'Loading...'}
        {user && (
          <div className='row'>
            <div className={`col-sm-3 ${!isMobile ? '' : 'm-no-col'}`}>
              {/*LEFT CARD*/}
              <div className={`col ${!isMobile ? '' : 'm-no-col'}`}>
                <UserInfo user={user} />
              </div>
            </div>
            <div className={`col-sm-9 ${!isMobile ? '' : 'mt-4'}`}>
              <Address user={user} />
              <hr />
              {showEditPayment && <Payment />}
              <hr />
              <ScheduledReturn />
              <hr />
              <ReturnHistory />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
