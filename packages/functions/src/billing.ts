import { computeBilling } from '@sstv3/core/billing';
import { lambdaHandler } from '@sstv3/core/util';
import { Resource } from 'sst';
import Stripe from 'stripe';

export type Billing = {
  source: string;
  storage: number;
};

export const emptyBilling = { source: '', storage: 0 };

function isNote(input: unknown): input is Billing {
  return (
    typeof (input as Billing).source !== 'undefined' &&
    typeof (input as Billing).storage !== 'undefined'
  );
}

export function parseBilling(input: string | null): Billing {
  if (!input) {
    return emptyBilling;
  }
  const parsedInput: unknown = JSON.parse(input);
  if (!isNote(parsedInput)) {
    return emptyBilling;
  }
  return parsedInput;
}

export const main = lambdaHandler(async (event) => {
  const { storage, source } = parseBilling(event.body);
  const amount = computeBilling(Number(storage));
  const description = 'Scratch charge';

  const stripe = new Stripe(
    // Load our secret key
    Resource.StripeSecretKey.value,
    { apiVersion: '2024-12-18.acacia' }
  );

  await stripe.charges.create({
    source: String(source),
    amount,
    description,
    currency: 'usd',
  });

  return JSON.stringify({ status: true });
});
