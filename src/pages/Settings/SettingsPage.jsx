import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import BasicInfo from './components/BasicInfo';
import EmailAddresses from './components/EmailAddresses';
import ChangePass from './components/ChangePass';
import DeleteAccount from './components/DeleteAccount';
import UserInfo from './../Profile/components/UserInfo';
import { Link } from 'react-scroll';
import { getUser } from '../../utils/auth';

export default function SettingsPage() {
  const [user, setUser] = useState({});
  const [currentTab, setCurrenTab] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
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
            <div style={{ margin: '-12px', paddingBottom: '48px' }}>
              <UserInfo user={user} />
            </div>
          </>
        )}
        <div className='row'>
          {!isMobile && renderSettingsNavigation()}
          {/* RIGHT CARD */}
          <div className='col-sm-9'>
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
