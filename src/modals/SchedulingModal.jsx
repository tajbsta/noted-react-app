import React, { useEffect, useState } from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap';
import moment from 'moment';
import { generateSchedules } from '../utils/schedule';
import { getPickupSlots } from '../utils/scheduleApi';
import { getUserId } from '../utils/auth';
import { isEmpty } from 'lodash-es';
import { Loader } from 'react-feather';

export default function SchedulingModal(props) {
  const [isMobile, setIsMobile] = useState(false);
  const { form, onConfirm } = props;
  const [loading, setLoading] = useState(false);
  const [slots, setSlots] = useState({ AM: 0, PM: 0 });
  const fetchPickupSlots = async () => {
    if (!isEmpty(form.values.date)) {
      try {
        setLoading(true);
        const pickupSlots = await getPickupSlots(
          await getUserId(),
          form.values.date
        );
        setSlots(pickupSlots);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        // TODO: ERROR HANDLING
        console.log(err);
      }
    }
  };

  const timeSlots = [
    {
      startTime: '0900',
      endTime: '1200',
      text: '9 A.M - 12 P.M',
      disabled: false,
      numberOfSlots: slots.AM,
    },
    {
      startTime: '1200',
      endTime: '1500',
      text: '12 P.M - 3 P.M',
      disabled: false,
      numberOfSlots: slots.PM,
    },
  ];

  useEffect(() => {
    fetchPickupSlots();
  }, [form.values.date]);

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

  const renderLoading = () => {
    return <Spinner className='spinner' animation='border' />;
  };

  const renderSelectTimeSlot = () => {
    return loading ? (
      renderLoading()
    ) : (
      <div className='col left-column mt-6'>
        <div
          className='mb-5'
          style={{
            textAlign: 'center',
          }}
        >
          Select a Time Slot
        </div>
        <div className='timeSlotsContainer'>
          <div className='col morningSlotsContainer'>
            {timeSlots.map((timeSlot) => {
              const isSelected =
                pickUpDateValues.time === timeSlot.text ? `isSelected` : '';
              const className = `btn timeSlotContainer ${isSelected}`;

              return (
                <div
                  className={className}
                  key={timeSlot.startTime}
                  onClick={() => {
                    setFieldValue('time', timeSlot.text);
                  }}
                  style={{
                    cursor:
                      timeSlot.numberOfSlots === 0 ? 'not-allowed' : 'pointer',
                  }}
                >
                  <div className='col'>
                    <div
                      className={`row sofia-pro timeSlotText ${
                        isSelected ? 'selected' : ''
                      }`}
                    >
                      {timeSlot.text}
                    </div>
                    <div
                      className={`row availableTimeSlot sofia-pro ${
                        isSelected ? 'selected' : ''
                      }`}
                      style={{
                        fontSize: 13,
                      }}
                    >
                      Slots available: {timeSlot.numberOfSlots}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const onDateSelect = (fieldName, value) => {
    setFieldValue(fieldName, value);
  };

  const renderAvailableDays = () => {
    return generateSchedules().map((day) => {
      const dayTitle =
        day.format('dddd') ===
        moment().utc().local().add('days', 1).format('dddd')
          ? 'Tomorrow'
          : day.format('dddd');

      return (
        <div
          key={day}
          className={`col ${
            pickUpDateValues.date instanceof moment &&
            pickUpDateValues.date.format('YYYY MM DD') ===
              day.format('YYYY MM DD')
              ? 'day-container-selected'
              : 'day-container '
          }`}
          onClick={() => {
            onDateSelect('date', day);
            onDateSelect('time', null);
          }}
        >
          <div className='row day'>{day && dayTitle}</div>
          <div className='row date'>
            {day !== null && day.format('MMMM DD')}
          </div>
        </div>
      );
    });
  };

  const renderEmptiness = () => {
    return (
      <div className='row mt-7'>
        <h3 className='sofia-pro'>{`${
          loading ? 'Selecting a day' : 'Select a day first'
        }`}</h3>
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
        <Modal.Title>Select a Date</Modal.Title>
      </Modal.Header>
      <Modal.Body className='sofia-pro'>
        {/**
         * @COMPONENT date picker component here
         */}
        <div className='row days-container'>{renderAvailableDays()}</div>
        <div
          className='time-slot-container'
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          {pickUpDateValues.date !== null && !loading
            ? renderSelectTimeSlot()
            : renderEmptiness()}
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
              <span className='confirmPickUpText'>Confirm Schedule</span>
            </Button>
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
}
