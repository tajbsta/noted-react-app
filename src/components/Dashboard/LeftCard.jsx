import { isEmpty } from "lodash";
import React from "react";
import EmptyScan from "./EmptyScan";

function LeftCard({ scans }) {
  return (
    <div className="col-sm-9">
      <h3 className="sofia-pro">Your online purchases - Last 90 Days</h3>
      <div className="card shadow-sm">
        <div className="card-body p-4">
          {isEmpty(scans) ? <EmptyScan /> : <></>}
        </div>
      </div>
    </div>
  );
}

export default LeftCard;
