import React, { useEffect, useState, useRef } from 'react';
import { Button, Card, Container, Col, Row } from 'react-bootstrap';
import ProfileIcon from '../../../assets/icons/Profile.svg';
import moment from 'moment';
import { Upload } from 'react-feather';

export default function UserInfo({ user: userData }) {
  const [user, setUser] = useState({});
  const [file, setFile] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const hiddenFileInput = useRef(null);

  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };

  // Handles file upload event and updates state
  const handleUpload = (event) => {
    // const file = event.target.files[0];
    setFile(event.target.files[0]);

    if (file && file.size > 5097152) {
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
    function handleResize() {
      setIsMobile(window.innerWidth <= 991);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  useEffect(() => {
    setUser(userData);
  }, [userData]);

  return (
    <div>
      <Card id='UserInfo'>
        <div className='card-body text-center'>
          {!isMobile && (
            <>
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
                    className={`${
                      file ? 'no-default-avatar' : 'default-avatar'
                    }`}
                    alt='...'
                  />
                )}

                {file && <ImageThumb image={file} />}

                <div className='upload-button'>
                  <i
                    className='fa fa-upload-icon'
                    aria-hidden='true'
                    onClick={handleClick}
                    style={{ cursor: 'pointer' }}
                  >
                    <Upload />
                    <input
                      style={{ display: 'none' }}
                      className='file-upload'
                      type='file'
                      accept='.jpg, .jpeg, .png'
                      ref={hiddenFileInput}
                      onChange={handleUpload}
                    />
                  </i>
                </div>
              </div>
              <div>
                <h2 className='card-title name'>{user.name || user.email}</h2>
                <p className='small text-muted mb-3 date'>
                  User since {moment(user.createdAt).format('MMMM DD, YYYY')}
                </p>
              </div>
            </>
          )}

          {/* MOBILE VIEWS */}
          {isMobile && (
            <>
              <Row>
                <Col xs={4}>
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
                        className={`${
                          file ? 'no-default-avatar' : 'default-avatar'
                        }`}
                        alt='...'
                      />
                    )}

                    {file && <ImageThumb image={file} />}

                    <div className='upload-button'>
                      <i
                        className='fa fa-upload-icon'
                        aria-hidden='true'
                        onClick={handleClick}
                        style={{ cursor: 'pointer' }}
                      >
                        <Upload />
                        <input
                          style={{ display: 'none' }}
                          className='file-upload'
                          type='file'
                          accept='.jpg, .jpeg, .png'
                          ref={hiddenFileInput}
                          onChange={handleUpload}
                        />
                      </i>
                    </div>
                  </div>
                </Col>
                <Col>
                  <Row>
                    <h2 className='card-title name'>
                      {user.name || user.email}
                    </h2>
                  </Row>
                  <Row>
                    <p className='small text-muted mb-3 date'>
                      User since{' '}
                      {moment(user.createdAt).format('MMMM DD, YYYY')}
                    </p>
                  </Row>
                </Col>
              </Row>
            </>
          )}
          <hr className='line-break-user' />
          <div className='row align-items-center justify-content-between'>
            <div className='m-col-auto'>
              <div>
                <h4 className='text-left total'>0</h4>
                <h5 className='total-label'>Total Returns</h5>
              </div>
            </div>
            <div className='m-col-auto'>
              <div>
                <h4 className='text-left total'>0</h4>
                <h5 className='total-label'>Total Donations</h5>
              </div>
            </div>
          </div>
        </div>
        <Container
          className={`d-flex justify-content-center ${
            isMobile ? 'm-btn-container' : ''
          }`}
        >
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
