import React, { useState } from "react";
import { isEmpty } from "lodash";

function DashboardPage() {
  // eslint-disable-next-line no-unused-vars
  const [scans, setscans] = useState([]);

  const renderEmptyScans = () => (
    <>
      <p
        className="text-center"
        style={{
          color: "#690098",
        }}
      >
        No Scan Yet
      </p>
      <p className="small text-muted mb-1 text-center">
        Launchday is a SaaS website builder with a focus on quality, easy to
        build product sites.
      </p>
      <div
        className="mt-4"
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <button
          className="btn btn-md btn-success mb-3 display-3"
          style={{ letterSpacing: 1 }}
        >
          <span>Launch Scan</span>
        </button>
      </div>
    </>
  );

  return (
    <div>
      <div className="container mt-6">
        <div
          className="row"
          style={{
            minWidth: "85%",
          }}
        >
          <div className="col-sm-9">
            <h3>Your online purchases - Last 90 Days</h3>
            <div className="card shadow-sm">
              <div className="card-body">
                {isEmpty(scans) ? renderEmptyScans() : <></>}
              </div>
            </div>
          </div>
          <div className="col-sm-3">
            <div className="card shadow-sm">
              <div className="p-0 ml-1 d-inline-flex align-center">
                <h5
                  className="card-title mb-0 p-3"
                  style={{
                    alignSelf: "center",
                  }}
                >
                  No Articles
                </h5>
              </div>
              <hr
                className="mt-0"
                style={{
                  alignSelf: "center",
                  width: "90%",
                }}
              />
              <div
                className="card-body"
                style={{
                  padding: "10%",
                }}
              >
                <div className="container">
                  <div className="row">
                    <div className="col-sm-7">
                      <div className="row card-text h3 mb-0">$0</div>
                      <div className="row card-text">Total Returns</div>
                    </div>
                  </div>
                  <div className="row mt-4">
                    <div className="col-sm-5">
                      <div className="row card-text h3 mb-0">$0</div>
                      <div className="row card-text small">In Cash Back</div>
                    </div>
                    <div className="col-sm-7">
                      <div className="row card-text h3 mb-0">$0</div>
                      <div className="row card-text small">
                        In Store Credits
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
