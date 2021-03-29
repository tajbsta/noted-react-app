import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import BasicInfo from '../components/Settings/BasicInfo';
import EmailAddresses from '../components/Settings/EmailAddresses';
import ChangePass from '../components/Settings/ChangePass';
import DeleteAccount from '../components/Settings/DeleteAccount';
import { Link } from 'react-scroll';
import { useFormik } from 'formik';
import { pickUpAddressSchema } from '../models/formSchema';
import { getUser } from '../utils/auth';

export default function SettingsPage() {
  const [user, setUser] = useState(null);

  const {
    handleChange: handleAddressChange,
    values: addressFormValues,
  } = useFormik({
    initialValues: {
      fullName: '',
      state: '',
      zipCode: '',
      line1: '',
      line2: '',
      phoneNumber: '',
    },
    validationSchema: pickUpAddressSchema,
  });

  useEffect(() => {
    (async () => {
      const user = await getUser();
      setUser(user);
    })();
  }, []);

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
                    to='EmailAddresses'
                    spy={true}
                    smooth={true}
                    className='nav-link'
                    offset={-70}
                    duration={500}
                  >
                    Email Addresses
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
                  <Link
                    to='DeleteAccount'
                    spy={true}
                    smooth={true}
                    className='nav-link'
                    offset={-70}
                    duration={500}
                  >
                    Delete Account
                  </Link>
                </li>
              </ul>
            </Card>
            <div className='col'></div>
          </div>
          {/* RIGHT CARD */}
          <div className='col-sm-9'>
            <BasicInfo
              {...addressFormValues}
              handleChange={handleAddressChange}
            />
            <EmailAddresses user={user} />
            <ChangePass />
            <DeleteAccount />
          </div>
        </div>
      </div>
    </div>
  );
}
