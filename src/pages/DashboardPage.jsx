import { get, isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import EmptyScan from "../components/Dashboard/EmptyScan";
import ReturnCategory from "../components/Dashboard/ReturnCategory";
import RightCard from "../components/Dashboard/RightCard";
import Scanning from "../components/Dashboard/Scanning";
import api from "../utils/api";

function DashboardPage() {
  const [scanning, setScanning] = useState(false);
  const [scannedItems, settScannedItems] = useState([]);

  const customerEmail = get(
    useSelector((state) => state),
    "auth.user.username",
    ""
  );

  async function loadScans() {
    settScannedItems([]);
    setScanning(true);
    api
      .get("scans/8a57189b-7814-4203-8dc0-35e6f428e046")
      .then(({ data }) => {
        settScannedItems([...data.splice(0, 5)]);
        setScanning(false);
      })
      .catch((err) => {
        setScanning(false);
      });
  }

  useEffect(() => {
    loadScans();
  }, []);

  const onScanLaunch = () => {
    loadScans();
  };

  return (
    <div>
      <div className="container mt-6">
        <div
          className="row"
          // style={{
          //   minWidth: "89vw",
          // }}
        >
          <div className="col-sm-8 mt-4">
            {isEmpty(scannedItems) && !scanning && (
              <>
                <h3 className="sofia-pro">
                  Your online purchases - Last 90 Days
                </h3>
                <div className={`card shadow-sm scanned-item-card mb-2 p-5 `}>
                  <EmptyScan onScanLaunch={onScanLaunch} />
                </div>
              </>
            )}
            {scanning && (
              <>
                <h3 className="sofia-pro">
                  Your online purchases - Last 90 Days
                </h3>
                <div className={`card shadow-sm scanned-item-card mb-2 p-5 `}>
                  <Scanning />
                </div>
              </>
            )}

            {/*CONTAINS ALL SCANS LEFT CARD OF DASHBOARD PAGE*/}
            {!isEmpty(scannedItems) && (
              <>
                <h3 className="sofia-pro mt-0 ml-3">
                  Your online purchases - Last 90 Days
                </h3>
                <div className="col-sm-12">
                  <ReturnCategory
                    scannedItems={scannedItems}
                    typeTitle="Last Call!"
                  />
                </div>
                <div className="col-sm-12 mt-4">
                  <ReturnCategory
                    scannedItems={scannedItems}
                    typeTitle="Returnable Items"
                  />
                </div>
                <div className="col-sm-12 mt-4">
                  <ReturnCategory
                    scannedItems={scannedItems}
                    typeTitle="Donate"
                  />
                </div>
                <div>
                  <div className="row justify-center">
                    <div className="col-sm-7 text-center">
                      <div className="text-muted text-center">
                        These are all the purchases we found in the past 90 days
                        from your address {customerEmail}
                      </div>
                    </div>
                  </div>
                  <div className="row justify-center mt-3">
                    <div className="col-sm-6 text-center">
                      <div className="text-muted text-center">
                        Can’t find one?
                        <span className="noted-purple">Add it manually</span>
                      </div>
                    </div>
                  </div>
                  <div className="row justify-center mt-2">
                    <div className="col-sm-6 text-center">
                      <div className="text-center noted-purple">
                        Add new email address
                      </div>
                    </div>
                  </div>
                  <div className="row justify-center mt-2 btn">
                    <div className="col-sm-6 text-center">
                      <a onClick={onScanLaunch}>
                        <div className="text-center noted-purple">
                          Scan for older items
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="col-sm-3">
            <RightCard scannedItems={scannedItems} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
