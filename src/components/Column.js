import React from "react";

function Column(
  marginTop = 0,
  marginBottom = 0,
  marginLeft = 0,
  marginRight = 0,
  size = 1,
  className = "",
  children = <></>
) {
  const classList = `col-${size} ${className} mt-${marginTop} mb-${marginBottom} ml-${marginLeft} mr-${marginRight}`;
  return <div className={classList}>{children}</div>;
}

export default Column;
