import React, { lazy } from 'react';
import { Row, Col, Container, Navbar } from 'react-bootstrap';
import ProfileIcon from '../assets/icons/Profile.svg';
// import DropwDownIcon from '../assets/icons/InvertedTriangle.svg';
import Search from '../assets/icons/Search.svg';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import { unsetUser } from '../actions/auth.action';
import { unsetScan } from '../actions/scans.action';
import { searchScans } from '../actions/runtime.action';

const BrandLogoSvg = lazy(() => import('./BrandLogoSvg'));

const Topnav = () => {
  let history = useHistory();
  const dispatch = useDispatch();
  const pageLocation = history.location.pathname;

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

  const submitSearch = (keyword) => {
    dispatch(searchScans(keyword.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')));
  };

  return (
    <Navbar
      expand={`lg ${showShadow}`}
      style={{
        border: 'none',
        backgroundColor: guestViews.includes(pathname) ? '#FAF8FA' : '',
      }}
    >
      <Navbar.Brand
        href={`${guestViews.indexOf(pageLocation) != -1 ? '/' : '/dashboard'}`}
        className='ml-4 mr-1'
      >
        <BrandLogoSvg />
      </Navbar.Brand>
      {authenticatedViews.includes(pathname) && (
        <>
          <div id='DashboardNav'>
            {/* START OF MOBILE VIEWS */}
            <Container id='mobile-view'>
              <Row>
                <Col className='search-col'>
                  <div>
                    <img className='mobile-search-icon' src={Search} />
                  </div>
                </Col>
                <Col>
                  <ul className='navbar-nav'>
                    <li className='nav-item dropdown'>
                      <a
                        className='nav-link dropdown-toggle'
                        href='#'
                        id='navbarDropdownMenuLink'
                        role='button'
                        data-toggle='dropdown'
                        aria-haspopup='true'
                        aria-expanded='false'
                      >
                        <img src={ProfileIcon} width='30' height='30' />
                      </a>
                      <div
                        className='dropdown-menu'
                        aria-labelledby='navbarDropdownMenuLink'
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
                        <button
                          className='dropdown-item sofia-pro'
                          onClick={logout}
                        >
                          Log Out
                        </button>
                      </div>
                    </li>
                  </ul>
                </Col>
              </Row>
            </Container>
            {/* END OF MOBILE VIEWS */}

            <Container className='ml-3'>
              <div className='input-group input-group-lg input-group-merge background-color search-bar-input'>
                <input
                  type='text'
                  className='form-control form-control-prepended list-search background-color sofia-pro text-16 color'
                  placeholder='Search purchases'
                  onChange={(e) => submitSearch(e.target.value)}
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
            <div className='mr-2' id='nav-toggle'>
              <ul className='navbar-nav'>
                <li className='nav-item dropdown'>
                  <a
                    className='nav-link dropdown-toggle'
                    href='#'
                    id='navbarDropdownMenuLink'
                    role='button'
                    data-toggle='dropdown'
                    aria-haspopup='true'
                    aria-expanded='false'
                  >
                    <img src={ProfileIcon} width='30' height='30' />
                  </a>
                  <div
                    className='dropdown-menu'
                    aria-labelledby='navbarDropdownMenuLink'
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
