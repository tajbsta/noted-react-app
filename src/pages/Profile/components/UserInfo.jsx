import React, { useEffect, useState, useRef } from 'react';
import { Card, Col, Row, Spinner } from 'react-bootstrap';
import ProfileIcon from '../../../assets/icons/Profile.svg';
import moment from 'moment';
import { Upload } from 'react-feather';
import { useDispatch } from 'react-redux';
import { updateProfilePicture } from '../../../actions/runtime.action';
import { get, isEmpty } from 'lodash-es';
import { useHistory } from 'react-router-dom';
import { toBase64 } from '../../../utils/file';
import { getUser, getUserId, uploadProfilePic } from '../../../api/auth';
import { showError, showSuccess } from '../../../library/notifications.library';
import { CheckCircle } from 'react-feather';
import { getOrderHistoryCounts } from '../../../api/orderApi';
import DiamondLogo from '../../../assets/img/diamond-logo.svg';

export default function UserInfo({ user: userData = {} }) {
  const {
    location: { pathname },
  } = useHistory();
  const history = useHistory();
  const dispatch = useDispatch();
  const [user, setUser] = useState({});
  const [file, setFile] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [orderCount, setOrderCount] = useState(false);
  const hiddenFileInput = useRef(null);

  const getOrderItemHistoryCount = async () => {
    try {
      const userId = await getUserId();
      const orderCount = await getOrderHistoryCounts(userId);

      setOrderCount(orderCount);
      // console.log(orderCount);
    } catch (error) {
      // Does not seem to be needing a handler
    }
  };

  const redirectToSettings = () => {
    history.push('/settings');
  };

  const redirectToProfile = () => {
    history.push('/profile');
  };

  useEffect(() => {
    getOrderItemHistoryCount();
  }, []);

  useEffect(() => {
    (async () => {
      const user = await getUser();
      // console.log(user);
      setUser(user);
    })();
  }, []);

  const handleClick = () => {
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
      showSuccess({
        message: (
          <div>
            <CheckCircle />
            &nbsp;&nbsp;Image uploaded successfully!
          </div>
        ),
      });
      setLoading(false);
    } catch (err) {
      setLoading(false);
      showError({
        message: 'File is too large! Maximum size for file upload is 5 MB.',
      });
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
              {error && (
                <div className='alert alert-danger' role='alert'>
                  <div>
                    <h4 className='text-center text-alert mb-0'>
                      File is too large! The maximum size for file upload is 5
                      MB.
                    </h4>
                  </div>
                </div>
              )}
              {success && (
                <div className='alert alert-success' role='alert'>
                  <div>
                    <h4 className='text-center text-alert mb-0'>
                      Upload Success!
                    </h4>
                  </div>
                </div>
              )}
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
                <h4 className='text-left total'>
                  {orderCount.totalReturns || 0}
                </h4>
                <h5 className='total-label'>Total Returns</h5>
              </div>
            </div>
            <div className='m-col-auto'>
              <div>
                <h4 className='text-left total'>
                  {orderCount.totalDonations || 0}
                </h4>
                <h5 className='total-label'>Total Donations</h5>
              </div>
            </div>
          </div>
          <div className='row align-items-center justify-content-between m-info-row mt-4'>
            <div className='col-sm-6 p-0'>
              <div>
                <h4 className='text-left total'>
                  <img src={DiamondLogo} className='image-fluid' />
                </h4>
                <h5 className='total-label text-left'>My Plan</h5>
              </div>
            </div>
            <div className='col-sm-6 p-0'>
              <div>
                <h4 className='text-left total'>
                  {orderCount.totalDonations || 0}
                </h4>
                <h5 className='total-label text-left'>Pick ups left</h5>
              </div>
            </div>
          </div>
        </div>
        <div className='mt-4 button-container d-flex justify-content-center'>
          <button
            className='btn btn-lg btn-account'
            onClick={
              pathname === '/profile' ? redirectToSettings : redirectToProfile
            }
          >
            <span style={{ color: '#570097' }} className='btn-text'>
              {pathname === '/profile' ? 'Account Settings' : 'Profile'}
            </span>
          </button>
        </div>
      </Card>
    </div>
  );
}
