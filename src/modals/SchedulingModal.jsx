import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Modal, Button, Spinner, Col, Row } from 'react-bootstrap';
import moment from 'moment';
import { generateSchedules } from '../utils/schedule';
import { getPickupSlots } from '../api/orderApi';
import { getUserId } from '../api/auth';
import { isEmpty } from 'lodash-es';
import { showError } from '../library/notifications.library';
import { ORDER_PICKUP_SLOT, ORDER_PICKUP_TIME, PICKUP_SLOT_LABELS } from '../constants/addPickupSlot';

export default function SchedulingModal({
  pickUpDateFormValues,
  onConfirm,
  ...props
}) {
  const [loading, setLoading] = useState(false);
  const [slots, setSlots] = useState({ AM: { A: 0, B: 0, C: 0 }, PM: { A: 0, B: 0, C: 0 } });
  const [pickupDate, setPickupDate] = useState(null);
  const [pickupTime, setPickupTime] = useState(null);
  const [pickupSlot, setPickupSlot] = useState(null);
  const [pickupTimeLabel, setPickupTimeLabel] = useState(null);

  const setFieldValue = (field, value) => {
    if (field === 'date') {
      setPickupDate(value);
    }

    if (field === 'time') {
      setPickupTime(value);
    }

    if (field === 'slot') {
      setPickupSlot(value);
    }

    if (field === 'timeLabel') {
      setPickupTimeLabel(value);
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
    }
  }, [props.show]);
  const renderLoading = () => {
    return loading && <Spinner className='spinner mt-6' animation='border' />;
  };

  const renderMorningTimeSlot = () => {
    const buttonClassname = 'btn timeSlotContainer ';
    const rangeTextClassname = 'row sofia-pro timeSlotText ';
    const slotsAvailableClassname = 'row availableTimeSlot sofia-pro '

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
            disabled={slots.AM.A === 0}
            className={pickupTime === ORDER_PICKUP_TIME.AM && pickupSlot === ORDER_PICKUP_SLOT.A ? buttonClassname.concat('isSelected') : buttonClassname}
            onClick={() => {
              setFieldValue('time', ORDER_PICKUP_TIME.AM);
              setFieldValue('timeLabel', PICKUP_SLOT_LABELS.AM.A);
              setFieldValue('slot', ORDER_PICKUP_SLOT.A);
            }}
            style={{
              cursor: slots.AM.A === 0 ? 'not-allowed' : 'pointer',
              backgroundColor: slots.AM.A === 0 ? '#ffcccb' : '#ffffff',
            }}
          >
            <Row className={pickupTime === ORDER_PICKUP_TIME.AM && pickupSlot === ORDER_PICKUP_SLOT.A ? rangeTextClassname.concat('selected') : rangeTextClassname}>9 A.M. - 10 A.M.</Row>
            <Row className={pickupTime === ORDER_PICKUP_TIME.AM && pickupSlot === ORDER_PICKUP_SLOT.A ? slotsAvailableClassname.concat('selected') : slotsAvailableClassname}>
              Slots available: {slots.AM.A}
            </Row>
          </Button>

        </Col>
        <Col style={{
          display: 'flex',
          justifyContent: 'center',
        }}>
          <Button
            disabled={slots.AM.B === 0}
            className={pickupTime === ORDER_PICKUP_TIME.AM && pickupSlot === ORDER_PICKUP_SLOT.B ?  buttonClassname.concat('isSelected') : buttonClassname}
            onClick={() => {
              setFieldValue('time', ORDER_PICKUP_TIME.AM);
              setFieldValue('timeLabel', PICKUP_SLOT_LABELS.AM.B);
              setFieldValue('slot', ORDER_PICKUP_SLOT.B);
            }}
            style={{
              cursor: slots.AM.B === 0 ? 'not-allowed' : 'pointer',
              backgroundColor: slots.AM.B === 0 ? '#ffcccb' : '#ffffff',
            }}
          >
            <Row className={pickupTime === ORDER_PICKUP_TIME.AM && pickupSlot === ORDER_PICKUP_SLOT.B ? rangeTextClassname.concat('selected') : rangeTextClassname}>10 A.M. - 11 A.M.</Row>
            <Row className={pickupTime === ORDER_PICKUP_TIME.AM && pickupSlot === ORDER_PICKUP_SLOT.B ? slotsAvailableClassname.concat('selected') : slotsAvailableClassname}>Slots available: {slots.AM.B}</Row>
          </Button>
        </Col>
        <Col style={{
          display: 'flex',
          justifyContent: 'center',
        }}>
          <Button
            disabled={slots.AM.C === 0}
            className={pickupTime === ORDER_PICKUP_TIME.AM && pickupSlot === ORDER_PICKUP_SLOT.C ? buttonClassname.concat('isSelected') : buttonClassname}
            onClick={() => {
              setFieldValue('time', ORDER_PICKUP_TIME.AM);
              setFieldValue('timeLabel', PICKUP_SLOT_LABELS.AM.C);
              setFieldValue('slot', ORDER_PICKUP_SLOT.C);
            }}
            style={{
              cursor: slots.AM.C === 0 ? 'not-allowed' : 'pointer',
              backgroundColor: slots.AM.C === 0 ? '#ffcccb' : '#ffffff',
            }}
          >
            <Row className={pickupTime === ORDER_PICKUP_TIME.AM && pickupSlot === ORDER_PICKUP_SLOT.C ? rangeTextClassname.concat('selected') : rangeTextClassname}>11 A.M. - 12 P.M.</Row>
            <Row className={pickupTime === ORDER_PICKUP_TIME.AM && pickupSlot === ORDER_PICKUP_SLOT.C? slotsAvailableClassname.concat('selected') : slotsAvailableClassname}> Slots available: {slots.AM.C}</Row>
          </Button>
        </Col>
      </Row>
    );
  };

  const renderEveningTimeSlot = () => {
    const buttonClassname = 'btn timeSlotContainer ';
    const rangeTextClassname = 'row sofia-pro timeSlotText ';
    const slotsAvailableClassname = 'row availableTimeSlot sofia-pro '

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
            disabled={slots.PM.A === 0}
            className={pickupTime === ORDER_PICKUP_TIME.PM && pickupSlot === ORDER_PICKUP_SLOT.A ? buttonClassname.concat('isSelected') : buttonClassname}
            onClick={() => {
              setFieldValue('time', ORDER_PICKUP_TIME.PM);
              setFieldValue('timeLabel', PICKUP_SLOT_LABELS.PM.A);
              setFieldValue('slot', ORDER_PICKUP_SLOT.A);
            }}
            style={{
              cursor: slots.PM.A === 0 ? 'not-allowed' : 'pointer',
              backgroundColor: slots.PM.A === 0 ? '#ffcccb' : '#ffffff',
            }}
          >
            <Row className={pickupTime === ORDER_PICKUP_TIME.PM && pickupSlot === ORDER_PICKUP_SLOT.A ? rangeTextClassname.concat('selected') : rangeTextClassname}>12 P.M. - 1 P.M.</Row>
            <Row className={pickupTime === ORDER_PICKUP_TIME.PM && pickupSlot === ORDER_PICKUP_SLOT.A ? slotsAvailableClassname.concat('selected') : slotsAvailableClassname}>Slots available: {slots.PM.A}</Row>
          </Button>
        </Col>
        <Col
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Button
            disabled={slots.PM.B === 0}
            className={pickupTime === ORDER_PICKUP_TIME.PM && pickupSlot === ORDER_PICKUP_SLOT.B ? buttonClassname.concat('isSelected') : buttonClassname}
            onClick={() => {
              setFieldValue('time', ORDER_PICKUP_TIME.PM);
              setFieldValue('timeLabel', PICKUP_SLOT_LABELS.PM.B);
              setFieldValue('slot', ORDER_PICKUP_SLOT.B);

            }}
            style={{
              cursor: slots.PM.B === 0 ? 'not-allowed' : 'pointer',
              backgroundColor: slots.PM.B === 0 ? '#ffcccb' : '#ffffff',
            }}
          >
            <Row className={pickupTime === ORDER_PICKUP_TIME.PM && pickupSlot === ORDER_PICKUP_SLOT.B ? rangeTextClassname.concat('selected') : rangeTextClassname}>1 P.M. - 2 P.M.</Row>
            <Row className={pickupTime === ORDER_PICKUP_TIME.PM && pickupSlot === ORDER_PICKUP_SLOT.B ? slotsAvailableClassname.concat('selected') : slotsAvailableClassname}>Slots available: {slots.PM.B}</Row>
          </Button>
        </Col>
        <Col
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Button
            disabled={slots.PM.C === 0}
            className={pickupTime === ORDER_PICKUP_TIME.PM && pickupSlot === ORDER_PICKUP_SLOT.C ? buttonClassname.concat('isSelected') : buttonClassname}
            onClick={() => {
              setFieldValue('time', ORDER_PICKUP_TIME.PM);
              setFieldValue('timeLabel', PICKUP_SLOT_LABELS.PM.C);
              setFieldValue('slot', ORDER_PICKUP_SLOT.C);

            }}
            style={{
              cursor: slots.PM.C === 0 ? 'not-allowed' : 'pointer',
              backgroundColor: slots.PM.C === 0 ? '#ffcccb' : '#ffffff',
            }}
          >
            <Row className={pickupTime === ORDER_PICKUP_TIME.PM && pickupSlot === ORDER_PICKUP_SLOT.C ? rangeTextClassname.concat('selected') : rangeTextClassname}>2 P.M. - 3 P.M.</Row>
            <Row className={pickupTime === ORDER_PICKUP_TIME.PM && pickupSlot === ORDER_PICKUP_SLOT.C ? slotsAvailableClassname.concat('selected') : slotsAvailableClassname}>Slots available: {slots.PM.C}</Row>
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

      const dayContainerClassname = `col ${isSelected ? 'day-container-selected' : 'day-container'
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
                  onConfirm(pickupDate, pickupTime, pickupSlot, pickupTimeLabel);
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
