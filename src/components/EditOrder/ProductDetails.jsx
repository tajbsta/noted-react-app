import React from "react";
import Row from "../Row";

function ProductDetails({
  scannedItem: { itemName, vendorTag, amount, compensationType },
}) {
  return (
    <div className="col-sm-4 p-0 mt-1 p-details">
      <Row>
        <h4 className="mb-0 sofia-pro mb-1 distributor-name">{vendorTag}</h4>
      </Row>
      <Row>
        <h5 className="sofia-pro mb-2 product-name">{itemName}</h5>
      </Row>
      <Row>
        <h4 className="sofia-pro mb-0 product-price">
          ${amount}
          <span
            className="sofia-pro product-compensation-type"
            style={{
              fontSize: 12,
              opacity: 0.6,
              color: "#0e0018",
            }}
          >
            {compensationType}
          </span>
        </h4>
      </Row>
    </div>
  );
}

export default ProductDetails;
