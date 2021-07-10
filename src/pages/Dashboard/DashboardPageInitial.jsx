import React, { useState, useEffect } from 'react';
import { Button, Col, Container, Row, Spinner } from 'react-bootstrap';
import AuthorizeImg from '../../assets/img/Authorize.svg';
import ScanningIcon from '../../assets/icons/Scanning.svg';
import CustomRow from '../../components/Row';

const Authorize = ({ triggerScanNow }) => {
    return (
        <div id="AuthorizeUpdate">
            <Container className="main-body" fluid="lg">
                <Row md="2" className="text-left align-items-end">
                    <Col xs="6" className="info">
                        <h1 className="bold text-title">
                            Everything is automatic
                        </h1>
                        <h4 className="text-noted">
                            noted will scan your email inbox and find all of
                            your online purchases and their return limits.
                        </h4>
                        <div className="text-subtitle">
                            <h4 className="bold">In time?</h4>
                            <h4>Get your cash back with one click</h4>
                        </div>
                        <div className="text-subtitle">
                            <h4 className="bold">Too late?</h4>
                            <h4>
                                Declutter your home and donate to local
                                charities
                            </h4>
                        </div>

                        <h4 className="text-first">
                            You first need to authorized noted to read your
                            emails. Only bots will see the relevant emails and
                            we will never sell or transfer any of your personal
                            info to anyone.
                        </h4>
                        <h4 className="text-underline">
                            <a
                                href="https://notedreturns.com/privacy-policy"
                                target="_blank"
                                rel="noreferrer"
                                className="sofia-pro"
                            >
                                Learn more about security
                            </a>
                        </h4>
                        <Button
                            onClick={triggerScanNow}
                            className="btn btn-green btn-authorize"
                        >
                            Scan Now
                        </Button>
                    </Col>
                    <Col xs="6">
                        <div className="authorize-img">
                            <img src={AuthorizeImg} />
                        </div>
                    </Col>
                </Row>
            </Container>
            {/* MOBILE VIEW */}
            <Container
                className="main-body-mobile"
                fluid="lg"
                style={{ marginTop: '2.5rem' }}
            >
                <Row md="2" className="text-left align-items-end">
                    <Col xs="6">
                        <div className="authorize-img-mobile">
                            <img src={AuthorizeImg} />
                        </div>
                    </Col>
                    <Col xs="6" className="info">
                        <h1 className="bold text-title">
                            Everything is automatic
                        </h1>
                        <h4 className="text-noted">
                            noted will scan your email inbox and find all of
                            your online purchases and their return limits.
                        </h4>
                        <div className="text-subtitle">
                            <h4 className="bold">In time?</h4>
                            <h4 className="subtitle">
                                Get your cash back with one click
                            </h4>
                        </div>
                        <div className="text-subtitle">
                            <h4 className="bold">Too late?</h4>
                            <h4 className="subtitle">
                                Declutter your home and donate to local
                                charities
                            </h4>
                        </div>

                        <h4 className="text-first">
                            You first need to authorized noted to read your
                            emails. Only bots will see the relevant emails and
                            we will never sell or transfer any of your personal
                            info to anyone.
                        </h4>
                        <h4 className="text-underline">
                            <a href="#" className="sofia-pro">
                                Learn more about security
                            </a>
                        </h4>
                        <Button
                            onClick={triggerScanNow}
                            className="btn btn-green btn-authorize"
                        >
                            Scan Now
                        </Button>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

const Scanning = () => {
    return (
        <div id="ScanningUpdate">
            <div className="card-body">
                <CustomRow marginBottom={2}>
                    <div
                        className="col-12"
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                        }}
                    >
                        <img src={ScanningIcon} />
                    </div>
                </CustomRow>
                <p className="text-center sofia-pro noted-purple text-18 text-subtitle">
                    Scan running...
                </p>
                <p className="small text-muted mb-1 text-center text-16 sofia-pro">
                    Go have some coffee - we&apos;ll email ya when it&apos;s
                    done!
                </p>
            </div>
        </div>
    );
};

/**STATUSES
 * 1. notAutorized - User has not initiated authorization
 * 2. isAuthorizing - Authorization in progress, Google Modal in the foreground
 * 3. isScanning - Authorization is complete and Scanning has been initiated
 * 4. scanComplete - Scanning is complete
 *  */

const DashboardPageInitial = () => {
    const [status, setStatus] = useState('');
    const triggerScanNow = () => {
        /**HANDLE SCAN NOW */
        setStatus('isAuthorizing');

        setTimeout(() => {
            setStatus('isScanning');
        }, 3000);
    };

    useEffect(() => {
        setTimeout(() => {
            setStatus('notAuthorized');
        }, 3000);
    }, []);
    return (
        <div id="DashboardInitial">
            {status === 'notAuthorized' && (
                <Authorize triggerScanNow={triggerScanNow} />
            )}
            {status === 'isScanning' && <Scanning></Scanning>}
            {(status === 'isAuthorizing' || status === '') && (
                <div>
                    <Spinner size="lg" color="#570097" animation="border" />
                </div>
            )}
        </div>
    );
};

export default DashboardPageInitial;
