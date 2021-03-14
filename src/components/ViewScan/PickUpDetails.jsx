import React, { useState } from "react";
import EmptyAddress from "./EmptyAddress";
import EmptyPayment from "./EmptyPayment";

function PickUpDetails() {
  const [emptyAddress, setEmptyAddress] = useState(true);
  const [emptyPayment, setEmptyPayment] = useState(true);

  return (
    <div className="row">
      {/* ADDRESS DETAILS */}
      <div className="col-sm-4">
        <div className="card shadow-sm">
          {!emptyAddress && (
            <div className="card-body payment-details-card-body pt-4 pb-3 pl-4 m-0">
              <div className="title-container">
                <div className="p-0">
                  <p className="pick-up-message sofia-pro text-14 line-height-16">
                    Pick-up Address
                  </p>
                </div>
                <div>
                  <a className="btn-edit sofia-pro text-14 line-height-16">
                    Edit
                  </a>
                </div>
              </div>
              <div>
                <h4 className="p-0 m-0 sofia-pro postal-name">Alexis Jones</h4>
                <h4 className="p-0 m-0 sofia-pro postal-address">
                  1 Titans Way Nashville, TN 37213 United States
                </h4>
              </div>
              <p className="sofia-pro mt-3 tel">Tel: 123-4567-7890</p>
              <p className="sofia-pro noted-purple mt-3 btn-add-instructions">
                Add pick-up instructions
              </p>
            </div>
          )}

          {emptyAddress && (
            <EmptyAddress onClick={() => setEmptyAddress(false)} />
          )}
        </div>
      </div>
      {/* PAYMENT DETAILS */}
      <div className="col-sm-4">
        <div className="card shadow-sm">
          {!emptyPayment && (
            <div className="card-body payment-details-card-body pt-4 pb-3 pl-4 m-0">
              <div className="title-container">
                <div className="p-0">
                  <p className="pick-up-message sofia-pro text-14 line-height-16">
                    Payment method
                  </p>
                </div>
                <div>
                  <a className="btn-edit sofia-pro text-14 line-height-16">
                    Edit
                  </a>
                </div>
              </div>
              <div className="end">
                <div className="img-container">
                  <img
                    className="img-fluid"
                    style={{ width: "38px" }}
                    src="https://www.svgrepo.com/show/46490/credit-card.svg"
                    alt="..."
                  />
                </div>
                <div className="mb-4 text-14 text">Ending in 9456</div>
              </div>
              <h3 className="sofia-pro mb-0 mt-2 mb-2 text-14 ine-height-16 c-add">
                Card Address
              </h3>
              <div>
                <h4 className="p-0 m-0 sofia-pro postal-name">Alexis Jones</h4>
                <h4 className="p-0 m-0 sofia-pro postal-address">
                  1 Titans Way Nashville, TN 37213 United States
                </h4>
              </div>
            </div>
          )}

          {emptyPayment && (
            <EmptyPayment onClick={() => setEmptyPayment(false)} />
          )}
        </div>
      </div>
      {/* RETURN SCHEDULE */}
      <div className="col-sm-4">
        <div className="card shadow-sm">
          <div className="card-body payment-details-card-body pt-4 pb-3 pl-4 m-0">
            <div className="title-container">
              <div className="p-0">
                <p className="pick-up-message sofia-pro text-14 line-height-16">
                  Pick up
                </p>
              </div>
            </div>
            <h4 className="sofia-pro mb-4">Today</h4>
            <h4 className="p-0 m-0 sofia-pro">Between 2pm and 3pm</h4>
            <h4 className="p-0 m-0 sofia-pro mt-2 btn-edit">Edit</h4>
            <hr />
            <a className="btn-edit p-0 m-0 sofia-pro noted-purple mt-2 text-14 line-height-16">
              Schedule another date
            </a>
            <h5 className="sofia-pro text-muted text-price-sched text-14">
              (-$10.99)
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PickUpDetails;
