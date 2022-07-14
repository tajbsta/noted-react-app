import React, { useState, useEffect } from 'react';
import Vendors from './components/Vendors';
import AddVendorModal from '../../modals/AddVendorModal';
import { getVendors } from '../../api/productsApi';
import { useHistory } from 'react-router-dom';

export const VendorsPage = () => {
  const [vendors, setVendors] = useState([]);
  const [showPickupsLeftModal, setShowPickupsLeftModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const history = useHistory();

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
          onCancel={() => history.push('/dashboard')}
        />
      </div>

      <AddVendorModal show={showPickupsLeftModal} onHide={() => onHide()} />
    </div>
  );
};
