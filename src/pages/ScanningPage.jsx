import { get, isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { storeScan } from "../actions/scans.action";
import EmptyScan from "../components/Dashboard/EmptyScan";
import RightCard from "../components/Dashboard/RightCard";
import Scanning from "../components/Dashboard/Scanning";
import { scraperStart } from "../utils/scrapeService";
import Amplify, { API, graphqlOperation } from "aws-amplify";

function ScanningPage() {
  const history = useHistory();
  const dispatch = useDispatch();
  const googleAuthCode = useSelector(
    ({ auth: { googleAuthCode } }) => googleAuthCode
  );
  const [scanning, setScanning] = useState(false);

  // Returns scan ID
  async function startScan() {
    const res = await scraperStart(googleAuthCode);

    return res.data.body.id;
  }

  // const subscribeScraping = async (id) => {
  //   const onUpdateScrapeAttempt = /* GraphQL */ `
  //     subscription MySubscription {
  //       onUpdateScrapeAttempt(id: $id) {
  //         datetimestampcreated
  //         id
  //         itemcount
  //         percentage
  //         reademail
  //         totalamount
  //         totalmessagecount
  //         userid
  //         scrapestatus
  //       }
  //     }
  //   `;

  //   await API.graphql(
  //     graphqlOperation(onUpdateScrapeAttempt, { id })
  //   ).subscribe({
  //     next: ({ provider, value }) => console.log({ provider, value }),
  //     error: (error) => console.warn(error),
  //   });
  // };

  const onScanLaunch = async () => {
    try {
      setScanning(true);
      const id = await startScan();

      // await subscribeScraping(id);

      setTimeout(() => {
        history.push("/dashboard");
      }, 5000);
    } catch (error) {
      console.log(error.message);
      // TODO: Display error
      setScanning(false);
    }
  };

  useEffect(() => {
    if (!googleAuthCode) {
      history.push("/request-permission");
    }
  }, []);

  return (
    <div>
      <div className="container mt-6">
        <div className="row">
          <div className="col-sm-9 mt-4 w-840 bottom">
            {!scanning && (
              <>
                <h3 className="sofia-pro text-16">
                  Your online purchases - Last 90 Days
                </h3>
                <div className={`card shadow-sm scanned-item-card mb-2 p-5 `}>
                  <EmptyScan onScanLaunch={onScanLaunch} />
                </div>
              </>
            )}
            {scanning && (
              <>
                <h3 className="sofia-pro text-16">
                  Your online purchases - Last 90 Days
                </h3>
                <div className={`card shadow-sm scanned-item-card mb-2 p-5 `}>
                  <Scanning />
                </div>
              </>
            )}
          </div>
          <div className="col-sm-3">
            <RightCard
              totalReturns={0}
              potentialReturnValue={0}
              donations={0}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScanningPage;
