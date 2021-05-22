import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Nav, Navbar, Form, Button } from 'react-bootstrap';
import BrandLogoSvg from './BrandLogoSvg';
import { searchScans } from '../../actions/runtime.action';
import { useDispatch } from 'react-redux';

export default function MobileNav({
  checkclearsearch,
  profile,
  settings,
  logout,
}) {
  const dispatch = useDispatch();
  const history = useHistory();
  const pageLocation = history.location.pathname;
  const {
    location: { pathname },
  } = useHistory();
  const [searchButton, setSearchButton] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');

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

  const submitsearch = (e) => {
    if (e.key === 'Enter') {
      dispatch(searchScans(e.target.value));
    }
  };

  return (
    <div id='MobileNav-dashboard' style={{ width: '100%' }}>
      <Navbar
        style={{
          backgroundColor:
            guestViews.indexOf(pageLocation) != -1 ? '#FAF8FA' : '',
        }}
        expand='lg'
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
              <Navbar.Toggle
                className='search-toggler-icon'
                aria-controls='basic-navbar-nav'
                onClick={() => {
                  setSearchButton(true);
                }}
              />
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
                    <Form inline onSubmit={(e) => e.preventDefault()}>
                      <Form.Control
                        type='text'
                        placeholder='Search purchases'
                        onKeyPress={(e) => {
                          checkclearsearch(e);
                          submitsearch(e);
                        }}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        value={searchQuery}
                      />
                    </Form>
                    <Button
                      variant='outline-primary'
                      className='ml-3'
                      onClick={() => {
                        checkclearsearch({
                          target: {
                            value: searchQuery,
                          },
                        });
                        submitsearch({
                          key: 'Enter',
                          target: {
                            value: searchQuery,
                          },
                        });
                      }}
                    >
                      Go!
                    </Button>
                  </div>
                </>
              )}

              {!searchButton && (
                <>
                  <Nav className='mr-auto'>
                    <Nav.Link onClick={profile}>Profile</Nav.Link>
                    <Nav.Link onClick={settings}>Settings</Nav.Link>
                    <Nav.Link onClick={logout}>Logout</Nav.Link>
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
