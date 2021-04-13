import React, { useEffect, useState } from 'react';
import { Row, Col, Container, Navbar } from 'react-bootstrap';
import _ from 'lodash';
import ProfileIcon from '../assets/icons/Profile.svg';
import Search from '../assets/icons/Search.svg';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import { unsetUser } from '../actions/auth.action';
import { unsetScan } from '../actions/scans.action';
import { searchScans } from '../actions/runtime.action';
import BrandLogoSvg from './BrandLogoSvg';
import MobileNav from './MobileNav';

const Topnav = () => {
  let history = useHistory();
  const dispatch = useDispatch();

  const pageLocation = history.location.pathname;
  const [showDropdown, setShowDropdown] = useState(false);

  const handleWindowClick = (e) => {
    if (e.target && e.target.id !== 'navbarDropdownMenuLink') {
      setShowDropdown(false);
      window.removeEventListener('click', handleWindowClick);
    }
  };

  useEffect(() => {
    let mounted = true;
    if (showDropdown && mounted) {
      window.addEventListener('click', handleWindowClick);
    }
    return () => {
      window.removeEventListener('click', handleWindowClick);
    };
  }, [showDropdown]);

  const guestViews = [
    '/',
    '/login',
    '/join',
    '/forgot-password',
    '/reset-password',
    '/request-permission/',
    '/request-permission',
    '/code',
    '/code/',
    '/code/verify',
  ];
  const authenticatedViews = [
    '/dashboard',
    '/view-scan',
    '/profile',
    '/settings',
    '/view-return',
    '/edit-order',
  ];
  const {
    location: { pathname },
  } = useHistory();

  const showShadow = guestViews.includes(pathname) ? '' : 'shadow-sm';

  const logout = async () => {
    dispatch(await unsetUser());
    dispatch(await unsetScan());
    Auth.signOut()
      .then(async () => {
        setTimeout(() => {
          history.push('/login');
        }, 400);
      })
      .catch((error) => {
        console.log('Error Signing Out: ', error);
      });
  };

  const profile = () => {
    history.push('/profile');
  };

  const settings = () => {
    history.push('/settings');
  };

  const submitSearch = (e) => {
    if (e.key === 'Enter') {
      dispatch(searchScans(e.target.value));
    }
  };

  const checkClearSearch = _.debounce((e) => {
    const keyword = e.target.value || '';

    if (keyword.length === 0) {
      dispatch(searchScans(''));
    }
  }, 1000);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 641);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  return (
    <Navbar
      expand={`lg ${showShadow}`}
      style={{
        border: 'none',
        backgroundColor: guestViews.includes(pathname) ? '#FAF8FA' : '',
      }}
    >
      {!isMobile && (
        <>
          <Navbar.Brand
            href={`${
              guestViews.indexOf(pageLocation) != -1 ? '/' : '/dashboard'
            }`}
            className='ml-4 mr-1'
          >
            <BrandLogoSvg />
          </Navbar.Brand>
        </>
      )}

      {isMobile && (
        <MobileNav logout={logout} profile={profile} settings={settings} />
      )}

      {authenticatedViews.includes(pathname) && (
        <>
          <div id='DashboardNav'>
            <Container className='ml-3'>
              <div className='input-group input-group-lg input-group-merge background-color search-bar-input'>
                <input
                  type='text'
                  className='form-control form-control-prepended list-search background-color sofia-pro text-16 color'
                  placeholder='Search purchases'
                  onChange={checkClearSearch}
                  onKeyPress={submitSearch}
                />
                <div className='input-group-prepend'>
                  <div className='input-group-text background-color'>
                    <span className='fe fe-search'>
                      <img src={Search} />
                    </span>
                  </div>
                </div>
              </div>
            </Container>
            <div className='mr-4' id='nav-toggle'>
              <ul className='navbar-nav'>
                <li className='nav-item dropdown'>
                  <a
                    className='nav-link dropdown-toggle'
                    id='navbarDropdownMenuLink'
                    role='button'
                    data-toggle='dropdown'
                    aria-haspopup='true'
                    aria-expanded='false'
                    onClick={() => setShowDropdown(!showDropdown)}
                  >
                    <img
                      src={ProfileIcon}
                      width='30'
                      height='30'
                      id='navbarDropdownMenuLink'
                    />
                  </a>
                  <div
                    id='navigation-menu'
                    className='dropdown-menu'
                    aria-labelledby='navbarDropdownMenuLink'
                    style={{
                      display: showDropdown ? 'block' : 'none',
                    }}
                  >
                    <button
                      className='dropdown-item sofia-pro'
                      onClick={profile}
                    >
                      Profile
                    </button>
                    <button
                      className='dropdown-item sofia-pro'
                      onClick={settings}
                    >
                      Settings
                    </button>
                    <hr className='dropdown-line'></hr>
                    <button
                      className='dropdown-item sofia-pro'
                      onClick={logout}
                    >
                      Log Out
                    </button>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </>
      )}
    </Navbar>
  );
};

export default Topnav;
