import './Signup.css';

import { ISignUpResult } from 'amazon-cognito-identity-js';
import { Auth } from 'aws-amplify';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppContext } from '../../lib/contextLib';
import { onError } from '../../lib/errorLib';
import { useFormFields } from '../../lib/hooksLib';
import { ConfirmationForm } from './ConfirmationForm';
import { SignupForm } from './SignupForm';

/* Use this to manually confirm an unauthenticated user:
```{bash}
aws cognito-idp admin-confirm-sign-up \
   --region <COGNITO_REGION> \
   --user-pool-id <USER_POOL_ID> \
   --username <YOUR_USER_EMAIL>
```
*/

export default function Signup() {
  const [fields, handleFieldChange] = useFormFields({
    email: '',
    password: '',
    confirmPassword: '',
    confirmationCode: '',
  });
  const nav = useNavigate();
  const { userHasAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [newUser, setNewUser] = useState<null | ISignUpResult>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    try {
      const newAuthUser = await Auth.signUp({
        username: fields.email,
        password: fields.password,
      });
      setIsLoading(false);
      setNewUser(newAuthUser);
    } catch (error) {
      onError(error);
      setIsLoading(false);
    }
  }

  async function handleConfirmationSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setIsLoading(true);
    try {
      await Auth.confirmSignUp(fields.email, fields.confirmationCode);
      await Auth.signIn(fields.email, fields.password);
      userHasAuthenticated(true);
      void nav('/');
    } catch (error) {
      onError(error);
      setIsLoading(false);
    }
  }

  return (
    <div className='Signup'>
      {newUser === null ? (
        <SignupForm
          fields={fields}
          handleSubmit={handleSubmit}
          handleFieldChange={handleFieldChange}
          isLoading={isLoading}
        />
      ) : (
        <ConfirmationForm
          fields={fields}
          handleConfirmationSubmit={handleConfirmationSubmit}
          handleFieldChange={handleFieldChange}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
