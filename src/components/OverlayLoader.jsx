import React from "react";
import { Fragment } from "react";
import { Spinner } from "react-bootstrap";

const OverlayLoader = ({ loading = true }) => {
  return (
    <Fragment>
      {loading && (
        <div
          className="position-absolute w-100 h-100 border"
          id="overlay"
          style={{
            zIndex: 10,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(216, 216, 216, 0.5)",
          }}
        >
          <div className="d-flex justify-content-center mt-2 r-spin-container">
            <Spinner
              animation="border"
              size="md"
              style={{
                color: "#570097",
                opacity: "0.6",
              }}
              className="spinner"
            />
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default OverlayLoader;
