import React, { useState } from 'react';
import LeftCard from '../components/Dashboard/LeftCard';
import RightCard from '../components/Dashboard/RightCard';
import { EXCELLENT, FAIR, GREAT } from '../constants/returns/scores';

const mockData = [
  {
    distributor: 'Nordstom',
    productName: 'Long Sleeve White Shirt',
    price: 58.29,
    compensationType: 'Cash back',
    returnScore: EXCELLENT,
  },
  {
    distributor: 'Balenciaga',
    productName: 'White Jumper',
    price: 240.0,
    compensationType: 'Store Credits',
    returnScore: GREAT,
  },
  {
    distributor: 'Nike',
    productName: 'Metcon 6',
    price: 130.0,
    compensationType: 'Cash back',
    returnScore: FAIR,
  },
];

function DashboardPage() {
  const [scannedItems] = useState([...mockData]);

  return (
    <div>
      <div className='container mt-6'>
        <div className='row'>
          {/*CONTAINS ALL SCANS LEFT CARD OF DASHBOARD PAGE*/}
          <LeftCard scannedItems={scannedItems} />
          {/*CONTAINS ACCOUNT AUDIT RIGHT CARD OF DASHBOARD PAGE*/}
          <RightCard scannedItems={scannedItems} />
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
