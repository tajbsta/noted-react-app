import React, { useEffect, useState } from "react";
import LeftCard from "../components/Dashboard/LeftCard";
import RightCard from "../components/Dashboard/RightCard";

function DashboardPage() {
  // eslint-disable-next-line no-unused-vars
  const [scans, setscans] = useState([]);

  useEffect(() => {
    setscans([]);
  }, []);

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
