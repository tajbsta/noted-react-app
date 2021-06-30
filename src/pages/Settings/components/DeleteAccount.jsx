import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import Collapsible from 'react-collapsible';
import DeleteAccountModal from '../../../modals/DeleteAccountModal';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { deleteUserAccount } from '../../../api/auth';
import { unsetUser } from '../../../actions/auth.action';
import { unsetScan } from '../../../actions/scans.action';
import { clearCart } from '../../../actions/cart.action';
import { Auth } from 'aws-amplify';
import { showSuccess, showError } from '../../../library/notifications.library';

export default function DeleteAccount() {
    const history = useHistory();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [disableButton, setDisableButton] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isOpen] = useState(false);
    const [modalDeleteShow, setModalDeleteShow] = useState(false);

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

    const logout = async () => {
        dispatch(await unsetUser());
        dispatch(await unsetScan());
        Auth.signOut()
            .then(async () => {
                setTimeout(() => {
                    history.push('/');

                    // Clear cart on destroy
                    dispatch(clearCart());
                }, 4000);
            })
            .catch(() => {
                // console.log('Error Signing Out: ', error);
                showError({ message: 'Error Signing Out' });
                history.push('/');
            });
    };

    const deleteUser = async () => {
        setDisableButton(true);
        setLoading(true);

        await deleteUserAccount();

        setTimeout(() => {
            setModalDeleteShow(false);
        }, 1000);

        // Showing success even if there is an error so that we can see the error log and manually delete the user
        setTimeout(() => {
            showSuccess({
                message: 'Your noted account has been deleted successfully!',
            });
        }, 1500);

        await logout();
    };

    const renderMobileView = () => {
        return (
            <>
                <Collapsible
                    trigger={
                        <div className="triggerContainer">
                            <h3 className="sofia-pro text-18 mb-3-profile mb-0 ml-3 triggerText">
                                Delete Account
                            </h3>
                            <span className="triggerArrow">
                                {isOpen ? '▲' : '▼'}{' '}
                            </span>
                        </div>
                    }
                >
                    <div className="card shadow-sm mb-2 mt-4 max-w-840 change-container">
                        <div className="card-body">
                            <Row>
                                <Col
                                    style={{
                                        flexBasis: isMobile ? 'auto' : '0',
                                    }}
                                >
                                    <h4 className="delete-info">
                                        Deleting your account will permanently
                                        clear all scanned items and account
                                        information. All open orders will
                                        continue to be picked up and charged
                                        unless canceled through the order
                                        history page.
                                    </h4>
                                </Col>
                                <Col className="d-flex justify-content-center">
                                    <button
                                        className="btn btn-delete"
                                        onClick={() => setModalDeleteShow(true)}
                                    >
                                        Delete Account
                                    </button>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </Collapsible>
                <hr />
            </>
        );
    };

    const renderDesktopView = () => {
        return (
            <>
                <div className="mt-5">
                    <h3 className="sofia-pro text-18 mb-4">Delete Account</h3>

                    <div className="card shadow-sm mb-2 max-w-840 change-container">
                        <div className="card-body">
                            <Row>
                                <Col
                                    style={{
                                        flexBasis: isMobile ? 'auto' : '0',
                                    }}
                                >
                                    <h4 className="delete-info">
                                        Deleting your account will permanently
                                        clear all scanned items and account
                                        information. All open orders will
                                        continue to be picked up and charged
                                        unless canceled through the order
                                        history page.
                                    </h4>
                                </Col>
                                <Col className="d-flex justify-content-center">
                                    <button
                                        className="btn btn-delete"
                                        onClick={() => setModalDeleteShow(true)}
                                    >
                                        Delete Account
                                    </button>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </div>
            </>
        );
    };

    return (
        <div id="DeleteAccount">
            {!isMobile && renderDesktopView()}
            {isMobile && renderMobileView()}
            <DeleteAccountModal
                show={modalDeleteShow}
                deleteUser={deleteUser}
                loading={loading}
                disableButton={disableButton}
                onHide={() => {
                    setModalDeleteShow(false);
                }}
            />
        </div>
    );
}
