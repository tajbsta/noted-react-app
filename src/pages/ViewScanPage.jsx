import React, { useEffect, useState } from "react";
import ProductCard from "../components/Dashboard/ProductCard";
import PickUpConfirmed from "../components/ViewScan/PickUpConfirmed";
import { scanned } from "../_mock";
import useQuery from "../utils/useQuery";
import PickUpDetails from "../components/ViewScan/PickUpDetails";
import { useSelector } from "react-redux";
import { get } from "lodash";

function ViewScanPage() {
  const [scanItems, setScanItems] = useState([]);
  const scanId = useQuery().get("scanId");
  const [confirmed, setconfirmed] = useState(false);

  const scans = useSelector((state) => get(state, "scans", []));

  useEffect(() => {
    const scan = scans.find((item) => scanId === item.id);
    // console.log(scan);
    setScanItems([scan]);
  }, []);

  return (
    <div id="ViewScanPage">
      <div className="container mt-6">
        <div className="row">
          <div className="col-sm-9">
            {/*CONTAINS ALL SCANS LEFT CARD OF VIEW SCAN PAGE*/}
            {confirmed ? (
              <>
                <h3 className="sofia-pro text-18 section-title">
                  Pick-up confirmed
                </h3>
                <PickUpConfirmed />
              </>
            ) : (
              <>
                <h3 className="sofia-pro text-18">Pick-up details</h3>
                <PickUpDetails />
              </>
            )}
            <h3 className="sofia-pro products-return text-18 section-title">
              Your products to return
            </h3>
            {scanItems.map((item) => (
              <ProductCard
                scannedItem={item}
                key={item.id}
                selectable={false}
                clickable={false}
              />
            ))}
            <h3 className="sofia-pro miss-out section-title">
              Don&apos;t miss out on other returns
            </h3>
            <div className="row align-items-center p-4 all-checkbox">
              <input type="checkbox" />
              <h4 className="sofia-pro noted-purple ml-4 mb-0 p-0">Add all</h4>
            </div>
            {scans.slice(0, 2).map((item) => (
              <ProductCard scannedItem={item} key={item.id} />
            ))}
          </div>
          <div className="col-sm-3">
            <div
              className="col right-card"
              style={{
                maxWidth: "248px",
              }}
            >
              <div
                className={`card shadow-sm p-3 pick-up-card ${
                  confirmed == true ? "h-292" : "h-363"
                }`}
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
                <hr className="line-break-1" />

                {confirmed && (
                  <div>
                    <h3 className="sofia-pro pick-up-price mb-0">$58.29</h3>
                    <h3 className="return-type sofia-pro">
                      Potential Return Value
                    </h3>
                    <p className="pick-up-reminder sofia-pro">
                      Once the pick-up has been confirmed we’ll take care of
                      contacting your merchants. They will then be in charge of
                      the payment.
                    </p>
                  </div>
                )}

                {!confirmed && (
                  <>
                    <h2 className="sofia-pro mb-0 donate-quantity">1</h2>
                    <h5 className="sofia-pro text-muted">Donation</h5>
                    <hr className="line-break-2" />
                    <div className="row">
                      <div className="col">
                        <h5 className="sofia-pro text-muted">
                          Return total cost
                        </h5>
                      </div>
                      <div className="col">
                        <h5 className="sofia-pro text-right">$24.99</h5>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col">
                        <h5 className="sofia-pro text-muted">Taxes</h5>
                      </div>
                      <div className="col">
                        <h5 className="sofia-pro text-right">$0</h5>
                      </div>
                    </div>
                    <hr className="line-break-3" />
                    <div className="row">
                      <div className="col">
                        <h5 className="sofia-pro text-muted">
                          Total to pay now
                        </h5>
                      </div>
                      <div className="col">
                        <h5 className="sofia-pro text-right total-now">$0</h5>
                      </div>
                    </div>
                    <div
                      className="btn btn-confirm text-16"
                      style={{
                        background: "#570097",
                        border: "none",
                      }}
                      onClick={() => setconfirmed(true)}
                    >
                      Confirm Order
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewScanPage;
