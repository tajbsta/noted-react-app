import React, { lazy, useState } from "react";
import { isEmpty } from "lodash";
import PickUpButton from "../components/Dashboard/PickUpButton";
import Row from "../components/Row";

const HorizontalLine = lazy(() => import("../components/HorizontalLine"));

function DashboardPage() {
  // eslint-disable-next-line no-unused-vars
  const [scans, setscans] = useState([]);

  const renderEmptyScans = () => (
    <>
      <p className="text-center sofia-pro noted-purple">No Scan Yet</p>
      <p className="small text-muted mb-1 text-center sofia-pro">
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
        <button className="btn shadow-sm launch-scan-btn p-0 sofia-pro">
          <span className="mt-2">Launch Scan</span>
        </button>
      </div>
    </>
  );

  const renderRightCard = () => (
    <div
      className="col right-card"
      style={{
        maxWidth: "248px",
      }}
    >
      <div className="card shadow-sm">
        <div className="p-0 ml-1 d-inline-flex align-center">
          <h5 className="card-title mb-0 p-3 sofia-pro card-title">
            No Articles
          </h5>
        </div>
        <HorizontalLine width="90%" />
        <div className="card-body p-0">
          <div className="container">
            <Row marginTop={3}>
              <div className="col-7">
                <div className="row card-text mb-0 sofia-pro card-value">0</div>
                <div className="row card-text card-label">Total Returns</div>
              </div>
            </Row>
            <Row marginTop={3} className="p-0">
              <div className="col-5">
                <div className="row card-text mb-0 sofia-pro card-value">
                  $0
                </div>
                <div className="row small sofia-pro card-label">
                  In Cash Back
                </div>
              </div>
              <div className="col-6 ml-3">
                <div className="row mb-0 sofia-pro card-value">$0</div>
                <div className="row card-text small sofia-pro card-label">
                  In Store Credits
                </div>
              </div>
            </Row>
            <hr />
            <Row marginTop={3} className="p-0">
              <div className="col-12 p-0">
                <div className="col-sm-8">
                  <div className="row mb-0 sofia-pro card-value">$0</div>
                  <div className="row card-text small sofia-pro card-label">
                    Total Donations
                  </div>
                </div>
              </div>
            </Row>
            <div
              className="pr-3 pl-3 mt-3"
              style={{
                opacity: isEmpty(scans) ? 0.37 : 1,
              }}
            >
              <PickUpButton
                leadingText="Pickup now"
                timeWindow="now"
                price="24.99"
                backgroundColor="#570097"
                textColor="white"
                opacity="0.8"
                onClick={() => {}}
              />
              <PickUpButton
                leadingText="Pickup later"
                price="24.99"
                backgroundColor="#faf5fc"
                textColor="#570097"
                opacity="0.8"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLeftCard = () => (
    <div className="col-sm-9">
      <h3>Your online purchases - Last 90 Days</h3>
      <div className="card shadow-sm">
        <div className="card-body p-4">
          {isEmpty(scans) ? renderEmptyScans() : <></>}
        </div>
      </div>
    </div>
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
          {renderLeftCard()}
          {renderRightCard()}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
