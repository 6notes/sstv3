import Form from 'react-bootstrap/Form';
import Stack from 'react-bootstrap/Stack';

import LoaderButton from '../../components/LoaderButton';
import { FieldsType } from '../../lib/hooksLib';

type Props = {
  handleFieldChange: React.ChangeEventHandler;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
  fields: FieldsType;
  isLoading: boolean;
};

export function SignupForm(props: Props) {
  const { fields, handleFieldChange, handleSubmit, isLoading } = props;

  function validateForm() {
    const lengthOfEmptyField = 0;
    return (
      fields.email.length > lengthOfEmptyField &&
      fields.password.length > lengthOfEmptyField &&
      fields.password === fields.confirmPassword
    );
  }

  return (
    <Form onSubmit={void handleSubmit}>
      <Stack gap={3}>
        <Form.Group controlId='email'>
          <Form.Label>Email</Form.Label>
          <Form.Control
            size='lg'
            autoFocus
            type='email'
            value={fields.email}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <Form.Group controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            size='lg'
            type='password'
            value={fields.password}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <Form.Group controlId='confirmPassword'>
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            size='lg'
            type='password'
            onChange={handleFieldChange}
            value={fields.confirmPassword}
          />
        </Form.Group>
        <LoaderButton
          size='lg'
          type='submit'
          variant='success'
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Signup
        </LoaderButton>
      </Stack>
    </Form>
  );
}
