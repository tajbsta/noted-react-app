import { isEmpty } from "lodash-es";
import React, { useState } from "react";
import Collapsible from "react-collapsible";
import { useSelector } from "react-redux";
import ProductInReviewCard from "./ProductInReviewCard";

export default function ProductsInReview() {
  const { items } = useSelector(({ products }) => ({
    items: products.items,
    products,
  }));
  const [isOpen, setIsOpen] = useState(false);

  const renderEmptiness = () => {
    return (
      <>
        <h5 className="sofia pro empty-message mt-4">No products found.</h5>
      </>
    );
  };

  const renderItems = () => {
    return items.map((item) => {
      return <ProductInReviewCard key={item} item={item} />;
    });
  };

  return (
    <div id="ProductsInReview">
      <Collapsible
        open={isOpen}
        onTriggerOpening={() => setIsOpen(true)}
        onTriggerClosing={() => setIsOpen(false)}
        trigger={
          <div className="triggerContainer">
            <h3 className="sofia-pro text-18 mb-3-profile mb-0 ml-3 triggerText">
              Products Under Review
            </h3>
            <span className="triggerArrow">{isOpen ? "▲" : "▼"} </span>
          </div>
        }
      >
        {isEmpty(items) ? renderEmptiness() : renderItems()}
      </Collapsible>
    </div>
  );
}
