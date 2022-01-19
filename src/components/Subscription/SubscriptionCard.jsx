import React from 'react';
import { Button, Card, Spinner } from 'react-bootstrap';

export default function SubscriptionCard({
  subscriptionDetails,
  onButtonClick,
  isLoading,
}) {
  const {
    recommendation,
    tag,
    plan_name,
    price,
    duration,
    description,
  } = subscriptionDetails;

  return (
    <div className='SubscriptionCardContainer'>
      <Card
        className={`SubscriptionCard ${recommendation ? 'recommended' : ''}`}
      >
        {/* <Card.Header>Featured</Card.Header> */}
        <img
          className={tag}
          src={
            tag && require(`../../assets/img/${tag}-subscription.svg`).default
          }
        />
        <Card.Body>
          {recommendation && (
            <div className='recommended-text'>
              <span>Recommended</span>
            </div>
          )}

          <Card.Title>{plan_name}</Card.Title>
          <Card.Text className='subscription-price'>
            {price}/{duration}
          </Card.Text>
          <Card.Text className='subscription-details'>{description}</Card.Text>
          <Button
            variant={recommendation ? 'primary' : 'outline-primary'}
            size='md'
            block
            onClick={onButtonClick}
          >
            {isLoading ? (
              <Spinner
                as='span'
                animation='border'
                size='sm'
                role='status'
                aria-hidden='true'
              />
            ) : (
              'Choose Plan'
            )}
          </Button>
        </Card.Body>
      </Card>
      {
        <span className='savings'>
          {subscriptionDetails.save && `Save ${subscriptionDetails.save}`}
        </span>
      }
    </div>
  );
}
