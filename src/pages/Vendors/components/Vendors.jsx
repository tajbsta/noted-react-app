import React from 'react';
import { Row, Col, Table, Button, Spinner } from 'react-bootstrap';

export default function Vendors({ loading, vendors, onAdd }) {
  const renderUserSubscription = () => {
    return vendors.length > 0 ? (
      vendors.map((item, i) => {
        return (
          <tr key={i}>
            <td>{item.name}</td>
            <td>
              <img
                src={
                  item.thumbnail
                  // require(`../../../assets/icons/${item.plan_name}Icon.svg`)
                  //   .default
                }
                style={{
                  height: 30,
                  width: 40,
                  marginRight: 10,
                }}
              />
            </td>
          </tr>
        );
      })
    ) : (
      <tr id='current_plan'>
        <td>No active subscription</td>
      </tr>
    );
  };

  return (
    <div className='mt-5' id='mycredits-container'>
      <div className='card shadow-sm mb-2 mt-4 mx-auto max-w-440'>
        <div className='card-body'>
          <Row>
            <Col>
              <h3 className='sofia-pro text-18 mb-3 mb-0'>
                Retailers listed below are processed instantly on your behalf.
              </h3>
              <h4>
                Tap the + to add orders from etailers not listed below. Selected
                retailers may require a Guided Return.
              </h4>

              <div className='col-2-table'>
                <Table responsive='sm' className='mycredits-table-1'>
                  <tbody>
                    {!loading ? (
                      renderUserSubscription()
                    ) : (
                      <div className='loading-wrapper flex justify-center items-center'>
                        <Spinner
                          as='span'
                          animation='border'
                          size='sm'
                          role='status'
                          aria-hidden='true'
                        />
                      </div>
                    )}
                  </tbody>
                </Table>
              </div>
              <div className='mt-3'>
                <Button variant='outline-primary w-100' onClick={onAdd}>
                  + Add Vendor
                </Button>
              </div>
              <div className='mt-3'>
                <Button className='border-0' variant='outline-primary w-100'>
                  Cancel
                </Button>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
}
