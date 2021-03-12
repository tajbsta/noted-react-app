import React from "react";
import { Modal, Button } from "react-bootstrap";

export default function ReturnPolicyModal(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
      keyboard={false}
      modalOptions={{ dismissible: false }}
      id="ReturnPolicyModal"
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          Return Policy
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="sofia-pro">
        <h4 className="sofia-pro brand">Nordstrom</h4>
        <h4 className="sofia-pro text-score">Excellent Returns</h4>
        <p className="sofia-pro info">
          Nordstrom returns are free, all the time. Due to increase volume and
          the impact of COVID-19, returns processing by mail is delayed. For
          faster returns, visit a Nordstrom store near you. For employee safety,
          we hold items for 24 hours before processing any return, and refunds
          should be expected 5-7 business days after the returns processing is
          complete.
        </p>
        <a className="sofia-pro view-link">View website</a>
      </Modal.Body>
      <Modal.Footer>
        <Button className="btn-ok" onClick={props.onHide}>
          OK, Got it
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
