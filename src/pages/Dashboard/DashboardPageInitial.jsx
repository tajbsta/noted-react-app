import React, { useState, useEffect } from 'react';
import { Button, Col, Container, Row, Spinner } from 'react-bootstrap';
import AuthorizeImg from '../../assets/img/Authorize.svg';
import ScanningIcon from '../../assets/icons/Scanning.svg';
import CustomRow from '../../components/Row';
import { loadGoogleScript } from '../../library/loadGoogleScript';

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
 * 3. isScraping - Authorization is complete and Scraping has been initiated
 * 4. scrapeComplete - Scraping is complete
 *  */

const DashboardPageInitial = () => {
    const [status, setStatus] = useState('');

    /**TRIGGER SCAN NOW FOR USERS */
    const triggerScanNow = () => {
        window.gapi.auth2.getAuthInstance().signIn();
        setStatus('isAuthorizing');

        // setTimeout(() => {
        //     setStatus('isScraping');
        // }, 3000);
    };

    const fetchByVendor = async (from, initialToken) => {
        let emails = [];
        let nextPageToken = initialToken;

        while (nextPageToken !== undefined) {
            const response = await window.gapi.client.gmail.users.messages.list(
                {
                    userId: 'me',
                    maxResults: 10,
                    q: from,
                    pageToken: nextPageToken,
                }
            );

            emails =
                response.result.resultSizeEstimate > 0
                    ? [...emails, ...response.result.messages]
                    : emails;
            nextPageToken = response.result.nextPageToken || undefined;
        }
        return emails;
    };

    //FETCH EMAILS
    const fetchEmails = async () => {
        const vendorList = [
            'from:gabriella@deel.support',
            'from:support@udacity.com',
            'no_reply@monday.com',
        ];
        const emailContainer = await Promise.all(
            vendorList.map(async (vendorFrom) => {
                const em = await fetchByVendor(vendorFrom, '');
                return em;
            })
        );
        const emails = emailContainer.reduce((prev, curr) => {
            return [...prev, ...curr];
        }, []);

        const batch = window.gapi.client.newBatch();

        emails.forEach((email) => {
            const getEmail = window.gapi.client.gmail.users.messages.get({
                userId: 'me',
                id: email.id,
                q: 'format: raw',
            });
            batch.add(getEmail);
        });

        const res = await batch;
        const scrapedEmails = Object.values(res.result).map((item) => {
            const internalDate = item.result.internalDate;
            const value = item.result.payload.parts.filter(
                (item) => item.mimeType === 'text/html'
            )[0].body.data;
            return {
                raw: value,
                internalDate,
            };
        });
        return scrapedEmails;
    };

    /**HANDLE EMAIl SCRAPING */
    const handleScraping = () => {
        setStatus('isScraping');
        const emails = fetchEmails();
        /**CHECK CONSOLE */
        console.log(emails);
    };

    /**INITIALIZE CLIENT TO USE GAPI */
    const initClient = async () => {
        try {
            await window.gapi.client.init({
                clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
                discoveryDocs: [
                    'https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest',
                ],
                scope: 'https://www.googleapis.com/auth/gmail.readonly',
            });

            const isSignedIn = window.gapi.auth2
                .getAuthInstance()
                .isSignedIn.get();

            if (isSignedIn) {
                window.gapi.auth2.getAuthInstance().signOut();
            }

            // Listen for sign-in state changes.
            window.gapi.auth2.getAuthInstance().isSignedIn.listen((success) => {
                if (success) {
                    handleScraping();
                    //HANDLE FECTH EMAILS
                }
            });
        } catch (error) {
            console.log(JSON.stringify(error, null, 2));
        }
    };

    useEffect(() => {
        setTimeout(() => {
            setStatus('notAuthorized');
        }, 3000);
    }, []);

    //INITIALIZE GOOGLE API
    useEffect(() => {
        window.onGoogleScriptLoad = () => {
            window.gapi.load('client:auth2', initClient);
        };

        loadGoogleScript();
    }, []);

    return (
        <div id="DashboardInitial">
            {status === 'notAuthorized' && (
                <Authorize triggerScanNow={triggerScanNow} />
            )}
            {status === 'isScraping' && <Scanning></Scanning>}
            {(status === 'isAuthorizing' || status === '') && (
                <div>
                    <Spinner size="lg" color="#570097" animation="border" />
                </div>
            )}
        </div>
    );
};

export default DashboardPageInitial;
