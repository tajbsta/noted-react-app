import React from 'react';
import { Row, Col, Table, Button } from 'react-bootstrap';
import DiamondLogo from '../../../assets/img/diamond-logo.svg';

const dummyData = [
  {
    date: '2021-07-29',
    amount: '$107.88',
    pickups: '+ 12 pick ups',
    total: '12 pick ups',
  },
  {
    date: '2021-07-29',
    amount: '$107.88',
    pickups: '+ 12 pick ups',
    total: '12 pick ups',
  },
  {
    date: '2021-07-29',
    amount: '$107.88',
    pickups: '+ 12 pick ups',
    total: '12 pick ups',
  },
  {
    date: '2021-07-29',
    amount: '$107.88',
    pickups: '+ 12 pick ups',
    total: '12 pick ups',
  },
  {
    date: '2021-07-29',
    amount: '$107.88',
    pickups: '+ 12 pick ups',
    total: '12 pick ups',
  },
  {
    date: '2021-07-29',
    amount: '$107.88',
    pickups: '+ 12 pick ups',
    total: '12 pick ups',
  },
  {
    date: '2021-07-29',
    amount: '$107.88',
    pickups: '+ 12 pick ups',
    total: '12 pick ups',
  },
  {
    date: '2021-07-29',
    amount: '$107.88',
    pickups: '+ 12 pick ups',
    total: '12 pick ups',
  },
  {
    date: '2021-07-29',
    amount: '$107.88',
    pickups: '+ 12 pick ups',
    total: '12 pick ups',
  },
  {
    date: '2021-07-29',
    amount: '$107.88',
    pickups: '+ 12 pick ups',
    total: '12 pick ups',
  },
  {
    date: '2021-07-29',
    amount: '$107.88',
    pickups: '+ 12 pick ups',
    total: '12 pick ups',
  },
  {
    date: '2021-07-29',
    amount: '$107.88',
    pickups: '+ 12 pick ups',
    total: '12 pick ups',
  },
];

export default function MyCredits(props) {
  return (
    <div className='mt-5' id='mycredits-container'>
      <h3 className='sofia-pro text-18 mb-3 mb-0 ml-3'>Email Addresses</h3>
      <div className='card shadow-sm mb-2 mt-4 max-w-840'>
        <div className='card-body'>
          <Row>
            <Col>
              <h4>
                Here you will find your credits and the history of your top-ups.
              </h4>

              <Table responsive='sm' className='mycredits-table-1'>
                <thead>
                  <tr>
                    <th>Amount</th>
                    <th>Pick ups</th>
                    <th>Expiry</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <img src={DiamondLogo} />
                    </td>
                    <td>2/12</td>
                    <td>07/29/2021</td>
                  </tr>
                  <tr>
                    <td>
                      <img src={DiamondLogo} />
                    </td>
                    <td>2/12</td>
                    <td>07/29/2021</td>
                  </tr>
                </tbody>
              </Table>
            </Col>
            <Col>
              <div className='pl-3 col-2-table'>
                <Table responsive='sm' className='mycredits-table-2'>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Pick ups</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dummyData.map((item, i) => {
                      return (
                        <tr key={`tr-${i}`}>
                          <td>{item.date}</td>
                          <td>{item.amount}</td>
                          <td>{item.pickups}</td>
                          <td>{item.total}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
              <Row className='d-flex align-items-center justify-content-end mt-3'>
                <Button className='primary'>Top up</Button>
              </Row>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
}
