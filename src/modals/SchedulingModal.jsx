import React, { useEffect, useState } from 'react';
import { Modal, Button, Spinner, Col, Row } from 'react-bootstrap';
import moment from 'moment';
import { generateSchedules } from '../utils/schedule';
import { getPickupSlots } from '../api/orderApi';
import { getUserId } from '../api/auth';
import { isEmpty } from 'lodash-es';
import {
    ORDER_PICKUP_SLOT,
    ORDER_PICKUP_TIME,
    PICKUP_SLOT_LABELS,
    SLOTS_BOX_AM,
    SLOTS_BOX_PM,
} from '../constants/addPickupSlot';

export default function SchedulingModal({
    pickUpDateFormValues,
    onConfirm,
    ...props
}) {
    const [loading, setLoading] = useState(false);
    const [slots, setSlots] = useState({
        AM: { A: 0, B: 0, C: 0 },
        PM: { A: 0, B: 0, C: 0 },
    });
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
        let shouldFetchSlots = false;
        if (!isEmpty(pickupDate)) {
            shouldFetchSlots =
                moment(pickupDate).isAfter(moment().format('MM/DD/YYYY')) ||
                pickupDate === moment().format('MM/DD/YYYY');
        }
        if (shouldFetchSlots) {
            try {
                setLoading(true);
                const pickupSlots = await getPickupSlots(
                    await getUserId(),
                    pickupDate
                );
                setSlots(pickupSlots);
                if (pickupDate === pickUpDateFormValues.date) {
                    setPickupTime(pickUpDateFormValues.time);
                }

                setLoading(false);
            } catch (err) {
                // if (!axios.isCancel(err)) {
                //     setLoading(false);
                //     showError({
                //         title: 'Error',
                //         message: 'No pickup slots available at this time',
                //     });
                // }
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
        return (
            loading && <Spinner className='spinner mt-6' animation='border' />
        );
    };

    const renderMorningTimeSlot = () => {
        const buttonClassname = 'btn timeSlotContainer ';
        const rangeTextClassname = 'row sofia-pro timeSlotText ';
        const slotsAvailableClassname = 'row availableTimeSlot sofia-pro ';

        return (
            <Row
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                }}
            >
                {['A', 'B', 'C'].map((val, index) => {
                    return (
                        <Col
                            key={index}
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                            }}
                        >
                            <Button
                                disabled={slots.AM[val] === 0}
                                className={
                                    pickupTime === ORDER_PICKUP_TIME.AM &&
                                    pickupSlot === ORDER_PICKUP_SLOT[val]
                                        ? buttonClassname.concat('isSelected')
                                        : buttonClassname
                                }
                                onClick={() => {
                                    setFieldValue('time', ORDER_PICKUP_TIME.AM);
                                    setFieldValue(
                                        'timeLabel',
                                        PICKUP_SLOT_LABELS.AM[val]
                                    );
                                    setFieldValue(
                                        'slot',
                                        ORDER_PICKUP_SLOT[val]
                                    );
                                }}
                                style={{
                                    cursor:
                                        slots.AM[val] === 0
                                            ? 'not-allowed'
                                            : 'pointer',
                                    backgroundColor:
                                        slots.AM[val] === 0
                                            ? '#ffcccb'
                                            : '#ffffff',
                                }}
                            >
                                <Row
                                    className={
                                        pickupTime === ORDER_PICKUP_TIME.AM &&
                                        pickupSlot === ORDER_PICKUP_SLOT[val]
                                            ? rangeTextClassname.concat(
                                                  'selected'
                                              )
                                            : rangeTextClassname
                                    }
                                >
                                    {SLOTS_BOX_AM[index]}
                                </Row>
                                <Row
                                    className={
                                        pickupTime === ORDER_PICKUP_TIME.AM &&
                                        pickupSlot === ORDER_PICKUP_SLOT[val]
                                            ? slotsAvailableClassname.concat(
                                                  'selected'
                                              )
                                            : slotsAvailableClassname
                                    }
                                >
                                    Slots available: {slots.AM[val]}
                                </Row>
                            </Button>
                        </Col>
                    );
                })}
            </Row>
        );
    };

    const renderEveningTimeSlot = () => {
        const buttonClassname = 'btn timeSlotContainer ';
        const rangeTextClassname = 'row sofia-pro timeSlotText ';
        const slotsAvailableClassname = 'row availableTimeSlot sofia-pro ';

        return (
            <Row
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                }}
            >
                {['A', 'B', 'C'].map((val, index) => {
                    return (
                        <Col
                            key={index}
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                            }}
                        >
                            <Button
                                disabled={slots.PM[val] === 0}
                                className={
                                    pickupTime === ORDER_PICKUP_TIME.PM &&
                                    pickupSlot === ORDER_PICKUP_SLOT[val]
                                        ? buttonClassname.concat('isSelected')
                                        : buttonClassname
                                }
                                onClick={() => {
                                    setFieldValue('time', ORDER_PICKUP_TIME.PM);
                                    setFieldValue(
                                        'timeLabel',
                                        PICKUP_SLOT_LABELS.PM[val]
                                    );
                                    setFieldValue(
                                        'slot',
                                        ORDER_PICKUP_SLOT[val]
                                    );
                                }}
                                style={{
                                    cursor:
                                        slots.PM[val] === 0
                                            ? 'not-allowed'
                                            : 'pointer',
                                    backgroundColor:
                                        slots.PM[val] === 0
                                            ? '#ffcccb'
                                            : '#ffffff',
                                }}
                            >
                                <Row
                                    className={
                                        pickupTime === ORDER_PICKUP_TIME.PM &&
                                        pickupSlot === ORDER_PICKUP_SLOT[val]
                                            ? rangeTextClassname.concat(
                                                  'selected'
                                              )
                                            : rangeTextClassname
                                    }
                                >
                                    {SLOTS_BOX_PM[index]}
                                </Row>
                                <Row
                                    className={
                                        pickupTime === ORDER_PICKUP_TIME.PM &&
                                        pickupSlot === ORDER_PICKUP_SLOT[val]
                                            ? slotsAvailableClassname.concat(
                                                  'selected'
                                              )
                                            : slotsAvailableClassname
                                    }
                                >
                                    Slots available: {slots.PM[val]}
                                </Row>
                            </Button>
                        </Col>
                    );
                })}
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
                day instanceof moment &&
                day.format('MM/DD/YYYY') === pickupDate;

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

    const showBoxes =
        moment(pickupDate).isAfter(moment().format('MM/DD/YYYY')) ||
        pickupDate === moment().format('MM/DD/YYYY') ||
        false;

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
                <div className='row days-container'>
                    {renderAvailableDays()}
                </div>
                <div
                    className='time-slot-container'
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                >
                    {pickupDate && showBoxes && !loading && renderNewTimeSlot()}
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
                                setFieldValue(
                                    'date',
                                    pickUpDateFormValues.date
                                );
                                setFieldValue(
                                    'time',
                                    pickUpDateFormValues.time
                                );
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
                                onConfirm(
                                    pickupDate,
                                    pickupTime,
                                    pickupSlot,
                                    pickupTimeLabel
                                );
                            }}
                        >
                            <span className='confirmPickUpText'>
                                Confirm Schedule
                            </span>
                        </Button>
                    </>
                )}
            </Modal.Footer>
        </Modal>
    );
}
