import React, { useState, useEffect } from 'react';
import { isEmpty } from 'lodash-es';
import { ProgressBar } from 'react-bootstrap';
import Collapsible from 'react-collapsible';
import { getOrder, getOrders } from '../../../api/orderApi';
import { getUserId } from '../../../api/auth';
import { ScheduledReturnItem } from './ScheduledReturnItem';
import { timeout } from '../../../utils/time';
import { showError } from '../../../library/notifications.library';
import { AlertCircle } from 'react-feather';

export default function ScheduledReturn() {
    const [isOpen, setIsOpen] = useState(false);
    const [orders, setOrders] = useState([]);
    const [fetchingOrders, setFetchingOrders] = useState(false);
    const [lastEvaluatedKey, setLastEvaluatedKey] = useState(null);
    const [loadProgress, setLoadProgress] = useState(0);

    const fetchOrdersWithAirtableId = async (nextToken = '') => {
        const userId = await getUserId();
        const res = await getOrders(
            userId,
            'active',
            nextToken,
            '5',
            'created_at'
        );
        if (res.lastEvaluatedKey) {
            setLastEvaluatedKey(res.lastEvaluatedKey);
        } else {
            setLastEvaluatedKey(null);
        }
        const data = await Promise.all(
            res.orders.map(async (activeOrder) => {
                const order = await getOrder(activeOrder.id);
                return { ...activeOrder, airtableId: order.airtableId };
            })
        );
        return data;
    };

    const getScheduledOrders = async (nextToken = '') => {
        try {
            setFetchingOrders(true);

            setLoadProgress(20);
            await timeout(200);
            setLoadProgress(35);
            await timeout(200);
            setLoadProgress(65);

            const orderResponse = await fetchOrdersWithAirtableId(nextToken);

            setOrders([...orders, ...orderResponse]);

            setLoadProgress(80);
            await timeout(200);
            setLoadProgress(100);
            await timeout(1000);
            /**
             * Give animation some time
             */
            setTimeout(() => {
                setFetchingOrders(false);
            }, 600);
        } catch (error) {
            showError({
                message: (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <AlertCircle />
                        <h4
                            className='ml-3 mb-0'
                            style={{ lineHeight: '16px' }}
                        >
                            Error getting scheduled orders!
                        </h4>
                    </div>
                ),
            });
            setFetchingOrders(false);
        }
    };

    const showMore = async () => {
        if (lastEvaluatedKey) {
            getScheduledOrders(lastEvaluatedKey);
        }
    };

    useEffect(() => {
        // empty orders
        if (orders.length === 0) {
            getScheduledOrders();
            setIsOpen(true);
        }
    }, []);

    const renderEmptiness = () => {
        return (
            <>
                <h3 className='sofia pro empty-message mt-5 mb-4'>
                    Your scheduled return is empty
                </h3>
            </>
        );
    };

    const activeOrders = () => {
        return (
            <>
                <Collapsible
                    open={isOpen}
                    onTriggerOpening={() => setIsOpen(true)}
                    onTriggerClosing={() => setIsOpen(false)}
                    trigger={
                        <div className='triggerContainer'>
                            <h3 className='sofia-pro text-18 mb-3-profile ml-3 mb-0 triggerText'>
                                Your Scheduled Return
                            </h3>
                            <span className='triggerArrow'>
                                {isOpen ? '▲' : '▼'}{' '}
                            </span>
                        </div>
                    }
                >
                    {!isEmpty(orders) &&
                        orders.map((order) => (
                            <ScheduledReturnItem order={order} key={order.id} />
                        ))}

                    {fetchingOrders && (
                        <ProgressBar
                            animated
                            striped
                            now={loadProgress}
                            className='mt-4 m-3'
                        />
                    )}
                    {!fetchingOrders && isEmpty(orders) && renderEmptiness()}
                    {lastEvaluatedKey && (
                        <div className='d-flex justify-content-center'>
                            <button
                                className='sofia-pro btn btn-show-more noted-purple'
                                onClick={showMore}
                            >
                                Show more
                            </button>
                        </div>
                    )}
                </Collapsible>
            </>
        );
    };

    return (
        <div id='ScheduledReturn'>
            {isOpen && activeOrders()}
            {!isOpen && activeOrders()}
        </div>
    );
}
