import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Nav, NavDropdown, Navbar } from 'react-bootstrap';
import BrandLogoSvg from './BrandLogoSvg';
import Search from '../assets/icons/Search.svg';

export default function MobileNav(props) {
  const history = useHistory();
  const pageLocation = history.location.pathname;
  const {
    location: { pathname },
  } = useHistory();

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

  return (
    <div id='MobileNav-dashboard' style={{ width: '100%' }}>
      <Navbar
        style={{
          backgroundColor:
            guestViews.indexOf(pageLocation) != -1 ? '#FAF8FA' : '',
        }}
        expand='lg'
        {...props}
      >
        <Navbar.Brand
          href={`${
            guestViews.indexOf(pageLocation) != -1 ? '/' : '/dashboard'
          }`}
        >
          <BrandLogoSvg />
        </Navbar.Brand>

        {!guestViews.includes(pathname) && (
          <>
            <div className='m-search-container'>
              <button className='m-btn-search btn'>
                <img src={Search} className='m-search-icon' />
              </button>
            </div>
            <Navbar.Toggle aria-controls='basic-navbar-nav' />
            <Navbar.Collapse id='basic-navbar-nav'>
              <Nav className='mr-auto'>
                <Nav.Link onClick={props.profile}>Profile</Nav.Link>
                <Nav.Link onClick={props.settings}>Settings</Nav.Link>
                <Nav.Link onClick={props.logout}>Logout</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </>
        )}
      </Navbar>
    </div>
  );
}
