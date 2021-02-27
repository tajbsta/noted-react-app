import { isEmpty } from "lodash";
import React, { useState } from "react";
import { useMediaQuery } from "react-responsive";
import { EXCELLENT } from "../../constants/returns/scores";
import ReturnScore from "../ReturnsScore";
import Row from "../Row";
import EmptyScan from "./EmptyScan";
import Scanning from "./Scanning";

function LeftCard({ scannedItems }) {
  const isDesktop = useMediaQuery({ minDeviceWidth: 1024 });
  console.log(isDesktop);
  const [scanning, setScanning] = useState(false);

  const onScanLaunch = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
    }, 3000);
  };

  const productDetails = ({
    scannedItem: { productName, distributor, price, compensationType },
  }) => (
    <div className="col-sm-4 p-0 mt-1">
      <Row>
        <h4 className="mb-0 sofia-pro mb-1 distributor-name">{distributor}</h4>
      </Row>
      <Row>
        <h5 className="sofia-pro mb-2 product-name">{productName}</h5>
      </Row>
      <Row>
        <h4 className="sofia-pro mb-0 product-price">
          ${price}{" "}
          <span
            className="sofia-pro product-compensation-type"
            style={{
              opacity: 0.6,
              color: "#0e0018",
            }}
          >
            {compensationType}
          </span>
        </h4>
      </Row>
    </div>
  );

  return (
    <div className="col-sm-9">
      <h3 className="sofia-pro">Your online purchases - Last 90 Days</h3>
      {isEmpty(scannedItems) ? (
        <div className="card shadow-sm">
          <div className="card-body p-4">
            {scanning && <Scanning />}
            {isEmpty(scannedItems) && !scanning ? (
              <EmptyScan onScanLaunch={onScanLaunch} />
            ) : (
              <></>
            )}
          </div>
        </div>
      ) : (
        [...scannedItems].map((scannedItem) => (
          <div
            className="card shadow-sm scanned-item-card"
            key={scannedItem.productName}
          >
            <div className="card-body pt-3 pb-3 p-0 m-0">
              <Row>
                <div className="row align-items-center p-4">
                  <input type="checkbox" value="" id="flexCheckDefault" />
                </div>
                <div
                  className="col-sm-1 ml-1 mr-3"
                  style={{
                    backgroundImage: "url('https://via.placeholder.com/150')",
                    backgroundSize: "cover",
                  }}
                />
                {productDetails({ scannedItem })}
                <div
                  className="col-sm-5"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyItems: "center",
                  }}
                >
                  <div
                    className="col-sm-12 text-right p-0 noted-red sofia-pro"
                    style={{
                      color: "#FF1C29",
                    }}
                  >
                    2 days left
                  </div>
                  <div className="col-sm-6 p-0 ml-3 ">
                    <ReturnScore score={EXCELLENT} />
                  </div>
                </div>
              </Row>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default LeftCard;
