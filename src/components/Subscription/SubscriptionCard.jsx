import React from 'react';
import { Button, Card, Col } from 'react-bootstrap';
import RubySVG from '../../assets/img/ruby-subscription.svg';
import EmeraldSVG from '../../assets/img/emerald-subscription.svg';
import DiamondSVG from '../../assets/img/diamond-subscription.svg';

export default function SubscriptionCard(props) {
  return (
    <div className='SubscriptionCardContainer'>
      <Card
        className={`SubscriptionCard ${props.recommended ? 'recommended' : ''}`}
      >
        {/* <Card.Header>Featured</Card.Header> */}
        <img
          className={props.subscriptionType}
          src={
            props.subscriptionType &&
            require(`../../assets/img/${props.subscriptionType}-subscription.svg`)
              .default
          }
        />
        <Card.Body>
          {props.recommended && (
            <div className='recommended-text'>
              <span>Recommended</span>
            </div>
          )}

          <Card.Title>{props.subscriptionType}</Card.Title>
          <Card.Text className='subscription-price'>$14.99/pick up</Card.Text>
          <Card.Text className='subscription-details'>pay as you go</Card.Text>
          <Button
            variant={props.recommended ? 'primary' : 'outline-primary'}
            size='md'
            block
            onClick={props.onButtonClick}
          >
            Choose Plan
          </Button>
        </Card.Body>
      </Card>
      {<span className='savings'>{props.savings}</span>}
    </div>
  );
}
