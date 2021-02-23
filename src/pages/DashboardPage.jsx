import React, { lazy, useState } from "react";
import { isEmpty } from "lodash";

const HorizontalLine = lazy(() => import("../components/HorizontalLine"));

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

  const renderPickUpButton = ({
    leadingText = "",
    backgroundColor: background,
    textColor: color,
    price,
    timeWindow,
    opacity,
  }) => (
    <div className="row">
      <button
        className="btn btn-md mb-3 col-sm-12 pd-3"
        style={{
          alignSelf: "center",
          letterSpacing: 1,
          background,
          color,
          opacity,
        }}
      >
        <div className="row">
          <div
            className="col-sm-8"
            style={{
              display: "flex",
              justifyItems: "center",
              alignItems: "center",
            }}
          >
            <p
              className="mt-0 mb-0 ml-3"
              style={{
                fontWeight: "500",
                fontSize: 14.5,
              }}
            >
              {leadingText || ""}
            </p>
          </div>
          <div className="col-sm-4 small">
            <p
              className="mt-0 mb-0"
              style={{
                fontSize: 11,
              }}
            >
              ${price || ""}
            </p>
            <p className="mt-0 mb-0 h5">{timeWindow || ""}</p>
          </div>
        </div>
      </button>
    </div>
  );

  const renderRightCard = () => (
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
        <HorizontalLine width="90%" />
        <div
          className="card-body"
          style={{
            paddingLeft: "10%",
            paddingRight: "10%",
            paddingBottom: "0",
          }}
        >
          <div className="container mb-4">
            <div className="row">
              <div className="col-sm-7">
                <div className="row card-text h3 mb-0">$0</div>
                <div className="row card-text">Total Returns</div>
              </div>
            </div>
            <div className="row mt-4 mb-3">
              <div className="col-sm-5">
                <div className="row card-text h3 mb-0">$0</div>
                <div className="row card-text small">In Cash Back</div>
              </div>
              <div className="col-sm-7">
                <div className="row card-text h3 mb-0">$0</div>
                <div className="row card-text small">In Store Credits</div>
              </div>
            </div>
            <HorizontalLine width="100%" />
            <div className="row mt-4">
              <div className="col-sm-12">
                <div className="row card-text h3 mb-0">$0</div>
                <div className="row card-text small">Total Donations</div>
              </div>
            </div>
          </div>
          {renderPickUpButton({
            leadingText: "Pickup now",
            timeWindow: "now",
            price: "24.99",
            backgroundColor: "#cd90d9",
            textColor: "white",
            opacity: 0.8,
          })}
          {renderPickUpButton({
            leadingText: "Pickup later",
            timeWindow: "now",
            price: "24.99",
            backgroundColor: "#faf5fc",
            textColor: "#cd90d9",
            opacity: 0.8,
          })}
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
