import React from "react";

function EmptyScan() {
  return (
    <>
      <p className="text-center sofia-pro noted-purple">No Scan Yet</p>
      <p className="small text-muted mb-1 text-center sofia-pro">
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
        <button className="btn shadow-sm launch-scan-btn p-0 sofia-pro">
          <span className="mt-2">Launch Scan</span>
        </button>
      </div>
    </>
  );
}

export default EmptyScan;
