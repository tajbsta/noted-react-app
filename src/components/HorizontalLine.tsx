import React from "react";
import PropTypes from "prop-types";

function HorizontalLine({ width }: any) {
  return (
    <hr
      className="mt-0 mb-0"
      style={{
        alignSelf: "center",
        width,
      }}
    />
  );
}

HorizontalLine.propTypes = {
  width: PropTypes.string,
};

export default HorizontalLine;
