import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { AlertCircle, CheckCircle } from 'react-feather';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import { getAccounts } from '../../../utils/accountsApi';
import { Spinner } from 'react-bootstrap';
import DeleteEmailModal from '../../../modals/DeleteEmailModal';
import Collapsible from 'react-collapsible';
import { showSuccess } from '../../../library/notifications.library';

export default function EmailAddresses({ user }) {
  const [accounts, setAccounts] = useState([]);
  const [toDeleteAccount, setToDeleteAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  const [isMobile, setIsMobile] = useState(false);
  const [modalDeleteShow, setModalDeleteShow] = useState(false);
  const [success, setSuccess] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

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

  const goToAuthorize = () => {
    history.push('/request-permission');
  };

  const fetchAccounts = async () => {
    try {
      setLoading(true);

      const userAccounts = await getAccounts(user.sub);
      setAccounts(userAccounts);
      setLoading(false);
    } catch (err) {
      setLoading(false);

      // TODO: ERROR HANDLING
      console.log(err);
    }
  };

  useEffect(() => {
    if (user && user.sub) {
      fetchAccounts();
    }
  }, [user]);

  const renderValidError = () => (
    <small className='form-text p-0 m-0 noted-red'>
      Email is not valid anymore. Please{' '}
      <a
        className='noted-red'
        style={{
          fontSize: '0.8125rem',
          color: 'red',
          textDecoration: 'underline',
        }}
        href='/request-permission'
      >
        authorize noted
      </a>{' '}
      again.
    </small>
  );

  const deleteSuccess = (id) => {
    const list = accounts;

    setAccounts(list.filter((account) => account.id !== id));
    setModalDeleteShow(false);
    setToDeleteAccount(null);
    showSuccess({
      message: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <CheckCircle />
          <h4 className='ml-3 mb-0' style={{ lineHeight: '16px' }}>
            Successfully deleted email!
          </h4>
        </div>
      ),
    });
  };

  const renderMobileView = () => {
    return (
      <>
        <Collapsible
          onTriggerOpening={() => setIsOpen(true)}
          onTriggerClosing={() => setIsOpen(false)}
          trigger={
            <div className='triggerContainer'>
              <h3 className='sofia-pro text-18 mb-3-profile mb-0 ml-3 triggerText'>
                Email Addresses
              </h3>
              <span className='triggerArrow'>{isOpen ? '▲' : '▼'} </span>
            </div>
          }
        >
          {success && (
            <div className='alert alert-success' role='alert'>
              <div>
                <h4 className='text-center text-alert'>
                  <CheckCircle /> &nbsp; Successfully deleted email!
                </h4>
              </div>
            </div>
          )}
          <div className='card shadow-sm mb-2 mt-4 max-w-840'>
            <div className='card-body'>
              <Container>
                <Row>
                  <Col className={isMobile ? 'mb-4' : 'info-col'}>
                    <h4 className='section-info'>
                      Here you will find all the email addresses we use to
                      search for the products you have purchased.
                    </h4>
                  </Col>
                  <Col className='email-column'>
                    <Row>
                      <Col>
                        <Form.Group className={isMobile ? 'm-form-group' : ''}>
                          <Form.Label>
                            Account email{' '}
                            {user &&
                              !accounts.find(
                                (account) => account.email === user.email
                              ) &&
                              '(not used for scraping)'}
                          </Form.Label>
                          <div className='main-email'>
                            <h4>{user && user.email}</h4>
                          </div>
                        </Form.Group>
                      </Col>
                    </Row>
                    {loading && (
                      <>
                        <div className='spinner-container mt-3 mb-3'>
                          <Spinner
                            className='settings-spinner'
                            size='md'
                            animation='border'
                          />
                        </div>
                      </>
                    )}
                    {!loading && user && (
                      <>
                        {accounts
                          .filter((account) => account.email !== user.email)
                          .map((account, index) => (
                            <Row key={account.id}>
                              <Col>
                                <Form.Group
                                  className={isMobile ? 'm-form-group' : ''}
                                >
                                  <div className='title-group'>
                                    <Form.Label>Email #{index + 1}</Form.Label>
                                    <Button
                                      className='btn delete-email'
                                      onClick={() => {
                                        setToDeleteAccount(account);
                                        setModalDeleteShow(true);
                                      }}
                                    >
                                      Delete email
                                    </Button>
                                  </div>{' '}
                                  <div className='additional-email'>
                                    <h4>{account.email}</h4>
                                  </div>
                                  {account.valid == 0 && (
                                    <>
                                      <small className='form-text p-0 m-0 noted-red'>
                                        {account.metadata &&
                                          account.metadata.errMsg}{' '}
                                        Please{' '}
                                        <a
                                          className='noted-red'
                                          style={{
                                            fontSize: '0.8125rem',
                                            color: 'red',
                                            textDecoration: 'underline',
                                          }}
                                          href='/request-permission'
                                        >
                                          reauthorize noted
                                        </a>
                                        .
                                      </small>
                                    </>
                                  )}
                                </Form.Group>
                              </Col>
                            </Row>
                          ))}
                      </>
                    )}
                    <DeleteEmailModal
                      show={modalDeleteShow}
                      account={toDeleteAccount}
                      deletesuccess={() => {
                        deleteSuccess(toDeleteAccount.id);
                      }}
                      onHide={() => {
                        setModalDeleteShow(false);
                        setToDeleteAccount(null);
                      }}
                    />
                    <Row className={isMobile ? 'm-button-row' : 'button-row'}>
                      <Col className='btn-add-container'>
                        <Button
                          className='add-new-email'
                          onClick={goToAuthorize}
                        >
                          Add new email
                        </Button>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Container>
            </div>
          </div>
        </Collapsible>
        <hr />
      </>
    );
  };

  const renderDesktopView = () => {
    return (
      <>
        <h3 className='sofia-pro text-18 mb-3 mt-5'>Email Addresses</h3>
        {success && (
          <div className='alert alert-success' role='alert'>
            <div>
              <h4 className='text-center text-alert'>
                <CheckCircle /> &nbsp; Successfully deleted email!
              </h4>
            </div>
          </div>
        )}
        <div className='card shadow-sm mb-2 max-w-840'>
          <div className='card-body'>
            <Container>
              <Row>
                <Col className={isMobile ? 'mb-4' : 'info-col'}>
                  <h4 className='section-info'>
                    Here you will find all the email addresses we use to search
                    for the products you have purchased.
                  </h4>
                </Col>
                <Col className='email-column'>
                  <Row>
                    <Col>
                      <Form.Group className={isMobile ? 'm-form-group' : ''}>
                        <Form.Label>
                          Account email{' '}
                          {user &&
                            !accounts.find(
                              (account) => account.email === user.email
                            ) &&
                            '(not used for scraping)'}
                        </Form.Label>
                        <div className='main-email'>
                          <h4>{user && user.email}</h4>
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                  {loading && (
                    <>
                      <div className='spinner-container mt-3 mb-3'>
                        <Spinner
                          className='settings-spinner'
                          size='md'
                          animation='border'
                        />
                      </div>
                    </>
                  )}
                  {!loading && user && (
                    <>
                      {accounts
                        .filter((account) => account.email !== user.email)
                        .map((account, index) => (
                          <Row key={account.id}>
                            <Col>
                              <Form.Group
                                className={isMobile ? 'm-form-group' : ''}
                              >
                                <div className='title-group'>
                                  <Form.Label>Email #{index + 1}</Form.Label>
                                  <Button
                                    className='btn delete-email'
                                    onClick={() => {
                                      setToDeleteAccount(account);
                                      setModalDeleteShow(true);
                                    }}
                                  >
                                    Delete email
                                  </Button>
                                </div>{' '}
                                <div className='additional-email'>
                                  <h4>{account.email}</h4>
                                </div>
                                {account.valid == 0 && (
                                  <>
                                    <small className='form-text p-0 m-0 noted-red'>
                                      {account.metadata &&
                                        account.metadata.errMsg}{' '}
                                      Please{' '}
                                      <a
                                        className='noted-red'
                                        style={{
                                          fontSize: '0.8125rem',
                                          color: 'red',
                                          textDecoration: 'underline',
                                        }}
                                        href='/request-permission'
                                      >
                                        reauthorize noted
                                      </a>
                                      .
                                    </small>
                                  </>
                                )}
                              </Form.Group>
                            </Col>
                          </Row>
                        ))}
                    </>
                  )}
                  <DeleteEmailModal
                    show={modalDeleteShow}
                    account={toDeleteAccount}
                    deletesuccess={() => {
                      deleteSuccess(toDeleteAccount.id);
                    }}
                    onHide={() => {
                      setModalDeleteShow(false);
                      setToDeleteAccount(null);
                    }}
                  />
                  <Row className={isMobile ? 'm-button-row' : 'button-row'}>
                    <Col className='btn-add-container'>
                      <Button className='add-new-email' onClick={goToAuthorize}>
                        Add new email
                      </Button>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Container>
          </div>
        </div>
      </>
    );
  };

  return (
    <div id='EmailAddresses'>
      {!isMobile && renderDesktopView()}
      {isMobile && renderMobileView()}
    </div>
  );
}
