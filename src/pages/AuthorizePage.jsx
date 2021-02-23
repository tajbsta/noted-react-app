import React from "react";
import AppLayout from "../layouts/AppLayout";
import { Button, Col, Container, Row } from "react-bootstrap";

export default function AuthorizePage() {
  return (
    <AppLayout>
      <div id="Authorize">
        <Container className="header-body mt-n5 mt-md-n6">
          <Row className="text-left align-items-end">
            <Col xs="6" className="info col-auto">
              <h1 className="bold">Everything is automatic</h1>
              <h4>
                Noted will scan your email inbox and find all of your online
                purchases and their return limits.
              </h4>
              <div>
                <h4>
                  <strong className="bold">In time?</strong>
                </h4>
                <h4>Get your cash back with one click</h4>
                <h4>
                  <strong className="bold">Too late?</strong>
                </h4>
                <h4>Declutter your home and donate to local charities</h4>
              </div>
              <div>
                <h4>
                  You first need to authorized Noted to read your emails. Only
                  bots will see the relevant emails and we will never sell or
                  transfer any of your personal info to anyone.
                </h4>
                <h4>
                  <a href="#" className="text-underline">Learn more about security</a>
                </h4>
              </div>
              <Button className="btn btn-authorize">Authorize Noted</Button>
            </Col>
            <Col xs="6">
              <div>
                <img />
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </AppLayout>
  );
}
