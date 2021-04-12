import React, { useState, useEffect } from 'react';
import { values, concat } from 'lodash';
import { Col } from 'react-bootstrap';
import { useHistory } from 'react-router';
import HorizontalLine from '../../../components/HorizontalLine';
import Row from '../../../components/Row';
import PickUpButton from './PickUpButton';

function RightCard({
  totalReturns,
  potentialReturnValue,
  donations,
  selectedItems,
}) {
  const history = useHistory();
  const [isMobile, setIsMobile] = useState(false);
  const [enablePickUpButton, setEnablePickUpButton] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 639);
    }
    handleResize(); // Run on load to set the default value
    window.addEventListener('resize', handleResize);
    // Clean up event listener
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  useEffect(() => {
    const items = concat(...values(selectedItems));

    console.log(items);
    setEnablePickUpButton(items.length > 0);
  }, [selectedItems]);

  return (
    <div
      className='col right-card mt-4'
      style={{
        minWidth: '248px',
      }}
    >
      <div className='card shadow-sm'>
        {!isMobile && (
          <div className='p-0 ml-1 d-inline-flex align-center'>
            <h5 className='card-title mb-0 p-3 sofia-pro card-title'>
              {totalReturns > 0 ? 'Total past 90 days' : ' No Articles'}
            </h5>
          </div>
        )}

        {!isMobile && <HorizontalLine width='90%' />}
        <div className='card-body p-0'>
          <div className='container p-2'>
            <div className='mobile-container'>
              {!isMobile && (
                <>
                  <Row marginTop={3} marginLeft={2}>
                    <div className='col-7 total-returns'>
                      <div className='row card-text mb-0 sofia-pro card-value'>
                        {totalReturns}
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
                        ${Number(potentialReturnValue).toFixed(2)}
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
                          {donations}
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
                    <h5 className='card-title mb-0 p-3 sofia-pro card-title'>
                      {totalReturns == 0 && donations == 0 && (
                        <div>Total past 90 days</div>
                      )}

                      {totalReturns > 0 && (
                        <div>
                          {totalReturns}{' '}
                          {totalReturns === 1 ? 'product' : 'products'} selected
                        </div>
                      )}
                      {donations > 0 && (
                        <div>
                          {donations} {donations === 1 ? 'product' : 'products'}{' '}
                          selected
                        </div>
                      )}
                    </h5>
                  </div>
                  <Row className='m-right-card-row'>
                    <Col className='m-right-card-col'>
                      <Row>
                        <div className='m-right-card-val'>
                          <h4>${Number(potentialReturnValue).toFixed(2)}</h4>
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
                          <h4>{donations}</h4>
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
                opacity: !enablePickUpButton ? 0.37 : 1,
              }}
            >
              <PickUpButton
                leadingText='Pickup later'
                disabled={!enablePickUpButton}
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
  );
}

export default RightCard;
