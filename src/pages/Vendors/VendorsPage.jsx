import React, { useState, useEffect } from 'react';
import Vendors from './components/Vendors';
import AddVendorModal from '../../modals/AddVendorModal';
import { getVendors } from '../../api/productsApi';

export const VendorsPage = () => {
  const [vendors, setVendors] = useState([]);
  const [showPickupsLeftModal, setShowPickupsLeftModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const onHide = () => {
    setShowPickupsLeftModal(false);
  };

  useEffect(() => {
    (async () => {
      const vendors = await getVendors();
      setVendors(vendors);
      setLoading(false);
    })();
  }, []);

  return (
    <div>
      <div id='Vendors' className='container mt-6'>
        <Vendors
          vendors={vendors}
          loading={loading}
          onAdd={() => setShowPickupsLeftModal(true)}
          // onCancel={() => setShowCancelSubscriptionModal(true)}
        />
      </div>

      <AddVendorModal show={showPickupsLeftModal} onHide={() => onHide()} />
    </div>
  );
};
