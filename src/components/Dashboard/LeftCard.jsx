import { isEmpty } from "lodash";
import React, { useState } from "react";
import EmptyScan from "./EmptyScan";
import Scanning from "./Scanning";

function LeftCard({ scans }) {
  // eslint-disable-next-line no-unused-vars
  const [scanning, setScanning] = useState(true);

  return (
    <div className="col-sm-9">
      <h3 className="sofia-pro">Your online purchases - Last 90 Days</h3>
      <div className="card shadow-sm">
        <div className="card-body p-4">
          <Scanning />
          {isEmpty(scans) && !scanning ? <EmptyScan /> : <></>}
        </div>
      </div>
    </div>
  );
}

export default LeftCard;
