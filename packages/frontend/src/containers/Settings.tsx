import './Settings.css';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { API } from 'aws-amplify';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { BillingForm, BillingFormType } from '../components/BillingForm';
import config from '../config';
import { onError } from '../lib/errorLib';
import { BillingType } from '../types/billing';

const stripePromise = loadStripe(config.STRIPE_KEY);

export default function Settings() {
  const nav = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  function billUser(details: BillingType) {
    return API.post('notes', '/billing', {
      body: details,
    });
  }

  const handleFormSubmit: BillingFormType['onSubmit'] = async (
    storage,
    info
  ) => {
    if (info.error) {
      onError(info.error);
      return;
    }

    setIsLoading(true);

    try {
      await billUser({
        storage,
        source: info.token?.id,
      });

      alert('Your card has been charged successfully!');
      void nav('/');
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  };

  return (
    <div className='Settings'>
      <Elements
        stripe={stripePromise}
        options={{
          fonts: [
            {
              cssSrc:
                'https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700,800',
            },
          ],
        }}
      >
        <BillingForm isLoading={isLoading} onSubmit={handleFormSubmit} />
      </Elements>
    </div>
  );
}
