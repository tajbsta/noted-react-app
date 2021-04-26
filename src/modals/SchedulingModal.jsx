import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import DatePicker from '../components/DatePicker';
import moment from 'moment';
import DownArrow from '../assets/icons/DownArrow.svg';

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
  const [isMobile, setIsMobile] = useState(false);
  const { form, onConfirm } = props;

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 991);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

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

  const renderSelectTimeSlot = () => {
    return (
      <div className='col left-column'>
        Select a time slot for
        <div className='selectedDateContainer'>
          {moment(pickUpDateValues.date).format('MMMM DD, YYYY')}
        </div>
        <div className='timeSlotsContainer'>
          <div className='morningSlotsContainer'>
            {morningTimeSlots.map((timeSlot) => {
              const isSelected =
                pickUpDateValues.time === timeSlot.text ? `isSelected` : '';
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
                fontSize: 13,
                opacity: 0.6,
              }}
            >
              Available Time Slots: 3
            </span>
          </div>
          <div className='eveningSlotsContainer'>
            {eveningTimeSlots.map((timeSlot) => {
              const isSelected =
                pickUpDateValues.time === timeSlot.text ? `isSelected` : '';
              const isDisabled = timeSlot.disabled ? 'isDisabled' : '';
              const isDisabledText = timeSlot.disabled
                ? 'isDisabledText'
                : 'timeSlotText';
              return (
                <div
                  className={`btn timeSlotContainer ${isDisabled} ${isSelected}`}
                  key={timeSlot.startTime}
                  onClick={() =>
                    onTimeSlotSelect('time', timeSlot.text, timeSlot.disabled)
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
    );
  };

  const renderSelectTimeSlotMobile = () => {
    return (
      <div
        className='col left-column m-0 pl-5 pr-5'
        style={{
          maxWidth: '100%',
        }}
      >
        <div className='row'>
          <img
            src={DownArrow}
            alt=''
            className='back-arrow-mobile'
            onClick={() => {
              setFieldValue('date', null);
            }}
          />
          <div className='selectedDateContainer ml-7'>
            {moment(pickUpDateValues.date).format('MMMM DD, YYYY')}
          </div>
        </div>
        <div className='timeSlotsContainer'>
          <div className='morningSlotsContainer'>
            {morningTimeSlots.map((timeSlot) => {
              const isSelected =
                pickUpDateValues.time === timeSlot.text ? `isSelected` : '';
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
                fontSize: 13,
                opacity: 0.6,
              }}
            >
              Available Time Slots: 3
            </span>
          </div>
          <div className='eveningSlotsContainer'>
            {eveningTimeSlots.map((timeSlot) => {
              const isSelected =
                pickUpDateValues.time === timeSlot.text ? `isSelected` : '';
              const isDisabled = timeSlot.disabled ? 'isDisabled' : '';
              const isDisabledText = timeSlot.disabled
                ? 'isDisabledText'
                : 'timeSlotText';
              return (
                <div
                  className={`btn timeSlotContainer ${isDisabled} ${isSelected}`}
                  key={timeSlot.startTime}
                  onClick={() =>
                    onTimeSlotSelect('time', timeSlot.text, timeSlot.disabled)
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
    );
  };

  return (
    <Modal
      {...props}
      size='lg'
      aria-labelledby='contained-modal-title-vcenter'
      centered
      backdrop='static'
      keyboard={false}
      animation={false}
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
          {!isMobile && (
            <div className='col d-flex justify-content-center date-column'>
              <DatePicker
                setFieldValue={setFieldValue}
                date={pickUpDateValues.date}
              />
            </div>
          )}
          {isMobile && pickUpDateValues.date === null && (
            <div className='col d-flex justify-content-center date-column'>
              <DatePicker
                setFieldValue={setFieldValue}
                date={pickUpDateValues.date}
              />
            </div>
          )}
          {pickUpDateValues.date !== null &&
            !isMobile &&
            renderSelectTimeSlot()}
          {pickUpDateValues.date !== null &&
            isMobile &&
            renderSelectTimeSlotMobile()}
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
