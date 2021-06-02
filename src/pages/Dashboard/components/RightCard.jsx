import React, { useState, useEffect } from 'react';
import { Col, Spinner } from 'react-bootstrap';
import { useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import axios from 'axios';
import HorizontalLine from './HorizontalLine';
import Row from '../../../components/Row';
import PickUpButton from './PickUpButton';
import { calculateMetrics } from '../../../api/productsApi';
import NotedCheckbox from '../../../components/Product/NotedCheckbox';
import { setCartItems } from '../../../actions/cart.action';
import {
  DONATE,
  LAST_CALL,
  NOT_ELIGIBLE,
  RETURNABLE,
} from '../../../constants/actions/runtime';
import ReturnValueInfoIcon from '../../../components/ReturnValueInfoIcon';

function RightCard({ userId, setSelectedProducts, beyond90days }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(false);
  const { items } = useSelector(({ cart: { items } }) => ({
    items,
  }));

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
      // if (userId) {
      setLoading(true);

      const cartItems = [...currentItems];
      const productIds = cartItems.map((x) => x._id);

      const data = await calculateMetrics(userId, productIds);

      setPricing({
        totalReturns: data.totalReturns,
        potentialReturnValue: data.potentialReturnValue,
        totalDonations: data.totalDonations,
        pickupPrice: data.pickupPrice,
      });
      setLoading(false);
      // }
    } catch (error) {
      if (!axios.isCancel(error)) {
        setLoading(false);
        /**
         * A toast error should be added here
         */
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = () => {
    setSelectedProducts({
      [LAST_CALL]: [],
      [NOT_ELIGIBLE]: [],
      [RETURNABLE]: [],
      [DONATE]: [],
    });
    dispatch(setCartItems([]));
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
                {isEmpty(items) && (
                  <div>Total past 90 days{beyond90days ? ' & beyond' : ''}</div>
                )}

                {!isEmpty(items) && (
                  <div className='row'>
                    <Col xs={1}>
                      <NotedCheckbox
                        disabled={loading}
                        checked={items.length > 0}
                        onChangeState={handleCheckboxChange}
                      />
                    </Col>
                    <Col>
                      {items.length}{' '}
                      {items.length == 1 ? 'product' : 'products'} selected
                    </Col>
                  </div>
                )}
              </h5>
            </div>
          )}

          {!isMobile && <HorizontalLine width='90%' />}
          <div className='card-body p-0'>
            <div className={`${isMobile ? 'mobile-padding pb-1' : 'p-2'}`}>
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
                        <div className='row small sofia-pro card-label text-potential-value d-flex '>
                          <span className='my-auto mr-2'>
                            Potential Return Value
                          </span>
                          <ReturnValueInfoIcon />
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
                        {isEmpty(items) && (
                          <div>
                            Total past 90 days
                            {beyond90days ? ' & beyond' : ''}
                          </div>
                        )}

                        {!isEmpty(items) && (
                          <div className='row'>
                            <Col xs={1}>
                              <NotedCheckbox
                                disabled={loading}
                                checked={items.length > 0}
                                onChangeState={handleCheckboxChange}
                              />
                            </Col>
                            <Col>
                              {items.length}{' '}
                              {items.length == 1 ? 'product' : 'products'}{' '}
                              selected
                            </Col>
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
                          <div className='m-label d-flex'>
                            <h4 className='mr-2'>Potential Return Value</h4>
                            <ReturnValueInfoIcon
                              className='info-icon'
                              isMobile={isMobile}
                            />
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
                  leadingText='Schedule Pickup'
                  disabled={!items.length || loading}
                  price={pricing.pickupPrice}
                  backgroundColor='#570097'
                  textColor='white'
                  onClick={() => {
                    history.push('/checkout');
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
