import React from 'react';
import { Card, Container } from 'react-bootstrap';
import BasicInfo from '../components/Settings/BasicInfo';
import ChangePass from '../components/Settings/ChangePass';

export default function SettingsPage() {
  return (
    <div>
      <div id='Settings' className='container mt-6'>
        <div className='row'>
          <div className='col-sm-3 left'>
            {/*LEFT CARD*/}
            <Card id='leftCard'>
              <h1 className='card-title'>Account Settings</h1>
              <ul className='list-unstyled'>
                <li>
                  <a href='#' className='nav-link active'>
                    Basic Information
                  </a>
                </li>
                <li>
                  <a href='#' className='nav-link'>
                    Change Password
                  </a>
                </li>
                <li>
                  <a href='#' className='nav-link'>
                    Change Email
                  </a>
                </li>
              </ul>
            </Card>
            <div className='col'></div>
          </div>
          <div className='col-sm-9'>
            <BasicInfo />
            <ChangePass />
          </div>
        </div>
      </div>
    </div>
  );
}
