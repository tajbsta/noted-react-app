import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Nav, Navbar, Form, FormControl, Button } from 'react-bootstrap';
import BrandLogoSvg from './BrandLogoSvg';

export default function MobileNav(props) {
  const history = useHistory();
  const pageLocation = history.location.pathname;
  const {
    location: { pathname },
  } = useHistory();
  const [searchButton, setSearchButton] = useState(false);

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
              <button
                aria-controls='basic-navbar-nav'
                className='m-btn-search btn navbar-toggler collapsed'
                label='Toggle navigation'
              >
                <Navbar.Toggle
                  className='search-toggler-icon'
                  aria-controls='basic-navbar-nav'
                  onClick={() => {
                    setSearchButton(true);
                  }}
                />
              </button>
            </div>

            <Navbar.Toggle
              aria-controls='basic-navbar-nav'
              onClick={() => {
                setSearchButton(false);
              }}
            />
            <Navbar.Collapse id='basic-navbar-nav'>
              {searchButton && (
                <>
                  <div className='mobile-search-container'>
                    <Form inline>
                      <FormControl
                        type='text'
                        placeholder='Search purchases'
                        onChange={props.checkClearSearch}
                        onKeyPress={props.submitSearch}
                      />
                    </Form>
                    <Button variant='outline-primary' className='ml-3'>
                      Go!
                    </Button>
                  </div>
                </>
              )}

              {!searchButton && (
                <>
                  <Nav className='mr-auto'>
                    <Nav.Link onClick={props.profile}>Profile</Nav.Link>
                    <Nav.Link onClick={props.settings}>Settings</Nav.Link>
                    <Nav.Link onClick={props.logout}>Logout</Nav.Link>
                  </Nav>
                </>
              )}
            </Navbar.Collapse>
          </>
        )}
      </Navbar>
    </div>
  );
}
