import React, { useState, useEffect } from 'react';
import { Col, Spinner } from 'react-bootstrap';
import { useHistory } from 'react-router';
import HorizontalLine from '../../../components/HorizontalLine';
import Row from '../../../components/Row';
import PickUpButton from './PickUpButton';
import { useSelector } from 'react-redux';
import usePrevious from '../../../utils/usePrevious';
import { isEmpty, isEqual, xorWith } from 'lodash';
import axios from 'axios';

import { calculatePricing } from '../../../utils/productsApi';

function RightCard({ userId }) {
  const history = useHistory();
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(false);
  const { items } = useSelector(({ cart: { items } }) => ({
    items,
  }));

  console.log(items);

  const previousCartItems = usePrevious(items);

  const [pricing, setPricing] = useState({
    totalReturns: 0,
    potentialReturnValue: 0,
    totalDonations: 0,
    pickupPrice: 0,
  });

  // Check if device is mobile
  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 767);
    }
    handleResize(); // Run on load to set the default value
    window.addEventListener('resize', handleResize);
    // Clean up event listener
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  useEffect(() => {
    // if (!isEmpty(xorWith(items, previousCartItems, isEqual))) {
    //   calculateCurrentCartPricing(items);
    // }
    calculateCurrentCartPricing(items);
  }, [items]);

  const calculateCurrentCartPricing = async (currentItems) => {
    try {
      setLoading(true);

      const cartItems = [...currentItems];
      const productIds = cartItems.map((x) => x._id);

      const data = await calculatePricing(userId, productIds);

      setPricing({
        totalReturns: data.totalReturns,
        potentialReturnValue: data.potentialReturnValue,
        totalDonations: data.totalDonations,
        pickupPrice: data.pickupPrice,
      });
      setLoading(false);
    } catch (error) {
      if (!axios.isCancel(error)) {
        setLoading(false);
        console.log(error);
        // TODO: handle error
      }
    }
  };

  return (
    <div style={{ position: !isMobile ? 'fixed' : '' }}>
      <div
        className='col right-card mt-4'
        style={{
          minWidth: '248px',
        }}
      >
        <div
          className={`card shadow-sm ${isMobile ? 'm-card-top-shadow' : ''}`}
          style={{
            marginBottom: isMobile ? '0px' : '',
            borderRadius: isMobile ? '0px' : '',
          }}
          id={loading && !isMobile ? 'overlay' : ''}
        >
          {!isMobile && (
            <div className='p-0 ml-1 d-inline-flex align-center'>
              <h5 className='card-title mb-0 p-3 sofia-pro'>
                {isEmpty(items) && <div>Total past 90 days</div>}

                {!isEmpty(items) && (
                  <div>
                    {items.length} {items.length == 1 ? 'product' : 'products'}{' '}
                    selected
                  </div>
                )}
              </h5>
            </div>
          )}

          {!isMobile && <HorizontalLine width='90%' />}
          <div className='card-body p-0'>
            <div
              className={`container ${
                isMobile ? 'mobile-padding pb-1' : 'p-2'
              }`}
            >
              {loading && (
                <div className='d-flex justify-content-center mt-2 r-spin-container'>
                  <Spinner animation='border' size='md' className='spinner' />
                </div>
              )}

              <div className='mobile-container'>
                {!isMobile && (
                  <>
                    <Row marginTop={3} marginLeft={2}>
                      <div className='col-7 total-returns'>
                        <div className='row card-text mb-0 sofia-pro card-value'>
                          {pricing.totalReturns}
                        </div>
                        <div className='row card-text card-label'>
                          Total Returns
                        </div>
                      </div>
                    </Row>
                    <Row
                      marginTop={3}
                      marginLeft={2}
                      className='p-0 return-value-container'
                    >
                      <div className='col-5'>
                        <div className='row card-text mb-0 sofia-pro card-value'>
                          ${Number(pricing.potentialReturnValue).toFixed(2)}
                        </div>
                        <div className='row small sofia-pro card-label text-potential-value'>
                          Potential Return Value
                        </div>
                      </div>
                    </Row>

                    <hr />
                    <Row marginTop={3} marginLeft={2} className='p-0'>
                      <div className='col-12 p-0'>
                        <div className='col-sm-8'>
                          <div className='row mb-0 sofia-pro card-value'>
                            {pricing.totalDonations}
                          </div>
                          <div className='row card-text small sofia-pro card-label total-donations'>
                            Total Donations
                          </div>
                        </div>
                      </div>
                    </Row>
                  </>
                )}

                {/* START OF MOBILE VIEWS */}
                {isMobile && (
                  <>
                    <div className='p-0 ml-1 d-inline-flex align-center'>
                      <h5 className='card-title sofia-pro m-card-title'>
                        {isEmpty(items) && <div>Total past 90 days</div>}

                        {!isEmpty(items) && (
                          <div>
                            {items.length}{' '}
                            {items.length == 1 ? 'product' : 'products'}{' '}
                            selected
                          </div>
                        )}
                      </h5>
                    </div>
                    <Row className='m-right-card-row'>
                      <Col className='m-right-card-col'>
                        <Row>
                          <div className='m-right-card-val'>
                            <h4>
                              ${Number(pricing.potentialReturnValue).toFixed(2)}
                            </h4>
                          </div>
                        </Row>
                        <Row>
                          <div className='m-label'>
                            <h4>Potential Return Value</h4>
                          </div>
                        </Row>
                      </Col>
                      <Col className='m-right-card-col'>
                        <Row>
                          <div className='m-right-card-val'>
                            <h4>{pricing.totalDonations}</h4>
                          </div>
                        </Row>
                        <Row>
                          <div className='m-label'>
                            <h4>Total Donations</h4>
                          </div>
                        </Row>
                      </Col>
                    </Row>
                  </>
                )}
                {/*END OF MOBILE VIEWS */}
              </div>

              <div
                className='pr-3 pl-3 mt-3 pickup-value'
                style={{
                  opacity: !items.length ? 0.37 : 1,
                  paddingLeft: isMobile ? '16px' : '',
                  paddingRight: isMobile ? '16px' : '',
                }}
              >
                <PickUpButton
                  leadingText='Pickup later'
                  disabled={!items.length || loading}
                  price='9.99'
                  backgroundColor='#570097'
                  textColor='white'
                  onClick={() => {
                    history.push('/view-scan');
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RightCard;
