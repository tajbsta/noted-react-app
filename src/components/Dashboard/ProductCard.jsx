import React, { useState } from "react";
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
    distributor,
    productName,
    scannedItem,
    returnScore,
    price,
    compensationType,
    id,
    image,
  },
}) {
  const [scanning, setScanning] = useState(false);

  const handleSelection = (e) => {
    if (selected) {
      removeSelected(id);
      return;
    }
    addSelected(id);
  };

  const onScanLaunch = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
    }, 3000);
  };

  return (
    <div
      className={`card shadow-sm scanned-item-card mb-3 p-0 ${
        clickable && "btn"
      }`}
      key={productName}
      style={{
        border: selected ? "1px solid purple" : "none",
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
            <img src={image} alt="" />
          </div>

          <ProductDetails
            scannedItem={{
              distributor,
              productName,
              scannedItem,
              returnScore,
              price,
              compensationType,
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
