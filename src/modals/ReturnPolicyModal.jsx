import React, { useState, useEffect } from 'react';
import { get } from 'lodash-es';
import { Modal, Button, Row, Col } from 'react-bootstrap';
import { RETURN_SCORES } from '../constants/returns/scores';
import ReturnScore from '../components/Product/ReturnsScore';
import ProductPlaceholder from '../assets/img/ProductPlaceholder.svg';

export default function ReturnPolicyModal(props) {
    const [isMobile, setIsMobile] = useState(false);
    const { item } = props;
    const thumbnail = get(item, 'vendor_data.thumbnail', '');
    const policy = get(item, 'vendor_data.policy', '');
    const website = get(item, 'vendor_data.website', '');
    const rating = get(item, 'vendor_data.rating', 1);
    const score = RETURN_SCORES.find(
        ({ rating: returnRating }) => rating === returnRating
    );
    const scoreTitle = get(score, 'title', '');
    const vendor = get(item, 'vendor_data.name', '');

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
        <Modal
            {...props}
            size='lg'
            aria-labelledby='contained-modal-title-vcenter'
            centered
            backdrop='static'
            keyboard={false}
            animation={false}
            id='ReturnPolicyModal'
        >
            <Modal.Header>
                <Modal.Title id='contained-modal-title-vcenter'>
                    Return Policy
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className='sofia-pro'>
                <Row className='b-row'>
                    <div className={isMobile ? 'col' : 'col-4'}>
                        <div className='brand-group'>
                            <img
                                src={thumbnail || ProductPlaceholder}
                                onError={(e) => {
                                    e.currentTarget.src = ProductPlaceholder;
                                }}
                                alt=''
                                className='brand-img'
                            />
                            <h4 className='sofia-pro brand'>{vendor}</h4>
                        </div>
                    </div>
                    <Col className='score-col'>
                        <ReturnScore
                            score={get(item.vendor_data, 'rating', 0)}
                        />
                        <h4 className='ml-2 sofia-pro text-score'>
                            {scoreTitle}
                        </h4>
                    </Col>
                </Row>
                <Row className='ml-1'>
                    {' '}
                    <p className='sofia-pro info'>
                        {policy == '' ? 'This is empty.' : policy}
                    </p>
                </Row>
                {!!website && (
                    <Row className='ml-1'>
                        <a
                            className='sofia-pro view-link'
                            href={website}
                            target='_blank'
                            rel='noreferrer'
                        >
                            View website
                        </a>
                    </Row>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button className='btn-ok' onClick={props.onHide}>
                    OK, Got it
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
