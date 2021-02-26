/* eslint-disable react/prop-types */
import React from "react";

function PickUpButton({
  leadingText = "",
  backgroundColor: background,
  textColor: color,
  price,
  timeWindow,
  opacity,
  onClick,
}: any) {
  return (
    <div className="row">
      <button
        className="btn btn-md mb-3 col-sm-12 pick-up-btn"
        style={{
          alignSelf: "center",
          letterSpacing: 1,
          background,
          opacity,
        }}
        onClick={onClick}
      >
        <div className="row">
          <div
            className="col-sm-8"
            style={{
              display: "flex",
              justifyItems: "center",
              alignItems: "center",
            }}
          >
            <p
              className="mt-0 mb-0 ml-3 pick-up-btn-lead"
              style={{
                fontWeight: 500,
                fontSize: 14.5,
                color,
              }}
            >
              {leadingText || ""}
            </p>
          </div>
          <div className="col-sm-4 small">
            <p
              className="mt-0 mb-0"
              style={{
                fontSize: 11,
                color,
              }}
            >
              ${price || ""}
            </p>
            {timeWindow && (
              <p
                className="mt-0 mb-0 h5"
                style={{
                  color,
                }}
              >
                {timeWindow}
              </p>
            )}
          </div>
        </div>
      </button>
    </div>
  );
}

export default PickUpButton;
