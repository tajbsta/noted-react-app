import { isEmpty } from "lodash";
import React, { useState } from "react";
import Row from "../Row";
import EmptyScan from "./EmptyScan";
import ProductCard from "./ProductCard";
import Scanning from "./Scanning";

function Returnable({ scannedItems }) {
  const [scanning, setScanning] = useState(false);
  const [selected, setSelected] = useState([]);
  const [selectedAll, setSelectedAll] = useState(
    scannedItems.length === selected.length
  );

  const addSelected = (id) => {
    if (selected.includes(id)) {
      return;
    }
    setSelected([...selected, scannedItems.find((item) => item.id === id).id]);
  };

  const removeSelected = (id) => {
    if (selected.includes(id)) {
      setSelected([...selected.filter((itemId) => itemId !== id)]);
    }
  };

  const handleSelectAll = () => {
    if (selectedAll) {
      setSelected([]);
      setSelectedAll(!selectedAll);
      return;
    }
    setSelected([...scannedItems.map(({ id }) => id)]);
    setSelectedAll(true);
  };

  const onScanLaunch = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
    }, 3000);
  };

  return (
    <div className="col-sm-12 mt-4">
      <Row className="mb-2">
        <div className="ml-3 p-0 purchase-type-checkbox-container">
          <input
            type="checkbox"
            checked={selected.length === scannedItems.length}
            onChange={handleSelectAll}
          />
        </div>
        <h4
          className="sofia-pro purchase-types purchase-type-title mb-0"
          style={{
            display: "flex",
            alignItems: "center",
            marginLeft: 16,
            textAlign: "center",
          }}
        >
          Returnable Items
        </h4>
      </Row>
      {isEmpty(scannedItems) ? (
        <div className="card shadow-sm">
          <div className="card-body p-4">
            {scanning && <Scanning />}
            {isEmpty(scannedItems) && !scanning ? (
              <EmptyScan onScanLaunch={onScanLaunch} />
            ) : (
              <></>
            )}
          </div>
        </div>
      ) : (
        [...scannedItems].map((scannedItem) => (
          <ProductCard
            addSelected={addSelected}
            removeSelected={removeSelected}
            selected={selected.includes(scannedItem.id)}
            key={scannedItem.id}
            scannedItem={scannedItem}
          />
        ))
      )}
    </div>
  );
}

export default Returnable;
