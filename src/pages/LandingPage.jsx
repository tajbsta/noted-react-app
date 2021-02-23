import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import AppLayout from '../layouts/AppLayout';

const LandingPage = () => {
  return (
    <AppLayout>
      <div className="main-content pb-6">
        <Container>
          <Row className="justify-content-center">
            <Col xs={12} lg={10} xl={8}>
              <div className="header mt-md-5">
                <div className="header-body">
                  <h1 className="header-title display-4">Welcome to Noted</h1>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </AppLayout>
  );
};

export default LandingPage;
