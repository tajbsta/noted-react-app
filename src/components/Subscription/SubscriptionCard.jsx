import React from 'react';
import { Button, Card, Spinner } from 'react-bootstrap';

export default function SubscriptionCard({
  subscriptionDetails,
  onButtonClick,
  isLoading,
  disabled,
  isSelected,
  isAddOrUpgrade,
}) {
  const {
    recommendation,
    tag,
    plan_name,
    price,
    duration,
    description,
    upgrade_description,
  } = subscriptionDetails;

  return (
    <div
      className={`SubscriptionCardContainer ${disabled ? 'card-disabled' : ''}`}
    >
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
          <Card.Text className='subscription-details'>
            {isAddOrUpgrade ? upgrade_description : description}
          </Card.Text>
          <Button
            variant={
              recommendation || isSelected ? 'primary' : 'outline-primary'
            }
            size='md'
            block
            onClick={onButtonClick}
            disabled={disabled}
          >
            {isLoading ? (
              <Spinner
                as='span'
                animation='border'
                size='sm'
                role='status'
                aria-hidden='true'
              />
            ) : isSelected ? (
              'Selected'
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
