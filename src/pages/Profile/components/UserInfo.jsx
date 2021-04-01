import React, { useEffect, useState } from 'react';
import { Card, Container } from 'react-bootstrap';
import ProfileIcon from '../../../assets/icons/Profile.svg';
import moment from 'moment';
import { Upload } from 'react-feather';

export default function UserInfo({ user: userData }) {
  const [user, setUser] = useState({});
  const [file, setFile] = useState('');
  const [loading, setLoading] = useState(false);

  // Handles file upload event and updates state
  const handleUpload = (event) => {
    // const file = event.target.files[0];
    setFile(event.target.files[0]);

    if (file.size > 5097152) {
      alert('File is too large! The maximum size for file upload is 5 MB.');
    }

    setLoading(true);

    // Upload file to server (code goes under)

    setLoading(false);
  };

  // Display Image Component
  const ImageThumb = ({ image }) => {
    return (
      <img
        src={URL.createObjectURL(image)}
        alt={image.name}
        className='avatar-placeholder'
      />
    );
  };

  useEffect(() => {
    setUser(userData);
  }, [userData]);

  return (
    <div>
      <Card id='UserInfo'>
        <div className='card-body text-center'>
          <div className='img-container'>
            {user.profile && (
              <img
                src={user.profile}
                className={`${
                  file ? 'no-default-avatar' : 'avatar-placeholder'
                }`}
                alt='...'
              />
            )}
            {!user.profile && (
              <img
                src={ProfileIcon}
                className={`${file ? 'no-default-avatar' : 'default-avatar'}`}
                alt='...'
              />
            )}

            {file && <ImageThumb image={file} />}

            <div className='upload-button'>
              <i className='fa fa-upload-icon' aria-hidden='true'>
                <Upload />

                <input
                  className='file-upload'
                  type='file'
                  accept='.jpg, .jpeg, .png'
                  onChange={handleUpload}
                />
              </i>
            </div>
          </div>
          <h2
            className={`card-title ${
              file || user.profile ? 'margin-name' : 'name'
            }`}
          >
            {user.name || user.email}
          </h2>
          <p className='small text-muted mb-3 date'>
            User since {moment(user.createdAt).format('MMMM DD, YYYY')}
          </p>
          <hr className='line-break-user' />
          <div className='row align-items-center justify-content-between'>
            <div className='col-auto'>
              <div>
                <h4 className='text-left total'>0</h4>
                <h5 className='total-label'>Total Returns</h5>
              </div>
            </div>
            <div className='col-auto'>
              <div>
                <h4 className='text-left total'>0</h4>
                <h5 className='total-label'>Total Donations</h5>
              </div>
            </div>
          </div>
        </div>
        <Container className='d-flex justify-content-center'>
          <button className='btn'>
            <a href='/settings' className='btn btn-lg btn-primary'>
              Account Settings
            </a>
          </button>
        </Container>
      </Card>
    </div>
  );
}
