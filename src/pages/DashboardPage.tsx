import React, { FunctionComponent, useState } from "react";
import { RouteComponentProps } from "react-router";
import LeftCard from "../components/Dashboard/LeftCard";
import RightCard from "../components/Dashboard/RightCard";
import iReturns from "../models/iReturns";

const mockData: Array<iReturns> = [
  {
    distributor: "Nordstom",
    productName: "Long Sleeve White Shirt",
    price: 58.29,
    compensationType: "Cash back",
  },
  {
    distributor: "Balenciaga",
    productName: "White Jumper",
    price: 240,
    compensationType: "Cash back",
  },
];

const DashboardPage: FunctionComponent<RouteComponentProps> = () => {
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
};

export default DashboardPage;
