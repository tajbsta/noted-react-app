import React, { useEffect, useState } from 'react';
import Row from '../Row';
import $ from 'jquery';
import { useHistory } from 'react-router';
import { get } from 'lodash-es';
import moment from 'moment';
import { scrollToTop } from '../../utils/window';
import { isEmpty } from 'lodash';
import { PICKUP_SLOT_LABELS } from '../../constants/addPickupSlot';

function PickUpConfirmed({ order, isUpdate = false }) {
    const history = useHistory();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const platform = window.navigator.platform;
        const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];

        if (windowsPlatforms.indexOf(platform) !== -1) {
            // Windows 10 Chrome
            $('.back-to-products-btn').css('padding-top', '9px');
        }
    }, []);

    const onEdit = () => {
        history.push(`/order/${order.id}`);
    };

    useEffect(() => {
        scrollToTop();
    }, []);

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

    const orderDate = get(order, 'pickupDate', '');
    const orderTime = get(order, 'pickupTime', '');

    const renderDate = () => {
        return (
            <Row>
                <h5 className='sofia-pro pick-up-time'></h5>
            </Row>
        );
    };

    const getDayTitle = () => {
        if (moment(orderDate).isValid()) {
            return moment(orderDate).format('dddd') ===
                moment().utc().local().add('days', 1).format('dddd')
                ? `Tomorrow, ${moment(orderDate).format('MMMM DD, YYYY')}`
                : `${moment(orderDate).format('dddd')}, ${moment(
                      orderDate
                  ).format('MMMM DD, YYYY')}`;
        }
        return '';
    };

    const renderDay = () => {
        return (
            <h4 className='p-0 m-0 pick-up-day sofia-pro'>
                {isEmpty(orderDate) || !moment(orderDate).isValid()
                    ? ''
                    : getDayTitle()}
            </h4>
        );
    };

    const timeToUse = PICKUP_SLOT_LABELS[order.pickupTime][order.pickupSlot];

    const renderTime = (label) => {
        if (label) {
            return `Between ${label
                .replace('-', 'and')
                .replace(new RegExp(/\./g), '')}`;
        }
    };

    // const renderTime = () => {
    //   const timeText =
    //     orderTime === 'AM' ? '9 A.M. - 12 P.M.' : '12 P.M. - 3 P.M.';

    //   return (
    //     <Row>
    //       <h5 className='sofia-pro pick-up-time'>
    //         Between {timeText.replace('-', 'and').replace(new RegExp(/\./g), '')}
    //       </h5>
    //     </Row>
    //   );
    // };

    return (
        <div className='card shadow-sm max-w-840 card-height'>
            <div className='card-body pt-4 pb-3 pl-4 m-0'>
                <Row>
                    <div className='col-sm-12 p-0'>
                        <p className='request-msg text-16 sofia-pro'>
                            Your pick-up request has been received and a member
                            of noted’s pick-up team will arrive at your address
                            on:
                        </p>
                    </div>
                </Row>
                {renderDate()}
                {renderDay()}
                {renderTime(timeToUse)}
                <Row>
                    <div
                        className={`col-sm-9 p-0 ${isUpdate ? 'd-flex' : ''}`}
                        style={{ alignItems: isUpdate ? 'center' : '' }}
                    >
                        <p className='sofia-pro mb-0 text-14'>
                            We have sent you a confirmation by email for order #
                            <strong>{order.id}</strong>
                        </p>
                        {!isUpdate && (
                            <p
                                className='sofia-pro text-14'
                                style={{ marginBottom: isMobile ? '32px' : '' }}
                            >
                                If you wish to cancel or modify this order:
                                <span
                                    className='ml-1 noted-purple sofia-pro pick-up-edit-or-btn text-14'
                                    onClick={onEdit}
                                >
                                    Edit order
                                </span>
                            </p>
                        )}
                    </div>
                    {!isMobile && (
                        <>
                            <div className='col-sm-3'>
                                <button
                                    className='btn btn-green back-to-products-btn'
                                    onClick={() => history.push('/dashboard')}
                                >
                                    <span className='sofia-pro mb-0 back-to-products-text'>
                                        Back to My Products
                                    </span>
                                </button>
                            </div>
                        </>
                    )}
                </Row>
                {isMobile && (
                    <>
                        <Row>
                            <button
                                className={`btn btn-green ${
                                    isUpdate ? 'mt-3' : ''
                                }`}
                                onClick={() => history.push('/dashboard')}
                            >
                                <span className='sofia-pro mb-0 back-to-products-text'>
                                    Back to My Products
                                </span>
                            </button>
                        </Row>
                    </>
                )}
            </div>
        </div>
    );
}

export default PickUpConfirmed;
