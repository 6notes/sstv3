import Form from 'react-bootstrap/Form';
import Stack from 'react-bootstrap/Stack';

import LoaderButton from '../../components/LoaderButton';
import { FieldsType } from '../../lib/hooksLib';

type Props = {
  handleConfirmationSubmit: (
    event: React.FormEvent<HTMLFormElement>
  ) => Promise<void>;
  handleFieldChange: React.ChangeEventHandler;
  fields: FieldsType;
  isLoading: boolean;
};

export function ConfirmationForm(props: Props) {
  const { fields, handleConfirmationSubmit, handleFieldChange, isLoading } =
    props;

  function validateConfirmationForm() {
    const lengthOfEmptyField = 0;
    return fields.confirmationCode.length > lengthOfEmptyField;
  }

  return (
    <Form onSubmit={void handleConfirmationSubmit}>
      <Stack gap={3}>
        <Form.Group controlId='confirmationCode'>
          <Form.Label>Confirmation Code</Form.Label>
          <Form.Control
            size='lg'
            autoFocus
            type='tel'
            onChange={handleFieldChange}
            value={fields.confirmationCode}
          />
          <Form.Text muted>Please check your email for the code.</Form.Text>
        </Form.Group>
        <LoaderButton
          size='lg'
          type='submit'
          variant='success'
          isLoading={isLoading}
          disabled={!validateConfirmationForm()}
        >
          Verify
        </LoaderButton>
      </Stack>
    </Form>
  );
}
