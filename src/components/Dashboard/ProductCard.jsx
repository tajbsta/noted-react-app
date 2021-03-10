import React, { useState } from "react";
import { GREAT } from "../../constants/returns/scores";
import ReturnScore from "../ReturnsScore";
import Row from "../Row";
import EmptyScan from "./EmptyScan";
import ProductDetails from "./ProductDetails";

function ProductCard({
  selectable = true,
  selected,
  addSelected,
  removeSelected,
  clickable = true,
  onClick = () => {},
  scannedItem: {
    vendorTag,
    itemName,
    returnScore = GREAT,
    amount,
    compensationType,
    id,
    imageUrl,
    orderDate,
  },
  scannedItem,
}) {
  const [scanning, setScanning] = useState(false);

  const handleSelection = (e) => {
    if (selected) {
      removeSelected(id);
      return;
    }
    addSelected(id);
  };

  return (
    <div
      className={`card shadow-sm scanned-item-card mb-3 p-0 ${
        clickable && "btn"
      }`}
      key={itemName}
      style={{
        border: selected ? "1px solid rgba(87, 0, 151, 0.8)" : "none",
      }}
    >
      <div className="card-body pt-3 pb-3 p-0 m-0">
        <Row>
          {selectable && (
            <div className="row align-items-center p-4">
              <input
                type="checkbox"
                checked={selected}
                onChange={handleSelection}
                style={{
                  zIndex: 99999,
                }}
              />
            </div>
          )}
          <div
            className="col-sm-1 ml-1 mr-3"
            style={{
              display: "flex",
              alignItems: "center",
            }}
            onClick={clickable ? onClick : () => {}}
          >
            <img
              className="product-img"
              src={imageUrl}
              alt=""
              style={{
                maxWidth: 50,
                maxHeight: 50,
                objectFit: "contain",
              }}
            />
          </div>

          <ProductDetails
            scannedItem={{
              vendorTag,
              itemName,
              scannedItem,
              returnScore,
              amount,
              compensationType: "",
            }}
          />
          <div
            className="col-sm-12 return-details-container"
            style={{
              display: "flex",
              alignItems: "center",
              justifyItems: "center",
            }}
            onClick={clickable ? onClick : () => {}}
          >
            <div
              className="col-sm-6 noted-red sofia-pro return-time-left"
              style={{
                color: "#FF1C29",
              }}
            >
              2 days left
            </div>
            <div className="col-sm-3 return-score">
              <ReturnScore score={returnScore} />
            </div>
            <div className="col-sm-3 return-item-brand">
              <img
                src="https://pbs.twimg.com/profile_images/1159166317032685568/hAlvIeYD_400x400.png"
                alt=""
                className="avatar-img ml-2 rounded-circle noted-border brand-img"
                style={{
                  width: 35,
                  height: 35,
                }}
              />
            </div>
          </div>
        </Row>
      </div>
    </div>
  );
}

export default ProductCard;
