import './BillingForm.css';

import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { StripeError, Token } from '@stripe/stripe-js';
import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Stack from 'react-bootstrap/Stack';

import { useFormFields } from '../lib/hooksLib';
import LoaderButton from './LoaderButton';

export interface BillingFormType {
  isLoading: boolean;
  onSubmit: (
    storage: string,
    info: { token?: Token; error?: StripeError }
  ) => Promise<void>;
}

export function BillingForm({ isLoading, onSubmit }: BillingFormType) {
  const stripe = useStripe();
  const elements = useElements();
  const [fields, handleFieldChange] = useFormFields({
    name: '',
    storage: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCardComplete, setIsCardComplete] = useState(false);

  function validateForm() {
    return (
      stripe &&
      elements &&
      fields.name !== '' &&
      fields.storage !== '' &&
      isCardComplete
    );
  }

  async function handleSubmitClick(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    if (!elements.getElement(CardElement)) {
      return;
    }

    setIsProcessing(true);

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      return;
    }

    const { token, error } = await stripe.createToken(cardElement);

    setIsProcessing(false);

    await onSubmit(fields.storage, { token, error });
  }

  return (
    <Form className='BillingForm' onSubmit={void handleSubmitClick}>
      <Form.Group controlId='storage'>
        <Form.Label>Storage</Form.Label>
        <Form.Control
          min='0'
          size='lg'
          type='number'
          value={fields.storage}
          onChange={handleFieldChange}
          placeholder='Number of notes to store'
        />
      </Form.Group>
      <hr />
      <Stack gap={3}>
        <Form.Group controlId='name'>
          <Form.Label>Cardholder&apos;s name</Form.Label>
          <Form.Control
            size='lg'
            type='text'
            value={fields.name}
            onChange={handleFieldChange}
            placeholder='Name on the card'
          />
        </Form.Group>
        <div>
          <Form.Label>Credit Card Info</Form.Label>
          <CardElement
            className='card-field'
            onChange={(event) => {
              setIsCardComplete(event.complete);
            }}
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  fontWeight: '400',
                  color: '#495057',
                  fontFamily: "'Open Sans', sans-serif",
                },
              },
            }}
          />
        </div>
        <LoaderButton
          size='lg'
          type='submit'
          isLoading={isProcessing || isLoading}
          disabled={!validateForm()}
        >
          Purchase
        </LoaderButton>
      </Stack>
    </Form>
  );
}
