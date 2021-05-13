import React, { useEffect, useState } from 'react';
import { Modal, Button, Spinner, Col, Row } from 'react-bootstrap';
import moment from 'moment';
import { generateSchedules } from '../utils/schedule';
import { getPickupSlots } from '../utils/orderApi';
import { getUserId } from '../utils/auth';
import { isEmpty } from 'lodash-es';
import { showError } from '../library/notifications.library';

export default function SchedulingModal(props) {
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
        showError('We failed to get time slots for you');
      }
    }
  };

  useEffect(() => {
    fetchPickupSlots();
  }, [form.values.date]);

  const {
    errors: pickUpDateErrors,
    setFieldValue,
    values: pickUpDateValues,
  } = form;

  const renderLoading = () => {
    return loading && <Spinner className='spinner' animation='border' />;
  };

  const renderMorningTimeSlot = () => {
    const isSelected = pickUpDateValues.time === 'AM' ? `isSelected` : '';
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
            className={buttonClassname}
            onClick={() => {
              setFieldValue('time', 'AM');
            }}
            style={{
              cursor: slots.AM === 0 ? 'not-allowed' : 'pointer',
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
    const isSelected = pickUpDateValues.time === 'PM' ? `isSelected` : '';
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
            className={buttonClassname}
            onClick={() => {
              setFieldValue('time', 'PM');
            }}
            style={{
              cursor: slots.PM === 0 ? 'not-allowed' : 'pointer',
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
        <Spinner />
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
          onClick={() => {
            setFieldValue('date', null);
            setFieldValue('time', null);
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
          {pickUpDateValues.date !== null && !loading
            ? renderNewTimeSlot()
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
