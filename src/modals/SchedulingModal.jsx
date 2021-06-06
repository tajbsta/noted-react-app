import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Modal, Button, Spinner, Col, Row } from 'react-bootstrap';
import moment from 'moment';
import { generateSchedules } from '../utils/schedule';
import { getPickupSlots } from '../api/orderApi';
import { getUserId } from '../api/auth';
import { isEmpty } from 'lodash-es';
import { showError } from '../library/notifications.library';

export default function SchedulingModal({
  pickUpDateFormValues,
  onConfirm,
  ...props
}) {
  const [loading, setLoading] = useState(false);
  const [slots, setSlots] = useState({ AM: 0, PM: 0 });
  const [pickupDate, setPickupDate] = useState(null);
  const [pickupTime, setPickupTime] = useState(null);

  const setFieldValue = (field, value) => {
    if (field === 'date') {
      setPickupDate(value);
    }

    if (field === 'time') {
      setPickupTime(value);
    }
  };

  const fetchPickupSlots = async () => {
    if (!isEmpty(pickupDate)) {
      try {
        setLoading(true);
        const pickupSlots = await getPickupSlots(await getUserId(), pickupDate);
        setSlots(pickupSlots);

        if (pickupDate === pickUpDateFormValues.date) {
          setPickupTime(pickUpDateFormValues.time);
        }

        setLoading(false);
      } catch (err) {
        if (!axios.isCancel(err)) {
          setLoading(false);
          showError('No pickup slots available at this time');
        }
      }
    }
  };

  useEffect(() => {
    fetchPickupSlots();
  }, [pickupDate]);

  useEffect(() => {
    if (props.show) {
      setPickupDate(pickUpDateFormValues.date);
      setPickupTime(pickUpDateFormValues.time);
      // console.log({
      //   pickupDate,
      //   pickupTime,
      // });
    }
  }, [props.show]);
  const renderLoading = () => {
    return loading && <Spinner className='spinner mt-6' animation='border' />;
  };

  const renderMorningTimeSlot = () => {
    const isSelected =
      pickupTime === 'AM' ||
      (!pickupTime &&
        pickUpDateFormValues.date === pickupDate &&
        pickUpDateFormValues.time === 'AM' &&
        pickupTime === 'AM')
        ? `isSelected`
        : '';
    const buttonClassname = `btn timeSlotContainer ${isSelected}`;
    const rangeTextClassname = `row sofia-pro timeSlotText ${
      isSelected ? 'selected' : ''
    }`;
    const slotsAvailableClassname = `row availableTimeSlot sofia-pro ${
      isSelected ? 'selected' : ''
    }`;
    return (
      <Row
        style={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Col
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Button
            disabled={slots.AM === 0}
            className={buttonClassname}
            onClick={() => {
              setFieldValue('time', 'AM');
            }}
            style={{
              cursor: slots.AM === 0 ? 'not-allowed' : 'pointer',
              backgroundColor: slots.AM === 0 ? '#ffcccb' : '#ffffff',
            }}
          >
            <Row className={rangeTextClassname}>9 A.M. - 12 P.M.</Row>
            <Row className={slotsAvailableClassname}>
              Slots available: {slots.AM}
            </Row>
          </Button>
        </Col>
      </Row>
    );
  };

  const renderEveningTimeSlot = () => {
    const isSelected =
      pickupTime === 'PM' ||
      (pickUpDateFormValues.date === pickupDate &&
        pickUpDateFormValues.time === 'PM' &&
        pickupTime === 'PM')
        ? `isSelected`
        : '';
    const buttonClassname = `btn timeSlotContainer ${isSelected}`;
    const rangeTextClassname = `row sofia-pro timeSlotText ${
      isSelected ? 'selected' : ''
    }`;
    const slotsAvailableClassname = `row availableTimeSlot sofia-pro ${
      isSelected ? 'selected' : ''
    }`;
    return (
      <Row
        style={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Col
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Button
            disabled={slots.PM === 0}
            className={buttonClassname}
            onClick={() => {
              setFieldValue('time', 'PM');
            }}
            style={{
              cursor: slots.PM === 0 ? 'not-allowed' : 'pointer',
              backgroundColor: slots.PM === 0 ? '#ffcccb' : '#ffffff',
            }}
          >
            <Row className={rangeTextClassname}>12 P.M. - 3 P.M.</Row>
            <Row className={slotsAvailableClassname}>
              Slots available: {slots.PM}
            </Row>
          </Button>
        </Col>
      </Row>
    );
  };

  const renderNewTimeSlot = () => {
    return (
      <div className='col left-column mt-6'>
        <Row
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          Select a Time Slot
        </Row>
        {renderMorningTimeSlot()}
        {renderEveningTimeSlot()}

        {renderLoading()}
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
      const isSelected =
        day instanceof moment && day.format('MM/DD/YYYY') === pickupDate;

      const dayContainerClassname = `col ${
        isSelected ? 'day-container-selected' : 'day-container'
      }`;

      return (
        <Button
          key={day}
          className={dayContainerClassname}
          onClick={() => {
            onDateSelect('date', day.format('MM/DD/YYYY'));
            onDateSelect('time', null);
          }}
        >
          <div className='row day'>{day && dayTitle}</div>
          <div className='row date'>
            {day !== null && day.format('MMMM DD')}
          </div>
        </Button>
      );
    });
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
          onClick={() => {
            setFieldValue('date', pickUpDateFormValues.date);
            setFieldValue('time', pickUpDateFormValues.time);
            props.onHide();
          }}
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
          {pickupDate && !loading && renderNewTimeSlot()}
          {renderLoading()}
        </div>
      </Modal.Body>
      <Modal.Footer>
        {((pickUpDateFormValues.date && pickUpDateFormValues.time) ||
          (pickupDate && pickupTime)) && (
          <>
            <Button
              className='btn cancelPickUpButton'
              onClick={() => {
                setFieldValue('date', pickUpDateFormValues.date);
                setFieldValue('time', pickUpDateFormValues.time);
                props.onHide(); // hahahaha gags, wets check ko hmm
              }}
            >
              <span className='cancelPickUpText'>Cancel</span>
            </Button>
            <Button
              className='btn-ok'
              disabled={!pickupDate || !pickupTime}
              onClick={() => {
                props.onHide();
                onConfirm(pickupDate, pickupTime);
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
