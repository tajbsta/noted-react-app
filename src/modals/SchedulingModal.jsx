import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import DatePicker from '../components/DatePicker';
import moment from 'moment';

const eveningTimeSlots = [
  {
    startTime: '1200',
    endTime: '1500',
    text: '12 P.M - 3 P.M',
    disabled: false,
  },
];

const morningTimeSlots = [
  {
    startTime: '0900',
    endTime: '1200',
    text: '9 A.M - 12 P.M',
    disabled: false,
  },
];

export default function SchedulingModal(props) {
  const { form, onConfirm } = props;
  const {
    errors: pickUpDateErrors,
    setFieldValue,
    values: pickUpDateValues,
  } = form;

  const onTimeSlotSelect = (fieldName, value, disabled) => {
    if (!disabled) {
      setFieldValue(fieldName, value);
    }
  };

  return (
    <Modal
      {...props}
      size='lg'
      aria-labelledby='contained-modal-title-vcenter'
      centered
      backdrop='static'
      keyboard={false}
      id='SchedulingModal'
    >
      <div className='close-container'>
        <Button
          type='button'
          className='close'
          data-dismiss='modal'
          aria-label='Close'
          onClick={props.onHide}
        >
          <span aria-hidden='true'>&times;</span>
        </Button>
      </div>
      <Modal.Header>
        <Modal.Title>Select a Date & Time Slot</Modal.Title>
      </Modal.Header>
      <Modal.Body className='sofia-pro'>
        <div className='guide-container'>
          <h4 className='sofia-pro date-guide'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Et, eu ac
            egestas placerat sit natoque.
          </h4>
        </div>
        {/**
         * @COMPONENT date picker component here
         */}

        <div className='row'>
          <div className='col d-flex justify-content-center date-column'>
            <DatePicker
              setFieldValue={setFieldValue}
              date={pickUpDateValues.date}
            />
          </div>
          {pickUpDateValues.date !== null && (
            <div className='col left-column'>
              Select a time slot for
              <div className='selectedDateContainer'>
                {moment(pickUpDateValues.date).format('MMMM DD, YYYY')}
              </div>
              <div className='timeSlotsContainer'>
                <div className='morningSlotsContainer'>
                  {morningTimeSlots.map((timeSlot) => {
                    const isSelected =
                      pickUpDateValues.time === timeSlot.text
                        ? `isSelected`
                        : '';
                    const className = `btn timeSlotContainer ${isSelected}`;
                    return (
                      <div
                        className={className}
                        key={timeSlot.startTime}
                        onClick={() => setFieldValue('time', timeSlot.text)}
                      >
                        <div
                          className={`sofia-pro timeSlotText ${
                            isSelected ? 'selected' : ''
                          }`}
                        >
                          {timeSlot.text}
                        </div>
                      </div>
                    );
                  })}
                  <span
                    className='sofia-pro availableTimeSlot'
                    style={{
                      fontSize: 11,
                      opacity: 0.6,
                    }}
                  >
                    Available Time Slots: 3
                  </span>
                </div>
                <div className='eveningSlotsContainer'>
                  {eveningTimeSlots.map((timeSlot) => {
                    const isSelected =
                      pickUpDateValues.time === timeSlot.text
                        ? `isSelected`
                        : '';
                    const isDisabled = timeSlot.disabled ? 'isDisabled' : '';
                    const isDisabledText = timeSlot.disabled
                      ? 'isDisabledText'
                      : 'timeSlotText';
                    return (
                      <div
                        className={`btn timeSlotContainer ${isDisabled} ${isSelected}`}
                        key={timeSlot.startTime}
                        onClick={() =>
                          onTimeSlotSelect(
                            'time',
                            timeSlot.text,
                            timeSlot.disabled
                          )
                        }
                      >
                        <div
                          className={`sofia-pro timeSlotText ${
                            isSelected ? 'selected' : ''
                          }`}
                        >
                          {timeSlot.text}
                        </div>
                      </div>
                    );
                  })}
                  <span className='sofia-pro availableTimeSlot'>
                    Available Time Slots: 3
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        {pickUpDateValues.date !== null && pickUpDateValues.time !== null && (
          <>
            <Button
              className='btn cancelPickUpButton'
              onClick={() => {
                props.onHide();
                setFieldValue('date', null);
                setFieldValue('time', null);
              }}
            >
              <span className='cancelPickUpText'>Cancel</span>
            </Button>
            <Button
              className='btn-ok'
              onClick={() => {
                props.onHide();
                onConfirm();
              }}
            >
              <span className='confirmPickUpText'>Confirm</span>
            </Button>
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
}
