import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import AuthorizeImg from "../assets/img/Authorize.svg";
import { scraperAuth } from "../utils/scrapeService";

export default function AuthorizePage() {
  const [authUrl, setAuthUrl] = useState(null);

  const getAuthUrl = async () => {
    try {
      const res = await scraperAuth();

      setAuthUrl(res.data.url);
    } catch (error) {
      console.log(error);
    }
  };

  const openAuthUrl = () => {
    window.location.href = authUrl;
  };

  useEffect(() => {
    getAuthUrl();
  }, []);
  return (
    <div id="Authorize">
      <Container className="main-body" fluid="lg">
        <Row md="2" className="text-left align-items-end">
          <Col xs="6" className="info">
            <h1 className="bold text-title">Everything is automatic</h1>
            <h4 className="text-noted">
              noted will scan your email inbox and find all of your online
              purchases and their return limits.
            </h4>
            <div className="text-subtitle">
              <h4 className="bold">In time?</h4>
              <h4>Get your cash back with one click</h4>
            </div>
            <div className="text-subtitle">
              <h4 className="bold">Too late?</h4>
              <h4>Declutter your home and donate to local charities</h4>
            </div>

            <h4 className="text-first">
              You first need to authorized noted to read your emails. Only bots
              will see the relevant emails and we will never sell or transfer
              any of your personal info to anyone.
            </h4>
            <h4 className="text-underline">
              <a href="#">Learn more about security</a>
            </h4>
            <Button
              onClick={openAuthUrl}
              className="btn btn-green btn-authorize"
            >
              Authorize noted
            </Button>
          </Col>
          <Col xs="6">
            <div className="authorize-img">
              <img src={AuthorizeImg} />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
