import React, { useState } from "react";
import LeftCard from "../components/Dashboard/LeftCard";
import RightCard from "../components/Dashboard/RightCard";

const mockData = [
  {
    distributor: "Nordstom",
    productName: "Long Sleeve White Shirt",
    price: 58.29,
    compensationType: "Cash back",
  },
  {
    distributor: "Balenciaga",
    productName: "White Jumper",
    price: "240.00",
    compensationType: "Cash back",
  },
];

function DashboardPage() {
  const [scans] = useState([...mockData]);

  return (
    <div>
      <div className="container mt-6">
        <div className="row">
          {/*CONTAINS ALL SCANS LEFT CARD OF DASHBOARD PAGE*/}
          <LeftCard scans={scans} />
          {/*CONTAINS ACCOUNT AUDIT RIGHT CARD OF DASHBOARD PAGE*/}
          <RightCard scans={scans} />
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
