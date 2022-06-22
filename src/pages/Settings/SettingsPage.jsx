import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import BasicInfo from './components/BasicInfo';
import ChangePass from './components/ChangePass';
import DeleteAccount from './components/DeleteAccount';
import UserInfo from './../Profile/components/UserInfo';
import MyCredits from './components/MyCredits';
import EmailAddress from './components/EmailAddresses';
import { Link } from 'react-scroll';
import { getUser } from '../../api/auth';
import { scrollToTop } from '../../utils/window';
import { Auth } from 'aws-amplify';
import { subscriptionHistory } from '../../api/subscription';
import AddOrUpgradeModal from '../../modals/AddOrUpgradeModal';
import CancelSubscriptionModal from '../../modals/CancelSubscriptionModal';
import { subscriptionPlans } from '../../api/subscription';
import { loadStripe } from '@stripe/stripe-js';
import { getPublicKey } from '../../api/orderApi';
import { Elements } from '@stripe/react-stripe-js';

const SettingsPage = () => {
  const [user, setUser] = useState(null);
  const [currentTab, setCurrenTab] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isGoogleSignIn, setIsGoogleSignIn] = useState(false);
  const [history, setHistory] = useState([]);
  const [showPickupsLeftModal, setShowPickupsLeftModal] = useState(false);
  const [
    showCancelSubscriptionModal,
    setShowCancelSubscriptionModal,
  ] = useState(false);
  // const [validPayment, setValidPayment] = useState(false);
  const [plans, setPlans] = useState([]);

  useEffect(async () => {
    const plans = await subscriptionPlans();

    setPlans(plans.data);
  }, []);

  const onHide = () => {
    setShowPickupsLeftModal(false);
    setShowCancelSubscriptionModal(false);
  };

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
      const history = await subscriptionHistory();
      setHistory(history);
    })();
  }, [showPickupsLeftModal, showCancelSubscriptionModal]);

  const isActive = (tabName) => {
    return tabName === currentTab
      ? { color: '#570097', fontWeight: '700' }
      : {};
  };

  useEffect(() => {
    (async () => {
      const currentUser = await Auth.currentUserPoolUser();
      setIsGoogleSignIn(`${currentUser.username}`.includes('Google'));
    })();
  }, []);

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
          {isGoogleSignIn === false && (
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
          )}

          <li className='nav-item'>
            <Link
              to='mycredits-container'
              spy={true}
              smooth={true}
              className='nav-link'
              offset={-70}
              duration={500}
              onClick={() => {
                setCurrenTab('mycredits-container');
              }}
              style={isActive('mycredits-container')}
            >
              My Credits
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
        {!user && 'Loading...'}
        {user && isMobile && (
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
            {isGoogleSignIn === false && <ChangePass />}
            <MyCredits
              user={user}
              history={history}
              onAdd={() => setShowPickupsLeftModal(true)}
              onCancel={() => setShowCancelSubscriptionModal(true)}
            />
            <EmailAddress user={user} />
            <DeleteAccount />
          </div>
        </div>
      </div>

      <AddOrUpgradeModal
        show={showPickupsLeftModal}
        onHide={() => onHide()}
        // setValidPayment={setValidPayment}
        setValidPayment={() => {}}
        isAddOrUpgrade={true}
        plans={plans}
        user={user}
      />

      <CancelSubscriptionModal
        show={showCancelSubscriptionModal}
        onHide={() => onHide()}
        user={user}
      />
    </div>
  );
};

export const SettingsPageWrapper = () => {
  const [stripePromise, setStripePromise] = useState(null);

  const loadStripeComponent = async () => {
    const key = await getPublicKey();
    const stripePromise = loadStripe(key);
    setStripePromise(stripePromise);
  };

  // Fetch stripe publishable api key
  useEffect(() => {
    loadStripeComponent();
  }, []);

  return (
    <Elements stripe={stripePromise}>
      <SettingsPage />
    </Elements>
  );
};
