import React, { useEffect, useState } from 'react';
import { ProgressBar } from 'react-bootstrap';
import Collapsible from 'react-collapsible';
import PaymentMethods from './PaymentMethods';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { getPublicKey, getUserPaymentMethods } from '../../../utils/orderApi';
import { getUser } from '../../../utils/auth';
import AddPaymentForm from '../../../components/Forms/AddPaymentForm';

export default function Payment() {
  const [stripePromise, setStripePromise] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [defaultPaymentMethod, setDefaultPaymentMethod] = useState(null);
  const noBorder = !isEditing
    ? {
        style: {
          border: 'none',
        },
        disabled: true,
      }
    : {};

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 1199);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  const load = async () => {
    const key = await getPublicKey();
    const stripePromise = loadStripe(key);
    setStripePromise(stripePromise);
  };

  const fetchPaymentMethods = async () => {
    setLoading(true);
    const list = await getUserPaymentMethods();
    setPaymentMethods(list);
    setLoading(false);
  };

  const getDefaultPaymentMethods = async () => {
    const user = await getUser();
    const paymentMethod = user['custom:default_payment'] || null;
    setDefaultPaymentMethod(paymentMethod);
  };

  // Fetch stripe publishable api key
  useEffect(() => {
    load();
    fetchPaymentMethods();
    getDefaultPaymentMethods();
  }, []);

  const renderTrigger = () => {
    return (
      <div className='triggerContainer'>
        <h3 className='sofia-pro text-18 mb-3-profile mb-0 ml-3 triggerText'>
          Billing
        </h3>
        <span className='triggerArrow'>{isOpen ? '▲' : '▼'} </span>
      </div>
    );
  };

  return (
    <>
      <div id='Payment'>
        <Collapsible
          open={isOpen}
          onTriggerOpening={() => setIsOpen(true)}
          onTriggerClosing={() => setIsOpen(false)}
          trigger={renderTrigger()}
          overflowWhenOpen='visible'
        >
          <div
            className={`card shadow-sm p-4 max-w-840 mt-4 ${
              !isMobile ? 'ml-3' : ''
            }`}
          >
            {loading && (
              <ProgressBar animated striped now={80} className='mt-4 m-3' />
            )}
            <Elements stripe={stripePromise} showIcon={true}>
              {!isEditing && (
                <PaymentMethods
                  paymentMethods={paymentMethods}
                  addPaymentMethod={() => {
                    setIsEditing(true);
                  }}
                  defaultPaymentMethod={defaultPaymentMethod}
                  setDefault={(id) => {
                    setDefaultPaymentMethod(id);
                  }}
                />
              )}
              {isEditing && (
                <AddPaymentForm
                  close={() => {
                    setIsEditing(false);
                  }}
                  refreshPaymentMethods={() => {
                    setIsEditing(false);
                    fetchPaymentMethods();
                  }}
                />
              )}
            </Elements>
          </div>
        </Collapsible>
      </div>
    </>
  );
}
