import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import AddEmailModal from '../../../modals/AddEmailModal';
import { getAccounts } from '../../../utils/accountsApi';
import { Spinner } from 'react-bootstrap';

export default function EmailAddresses({ user }) {
  const [modalShow, setModalShow] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 1200);
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

  const isDiffEmail = user && user.email !== accounts.email;

  useEffect(() => {
    if (user) {
      fetchAccounts();
    }
  }, [user]);

  return (
    <div id='EmailAddresses'>
      <h3 className='sofia-pro text-18 mb-3 mt-5'>Email Addresses</h3>
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
                      <Form.Label>Account email</Form.Label>
                      <div className='main-email'>
                        <h4>{user && user.email}</h4>
                        {isDiffEmail && (
                          <h4 style={{ display: isMobile ? 'none' : '' }}>
                            &nbsp; (not used for scraping)
                          </h4>
                        )}
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
                {!loading && (
                  <>
                    {accounts.map((account, index) => (
                      <Row key={account.id}>
                        <Col>
                          <Form.Group
                            className={isMobile ? 'm-form-group' : ''}
                          >
                            <div className='title-group'>
                              <Form.Label>Email #{index + 1}</Form.Label>
                              <Button className='btn delete-email'>
                                Delete email
                              </Button>
                            </div>
                            <div className='additional-email'>
                              <h4>{account.email}</h4>
                            </div>
                          </Form.Group>
                        </Col>
                      </Row>
                    ))}
                  </>
                )}
                <Row className={isMobile ? 'm-button-row' : 'button-row'}>
                  <Col className='btn-add-container'>
                    <Button className='add-new-email' onClick={goToAuthorize}>
                      Add new email
                    </Button>
                  </Col>
                </Row>
                <AddEmailModal
                  show={modalShow}
                  onHide={() => setModalShow(false)}
                />
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </div>
  );
}
