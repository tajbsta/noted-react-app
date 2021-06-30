import React, { useEffect, useState } from 'react';
import Row from '../Row';
import $ from 'jquery';
import { useHistory } from 'react-router';
import { useSelector } from 'react-redux';
import { scrollToTop } from '../../utils/window';

function PickUpCancelled({ order, orderId = '' }) {
    const history = useHistory();
    const [, setCurrentOrder] = useState({});
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const platform = window.navigator.platform;
        const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];

        if (windowsPlatforms.indexOf(platform) !== -1) {
            // Windows 10 Chrome
            $('.back-to-products-btn').css('padding-top', '9px');
        }
    }, []);

    const { scheduledReturns } = useSelector(
        ({ auth: { scheduledReturns } }) => ({
            scheduledReturns,
        })
    );

    useEffect(() => {
        /**
         * @FUNCTION load order here
         */
        const scheduledReturn = scheduledReturns.find(
            ({ id }) => orderId === id
        );
        setCurrentOrder(scheduledReturn);
    }, []);

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

    return (
        <div className="card shadow-sm max-w-840 card-height">
            <div className="card-body pt-4 pb-3 pl-4 m-0">
                <Row>
                    <div className="col-sm-12 p-0">
                        <p className="request-msg text-16 sofia-pro mb-0">
                            Your pickup has been successfully cancelled!
                        </p>
                        <p className="request-msg text-16 sofia-pro">
                            We&apos;re sorry pickup of order #
                            <strong>{order.id}</strong> didn&apos;t work out for
                            you. But we hope we&apos;ll see you again...right?
                        </p>
                        <p className="request-msg text-16 sofia-pro">
                            A cancellation confirmation has been sent to your
                            email.
                        </p>
                    </div>
                </Row>
                <Row>
                    {!isMobile && (
                        <>
                            <div className="mt-3">
                                <button
                                    className="btn btn-green back-to-products-btn"
                                    onClick={() => history.push('/dashboard')}
                                >
                                    <span className="sofia-pro mb-0 back-to-products-text">
                                        Back to My Products
                                    </span>
                                </button>
                            </div>
                        </>
                    )}
                </Row>
                {isMobile && (
                    <>
                        <Row className="mt-3">
                            <button
                                className="btn btn-green"
                                onClick={() => history.push('/dashboard')}
                            >
                                <span className="sofia-pro mb-0 back-to-products-text ">
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

export default PickUpCancelled;
