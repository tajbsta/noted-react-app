import React, { useState } from "react";
import ProductCard from "../components/Dashboard/ProductCard";
import RightCard from "../components/Dashboard/RightCard";
import PickUpDetails from "../components/ViewScan/PickUpDetails";
import ProductsToReturn from "../components/ViewScan/ProductsToReturn";
import { lastCallMockdata, returnableMockData } from "../_mock";

function ViewScanPage() {
  const [scannedItems] = useState([...lastCallMockdata, ...returnableMockData]);

  return (
    <div>
      <div className="container mt-6">
        <div
          className="row"
          style={{
            minWidth: "89vw",
          }}
        >
          <div className="col-sm-8">
            {/*CONTAINS ALL SCANS LEFT CARD OF DASHBOARD PAGE*/}
            <h3 className="sofia-pro">Pick-up confirmed</h3>
            <PickUpDetails />
            <h3 className="sofia-pro">Your products to return</h3>
            {lastCallMockdata.map((item) => (
              <ProductCard
                scannedItem={item}
                key={item.id}
                selectable={false}
              />
            ))}
            <h3 className="sofia-pro">Don&apos;t miss out on other returns</h3>
            <div className="row align-items-center p-4">
              <input type="checkbox" />
              <h4 className="sofia-pro noted-purple ml-4 mb-0 p-0">Add all</h4>
            </div>
            {lastCallMockdata.map((item) => (
              <ProductCard scannedItem={item} key={item.id} />
            ))}
          </div>
          <div className="col-sm-3">
            <div
              className="col right-card"
              style={{
                maxWidth: "248px",
                marginTop: "5vh",
              }}
            >
              <div
                className="card shadow-sm p-3"
                style={{
                  width: 248,
                }}
              >
                <h3 className="sofia-pro products-to-return mb-1">
                  1 product to return
                </h3>
                <h3 className="box-size-description">
                  All products need to fit in a 12”W x 12”H x 20”L box
                </h3>
                <h3 className="noted-purple sofia-pro more-pick-up-info mb-0">
                  More info
                </h3>
                <hr />
                <h3 className="sofia-pro pick-up-price mb-0">$58.29</h3>
                <h3 className="return-type sofia-pro">In cash back</h3>
                <p className="pick-up-reminder sofia-pro">
                  Once the pick-up has been confirmed we’ll take care of
                  contacting your merchants. They will then be in charge of the
                  payment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewScanPage;
