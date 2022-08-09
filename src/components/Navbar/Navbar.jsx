import React, { useEffect, useState } from 'react';
import { Button, Container, Form, Nav, Navbar } from 'react-bootstrap';
import _ from 'lodash';
import qs from 'qs';
import ProfileIcon from '../../assets/icons/Profile.svg';
import Search from '../../assets/icons/Search.svg';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import { unsetUser } from '../../actions/auth.action';
import { unsetScan } from '../../actions/scans.action';
import { searchScans } from '../../actions/runtime.action';
import BrandLogoSvg from './BrandLogoSvg';
import MobileNav from './MobileNav';
import { showError } from '../../library/notifications.library';
import { clearCart } from '../../actions/cart.action';
import { Link } from 'react-scroll';

export default function Topnav() {
  const history = useHistory();
  const dispatch = useDispatch();
  const pageLocation = history.location.pathname;
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleWindowClick = (e) => {
    if (e.target && e.target.id !== 'navbarDropdownMenuLink') {
      setShowDropdown(false);
      window.removeEventListener('click', handleWindowClick);
    }
  };

  useEffect(() => {
    const mounted = true;
    if (showDropdown && mounted) {
      window.addEventListener('click', handleWindowClick);
    }
    return () => {
      window.removeEventListener('click', handleWindowClick);
    };
  }, [showDropdown]);

  useEffect(() => {
    const query = qs.parse(history.location.search, {
      ignoreQueryPrefix: true,
    });

    if (query.search) {
      setSearchQuery(query.search);
      dispatch(searchScans(query.search));
    }
  }, []);

  const guestViews = [
    '/',
    '/login',
    '/join',
    '/forgot-password',
    '/reset-password',
    '/request-permission/',
    '/request-permission',
  ];

  const publicViews = [
    '/',
    '/login',
    '/join',
    '/forgot-password',
    '/reset-password',
  ];

  /**VIEW DOES NOT HAVE DATA BUT USER HAS ACCOUNT */
  const preDataViews = ['/dashboard/initial'];

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

          // Clear cart on destroy
          dispatch(clearCart());
        }, 400);
      })
      .catch(() => {
        showError({ message: 'Error Signing Out' });
      });
  };

  const profile = () => {
    history.push('/profile');
  };

  const vendors = () => {
    history.push('/vendors');
  };

  const backToHome = () => {
    if (publicViews.includes(pageLocation)) {
      window.open(`${process.env.REACT_APP_NOTED_LANDING || ''}`, '_blank');
      return;
    }

    if (guestViews.indexOf(pageLocation) !== -1) {
      history.push('/');
    } else {
      if (searchQuery) {
        dispatch(searchScans(''));
      }
      history.push('/dashboard');
    }
  };

  const settings = () => {
    history.push('/settings');
  };

  const submitsearch = (e) => {
    if (e.key === 'Enter') {
      const search = searchQuery.trim();
      if (search) {
        history.push('/dashboard?search=' + search);
      } else {
        history.push('/dashboard');
      }

      dispatch(searchScans(search));
    }
  };

  const checkclearsearch = _.debounce((e) => {
    const keyword = e.target.value || '';

    if (keyword.length === 0) {
      dispatch(searchScans(''));
    }
  }, 1000);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function handleResize() {
      console.log('window.innerWidth', window.innerWidth);
      setIsMobile(window.innerWidth <= 991);
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
      }}
    >
      {isMobile ? (
        <MobileNav
          logout={logout}
          profile={profile}
          settings={settings}
          vendors={vendors}
          checkclearsearch={checkclearsearch}
          submitsearch={submitsearch}
          backToHome={backToHome}
        />
      ) : (
        <>
          <Navbar.Brand
            onClick={backToHome}
            style={{ cursor: 'pointer' }}
            className='ml-4 mr-1'
          >
            <BrandLogoSvg />
          </Navbar.Brand>
          {!guestViews.includes(pathname) ? (
            <>
              <div id='DashboardNav'>
                <Container className='ml-3'>
                  <Form onSubmit={(e) => e.preventDefault()}>
                    <div className='input-group input-group-lg input-group-merge background-color search-bar-input'>
                      <Form.Control
                        type='text'
                        className='form-control form-control-prepended list-search background-color sofia-pro text-16 color'
                        placeholder='Search purchases'
                        value={searchQuery}
                        disabled={preDataViews.includes(pathname)}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={submitsearch}
                      />
                      <div className='input-group-prepend'>
                        <div className='input-group-text background-color'>
                          <span className='fe fe-search'>
                            <img src={Search} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Form>
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
                          onClick={vendors}
                        >
                          Vendors
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
          ) : (
            <div id='GuestNav'>
              <div className='nav-wrapper'>
                <ul className='list-unstyled nav-items'>
                  <li className='nav-item link'>
                    <a href='https://www.notedreturns.com/about'>About</a>
                  </li>
                  <li className='nav-item link'>
                    <a href='https://www.notedreturns.com/safety'>Safety</a>
                  </li>
                  <li className='nav-item link'>
                    <a href='https://www.notedreturns.com/community'>
                      Community
                    </a>
                  </li>
                  <li className='nav-item link'>
                    <a href='https://www.notedreturns.com/help'>Help</a>
                  </li>
                  <li className='nav-item link'>
                    <a href='https://www.notedreturns.com/careers'>Careers</a>
                  </li>
                </ul>
              </div>
              <div id='auth-buttons'>
                <ul className='list-unstyled nav-items'>
                  <li className='nav-item link auth-link'>
                    <a
                      href='javascript:void(0)'
                      onClick={() => history.push('/login')}
                    >
                      Login
                    </a>
                  </li>
                </ul>
                <Button
                  type='primary'
                  className='px-5 py-3'
                  onClick={() => history.push('/join')}
                >
                  Sign Up Now
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </Navbar>
  );
}
