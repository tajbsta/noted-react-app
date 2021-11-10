import React, { useEffect, useState } from 'react';
import { Accordion, Card, Col, Row } from 'react-bootstrap';

export default function ArchivedItem() {
  const [isMobile, setIsMobile] = useState(false);
  return (
    <div className='row history-row' key=''>
      <Card className={`col mt-1 shadow-sm ${isMobile ? 'ml-0' : 'ml-4 m-3'}`}>
        <Card.Body>
          {!isMobile && (
            <div className='flex col'>
              <Col sm={6}>test</Col>
              <Col sm={6}>test</Col>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}
