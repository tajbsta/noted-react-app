import React, { useState } from "react";
import ReturnPolicyModal from "./modals/ReturnPolicyModal";

export default function OnHoverProductCard() {
  const [modalShow, setModalShow] = useState(false);

  return (
    <div>
      <div id="OnHoverProductCard">
        <div className="container-1">
          <h4 className="date text-14 sofia-pro line-height-16">
            24, Sep 2020
          </h4>
          <div className="info-container">
            <p className="text-wrong-info sofia-pro">Wrong info?&nbsp;</p>
            <a className="btn-hover-edit sofia-pro">Edit</a>
          </div>
        </div>
        <div className="container-2 text-left">
          <p className="text-14 sofia-pro line-height-16 text-score">
            Excellent Returns
          </p>
          <button
            className="btn-policy sofia-pro btn"
            onClick={() => setModalShow(true)}
          >
            Return policy
          </button>
        </div>
      </div>

      <ReturnPolicyModal show={modalShow} onHide={() => setModalShow(false)} />
    </div>
  );
}
