import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import ProductCard from "../components/Dashboard/ProductCard";
import PickUpDetails from "../components/ViewScan/PickUpDetails";
import { scanned } from "../_mock";
import useQuery from "../utils/useQuery";

function ViewScanPage() {
  const [scanItems, setScanItems] = useState([]);
  const scanId = useQuery().get("scanId");

  useEffect(() => {
    const scan = scanned.find((item) => scanId === item.id);
    setScanItems([scan]);
  }, []);

  const history = useHistory();
  return (
    <div>
      <div className="container mt-6">
        <div
          className="row"
          // style={{
          //   minWidth: '89vw',
          // }}
        >
          <div className="col-sm-9">
            {/*CONTAINS ALL SCANS LEFT CARD OF DASHBOARD PAGE*/}
            <h3 className="sofia-pro">Pick-up confirmed</h3>
            <PickUpDetails />
            <h3 className="sofia-pro">Your products to return</h3>
            {/* {scanItems.map((item) => (
              <ProductCard
                scannedItem={item}
                key={item.id}
                selectable={false}
                clickable={false}
              />
            ))} */}
            <h3 className="sofia-pro">Don&apos;t miss out on other returns</h3>
            <div className="row align-items-center p-4">
              <input type="checkbox" />
              <h4 className="sofia-pro noted-purple ml-4 mb-0 p-0">Add all</h4>
            </div>
            {scanned.slice(0, 2).map((item) => (
              <ProductCard scannedItem={item} key={item.id} />
            ))}
          </div>
          <div className="col-sm-3">
            <div
              className="col right-card"
              style={{
                minWidth: "248px",
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
