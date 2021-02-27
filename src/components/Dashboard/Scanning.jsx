import React from "react";
import ScanningIcon from "../../assets/icons/Scanning.svg";
import Row from "../Row";

function Scanning() {
  return (
    <>
      <Row marginBottom={2}>
        <div
          className="col-12"
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <img src={ScanningIcon} />
        </div>
      </Row>
      <p className="text-center sofia-pro noted-purple">Scan running...</p>
      <p className="small text-muted mb-1 text-center sofia-pro">
        Go have some coffee - we&apos;ll email ya when it&apos;s done!
      </p>
    </>
  );
}

export default Scanning;
