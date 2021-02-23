import React from "react";
import { Col, Container, Row } from "react-bootstrap";

const LandingPage = () => {
  return (
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
  );
};

export default LandingPage;
