import React, { useState } from "react";
import Row from "../Row";

function PickUpDetails() {
  return (
    <div className="row">
      <div className="col-sm-4">
        <div className="card shadow-sm">
          <div className="card-body payment-details-card-body pt-4 pb-3 pl-4 m-0">
            <Row>
              <div className="col-sm-12 p-0">
                <p className="pick-up-message sofia-pro">Pick-up Address</p>
              </div>
            </Row>
            <h4 className="p-0 m-0 sofia-pro">Alexis Jones`</h4>
            <h4 className="p-0 m-0 sofia-pro">1 Titans Way</h4>
            <h4 className="p-0 m-0 sofia-pro">Nashville, TN 37213</h4>
            <h4 className="p-0 m-0 sofia-pro">United States</h4>
            <p className="sofia-pro mt-3">Tel: 123-4567-7890</p>
            <p className="sofia-pro noted-purple mt-3">
              Add pick-up instructions
            </p>
          </div>
        </div>
      </div>
      {/* PAYMENT DETAILS */}
      <div className="col-sm-4">
        <div className="card shadow-sm">
          <div className="card-body payment-details-card-body pt-4 pb-3 pl-4 m-0">
            <Row>
              <div className="col-sm-12 p-0">
                <p className="pick-up-message sofia-pro">Payment Method</p>
              </div>
            </Row>
            <Row>
              <div className="col-sm-12 mb-4">Ending in 9456</div>
            </Row>
            <h3 className="sofia-pro mb-0 mt-2">Card Address</h3>
            <h4 className="p-0 m-0 sofia-pro">Alexis Jones</h4>
            <h4 className="p-0 m-0 sofia-pro">1 Titans Way</h4>
            <h4 className="p-0 m-0 sofia-pro">Nashville, TN 37213</h4>
            <h4 className="p-0 m-0 sofia-pro">United States</h4>
          </div>
        </div>
      </div>
      {/* RETURN SCHEDULE */}
      <div className="col-sm-4">
        <div className="card shadow-sm">
          <div className="card-body payment-details-card-body pt-4 pb-3 pl-4 m-0">
            <Row>
              <div className="col-sm-12 p-0">
                <p className="pick-up-message sofia-pro">Pick up</p>
              </div>
            </Row>
            <h4 className="sofia-pro mb-5">Today</h4>
            <h4 className="p-0 m-0 sofia-pro">Between 2pm and 3pm</h4>
            <h4 className="p-0 m-0 sofia-pro noted-purple mt-2">Edit</h4>
            <hr />
            <h4 className="p-0 m-0 sofia-pro noted-purple mt-2">
              Schedule another date
            </h4>
            <h5 className="sofia-pro text-muted">(-$10.99)</h5>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PickUpDetails;
