import { isEmpty } from 'lodash';
import React from 'react';
import HorizontalLine from '../HorizontalLine';
import Row from '../Row';
import PickUpButton from './PickUpButton';

function RightCard({ scans }) {
  return (
    <div
      className='col right-card mt-4'
      style={{
        maxWidth: '248px',
      }}
    >
      <div className='card shadow-sm'>
        <div className='p-0 ml-1 d-inline-flex align-center'>
          <h5 className='card-title mb-0 p-3 sofia-pro card-title'>
            No Articles
          </h5>
        </div>
        <HorizontalLine width='90%' />
        <div className='card-body p-0'>
          <div className='container'>
            <Row marginTop={3}>
              <div className='col-7'>
                <div className='row card-text mb-0 sofia-pro card-value'>0</div>
                <div className='row card-text card-label'>Total Returns</div>
              </div>
            </Row>
            <Row marginTop={3} className='p-0'>
              <div className='col-5'>
                <div className='row card-text mb-0 sofia-pro card-value'>
                  $0
                </div>
                <div className='row small sofia-pro card-label'>
                  In Cash Back
                </div>
              </div>
              <div className='col-6 ml-3'>
                <div className='row mb-0 sofia-pro card-value'>$0</div>
                <div className='row card-text small sofia-pro card-label'>
                  In Store Credits
                </div>
              </div>
            </Row>
            <hr />
            <Row marginTop={3} className='p-0'>
              <div className='col-12 p-0'>
                <div className='col-sm-8'>
                  <div className='row mb-0 sofia-pro card-value'>$0</div>
                  <div className='row card-text small sofia-pro card-label'>
                    Total Donations
                  </div>
                </div>
              </div>
            </Row>
            <div
              className='pr-3 pl-3 mt-3'
              style={{
                opacity: isEmpty(scans) ? 0.37 : 1,
              }}
            >
              <PickUpButton
                leadingText='Pickup now'
                timeWindow='now'
                price='24.99'
                backgroundColor='#570097'
                textColor='white'
                opacity='0.8'
                onClick={() => {}}
              />
              <PickUpButton
                leadingText='Pickup later'
                price='24.99'
                backgroundColor='#faf5fc'
                textColor='#570097'
                opacity='0.8'
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RightCard;