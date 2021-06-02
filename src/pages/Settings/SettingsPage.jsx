import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import BasicInfo from './components/BasicInfo';
import EmailAddresses from './components/EmailAddresses';
import ChangePass from './components/ChangePass';
import DeleteAccount from './components/DeleteAccount';
import UserInfo from './../Profile/components/UserInfo';
import { Link } from 'react-scroll';
import { getUser } from '../../api/auth';
import { scrollToTop } from '../../utils/window';

export default function SettingsPage() {
  const [user, setUser] = useState({});
  const [currentTab, setCurrenTab] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    scrollToTop();
    function handleResize() {
      setIsMobile(window.innerWidth <= 991);
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

  const isActive = (tabName) => {
    return tabName === currentTab
      ? { color: '#570097', fontWeight: '700' }
      : {};
  };

  const renderSettingsNavigation = () => (
    <div className='col-sm-3 left'>
      {/*LEFT CARD*/}
      <Card id='leftCard'>
        <h1 className='card-title'>Account Settings</h1>
        <ul className='list-unstyled nav-items'>
          <li className='nav-item'>
            <Link
              to='BasicInfo'
              spy={true}
              smooth={true}
              className='nav-link'
              offset={-70}
              duration={500}
              onClick={() => {
                setCurrenTab('BasicInfo');
              }}
              color='purple'
              style={isActive('BasicInfo')}
            >
              Basic Information
            </Link>
          </li>
          <li className='nav-item'>
            <Link
              to='EmailAddresses'
              spy={true}
              smooth={true}
              className='nav-link'
              offset={-70}
              duration={500}
              onClick={() => {
                setCurrenTab('EmailAddresses');
              }}
              style={isActive('EmailAddresses')}
            >
              Email Addresses
            </Link>
          </li>
          <li className='nav-item'>
            <Link
              to='ChangePass'
              spy={true}
              smooth={true}
              className='nav-link'
              offset={-70}
              duration={500}
              onClick={() => {
                setCurrenTab('ChangePass');
              }}
              style={isActive('ChangePass')}
            >
              Change Password
            </Link>
          </li>
          <li className='nav-item'>
            <Link
              to='DeleteAccount'
              spy={true}
              smooth={true}
              className='nav-link'
              offset={-70}
              duration={500}
              onClick={() => {
                setCurrenTab('DeleteAccount');
              }}
              style={isActive('DeleteAccount')}
            >
              Delete Account
            </Link>
          </li>
        </ul>
      </Card>
    </div>
  );

  return (
    <div>
      <div id='Settings' className='container mt-6'>
        {isMobile && (
          <>
            <div className='row' style={{ paddingBottom: '48px' }}>
              <div className={isTablet ? 'col-sm-12' : 'col-sm-3'}>
                <div className={`col ${!isMobile ? '' : 'm-no-col'}`}>
                  <UserInfo user={user} />
                </div>
              </div>
            </div>
          </>
        )}
        <div className='row'>
          {!isMobile && renderSettingsNavigation()}
          {/* RIGHT CARD */}
          <div className={isTablet ? 'col-sm-12' : 'col-sm-9'}>
            <BasicInfo user={user} />
            <EmailAddresses user={user} />
            <ChangePass />
            <DeleteAccount />
          </div>
        </div>
      </div>
    </div>
  );
}
