import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

const MonthsToScanModal = (props) => {
  const [buttonSelected, setButtonSelected] = useState(null);

  const buttonValues = [
    {
      name: '30 Days',
      value: 1,
    },
    {
      name: '60 Days',
      value: 2,
    },
    {
      name: '90 Days',
      value: 3,
    },
    {
      name: '180 Days',
      value: 6,
    },
    {
      name: '1 year',
      value: 12,
    },
  ];

  return (
    <Modal
      {...props}
      size='lg'
      aria-labelledby='contained-modal-title-vcenter'
      centered
      backdrop='static'
      keyboard={false}
      animation={false}
      id='MonthsToScanModal'
    >
      <Modal.Header closeButton onClick={props.onHide}>
        <Modal.Title>How far do you want to scan?</Modal.Title>
      </Modal.Header>
      <Modal.Body className='sofia-pro modal-body'>
        <div className='d-grid gap-2'>
          {buttonValues.map((button, index) => {
            return (
              <Button
                key={index}
                size='lg'
                className={`days-button ${
                  buttonSelected === button.value ? 'active' : ''
                }`}
                onClick={() => {
                  props.triggerScanNow(button.value);
                  setButtonSelected(button.value);
                  props.onHide();
                }}
              >
                {button.name}
              </Button>
            );
          })}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default MonthsToScanModal;
