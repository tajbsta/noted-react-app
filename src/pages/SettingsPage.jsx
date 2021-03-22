import React from 'react';
import { Card } from 'react-bootstrap';
import BasicInfo from '../components/Settings/BasicInfo';
import ChangePass from '../components/Settings/ChangePass';
import { Link, animateScroll as scroll } from 'react-scroll';

export default function SettingsPage() {
  return (
    <div>
      <div id='Settings' className='container mt-6'>
        <div className='row'>
          <div className='col-sm-3 left'>
            {/*LEFT CARD*/}
            <Card id='leftCard'>
              <h1 className='card-title'>Account Settings</h1>
              <ul className='list-unstyled nav-items'>
                <li className='nav-item'>
                  <Link
                    activeClass='active'
                    to='BasicInfo'
                    spy={true}
                    smooth={true}
                    className='nav-link'
                    offset={-70}
                    duration={500}
                  >
                    Basic Information
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
                  >
                    Change Password
                  </Link>
                </li>
                <li className='nav-item'>
                  <a href='#' className='nav-link'>
                    Change Email
                  </a>
                </li>
              </ul>
            </Card>
            <div className='col'></div>
          </div>
          {/* RIGHT CARD */}
          <div className='col-sm-9'>
            <BasicInfo />
            <ChangePass />
          </div>
        </div>
      </div>
    </div>
  );
}
