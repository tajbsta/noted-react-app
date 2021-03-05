import React from "react";
import Row from "../Row";

function ProductsToReturn() {
  return (
    <div className="card shadow-sm">
      <div className="card-body pt-4 pb-3 pl-4 m-0">
        <Row>
          <p className="pick-up-message sofia-pro">
            Your pick-up request has been received and a member of noted’s
            pick-up team will arrive at your address on:
          </p>
        </Row>
        <h4 className="p-0 m-0 pick-up-day sofia-pro">Today</h4>
        <Row>
          <h5 className="sofia-pro pick-up-time">Between 2pm and 3pm</h5>
        </Row>

        <Row>
          <div className="col-sm-9">
            <p className="pick-up-message sofia-pro mb-0">
              We have sent you a confirmation by email.
            </p>
            <p className="sofia-pro pick-up-message">
              If you wish to cancel or modify this order:
              <span className="ml-1 noted-purple sofia-pro pick-up-edit-or-btn">
                Edit order
              </span>
            </p>
          </div>
          <div className="col-sm-3">
            <button className="back-to-products-btn">
              <span className="sofia-pro mb-0 back-to-products-text ">
                Back to My Products
              </span>
            </button>
          </div>
        </Row>
      </div>
    </div>
  );
}

export default ProductsToReturn;
