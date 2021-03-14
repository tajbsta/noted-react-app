import React, { lazy } from 'react';
import { Container, Navbar } from 'react-bootstrap';
import ProfileIcon from '../assets/icons/Profile.svg';
import DropwDownIcon from '../assets/icons/InvertedTriangle.svg';
import Search from '../assets/icons/Search.svg';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import { unsetUser } from '../actions/auth.action';
import { unsetScan } from '../actions/scans.action';
import { searchScans } from '../actions/runtime.action';
import { get, isEmpty } from 'lodash';

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
  ];
  const {
    location: { pathname },
  } = useHistory();
  const { username, scans } = useSelector(({ auth: { username }, scans }) => ({
    username,
    scans,
  }));
  const showShadow = guestViews.includes(pathname) ? '' : 'shadow-sm';

  const logout = async () => {
    dispatch(await unsetUser());
    dispatch(await unsetScan());
    Auth.signOut()
      .then(async (data) => {
        setTimeout(() => {
          history.push('/login');
        }, 400);
      })
      .catch((error) => {
        console.log('Error Signing Out: ', error);
      });
  };

  const submitSearch = (keyword) => {
    dispatch(searchScans(keyword.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')));
  };

  const onSearchSubmit = (e) => {
    if (e.keyCode === 13 && !isEmpty(e.target.value)) {
      submitSearch(e.target.value);
    }
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
      {['/dashboard', '/view-scan'].includes(pathname) && (
        <>
          <Container className='ml-3'>
            <div className='input-group input-group-lg input-group-merge background-color'>
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
          <button
            className='navbar-toggler'
            type='button'
            data-toggle='collapse'
            data-target='#navbar-list-4'
            aria-controls='navbarNav'
            aria-expanded='false'
            aria-label='Toggle navigation'
          >
            <span className='navbar-toggler-icon'></span>
          </button>
          <div className='collapse navbar-collapse' id='navbar-list-4'>
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
                  {/* <a className="dropdown-item" href="#">
                    Dashboard
                  </a>
                  <a className="dropdown-item" href="#">
                    Edit Profile
                  </a> */}
                  <button className='dropdown-item sofia-pro' onClick={logout}>
                    Log Out
                  </button>
                </div>
              </li>
            </ul>
          </div>
        </>
      )}
    </Navbar>
  );
};

export default Topnav;
