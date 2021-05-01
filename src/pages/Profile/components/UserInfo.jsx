import React, { useEffect, useState, useRef } from 'react';
import { Card, Container, Col, Row, Spinner } from 'react-bootstrap';
import { Check, AlertCircle } from 'react-feather';
import ProfileIcon from '../../../assets/icons/Profile.svg';
import moment from 'moment';
import { Upload } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfilePicture } from '../../../actions/runtime.action';
import { get, isEmpty } from 'lodash-es';
import { useHistory } from 'react-router-dom';
import { toBase64 } from '../../../utils/file';
import { getUser, uploadProfilePic } from '../../../utils/auth';

export default function UserInfo({ user: userData = {} }) {
  const {
    location: { pathname },
  } = useHistory();
  const dispatch = useDispatch();
  const [user, setUser] = useState({});
  const [file, setFile] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  const { profileImage } = useSelector(({ auth: { profileImage } }) => ({
    profileImage,
  }));

  const hiddenFileInput = useRef(null);

  useEffect(() => {
    (async () => {
      const user = await getUser();
      console.log(user);
      setUser(user);
    })();
  }, []);

  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };

  // Handles file upload event and updates state
  const handleUpload = async (event) => {
    setLoading(true);

    try {
      setError(null);
      setSuccess(null);

      const file = event.target.files[0];

      if (file && file.size > 5097152) {
        throw new Error(
          'File is too large! The maximum size for file upload is 5 MB.'
        );
      }

      setFile(file);

      dispatch(updateProfilePicture(await toBase64(file)));

      await uploadProfilePic(user.sub, user.profile, file);
      setLoading(false);

      setError(false);
      setSuccess(true);
    } catch (err) {
      setLoading(false);

      setError(true);
    }
  };

  // Display Image Component
  const ImageThumb = ({ image, base64URI }) => {
    if (image) {
      return (
        <img
          src={URL.createObjectURL(image)}
          alt={image.name}
          className='avatar-placeholder'
          style={{ opacity: loading ? '0.7' : '1' }}
        />
      );
    }

    if (base64URI) {
      return <img src={base64URI} className='avatar-placeholder' />;
    }
    return <img src='' className='avatar-placeholder' />;
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
                {success && (
                  <>
                    <div className='profile-alert-icon'>
                      <Check />
                    </div>
                  </>
                )}
                {error && (
                  <>
                    <div
                      className='profile-alert-icon'
                      style={{ color: 'red' }}
                    >
                      <AlertCircle />
                    </div>
                  </>
                )}

                {loading && (
                  <Spinner
                    animation='border'
                    size='md'
                    className='spinner btn-spinner'
                    style={{
                      color: '#570097',
                      zIndex: 1,
                      position: 'absolute',
                    }}
                  />
                )}
                {user.profile && !file && (
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
                      disabled={loading}
                    />
                  </i>
                </div>
              </div>
              {/* {error && (
                <div className='alert alert-danger' role='alert'>
                  <div>
                    <h4 className='text-center text-alert'>
                      File is too large! The maximum size for file upload is 5
                      MB.
                    </h4>
                  </div>
                </div>
              )} */}
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
                    {loading && (
                      <Spinner
                        animation='border'
                        size='md'
                        className='spinner btn-spinner'
                        style={{
                          color: '#570097',
                          zIndex: 1,
                          position: 'absolute',
                        }}
                      />
                    )}
                    {!isEmpty(user.profile) && (
                      <img
                        src={get(user, 'profile', '')}
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
          <div className='row align-items-center justify-content-between m-info-row'>
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
            <a
              href={pathname === '/profile' ? '/settings' : '/profile'}
              className='btn btn-lg btn-primary'
            >
              {pathname === '/profile' ? 'Account Settings' : 'Profile'}
            </a>
          </button>
        </Container>
      </Card>
    </div>
  );
}
