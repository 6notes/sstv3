import { API } from 'aws-amplify';
import { Stack } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import LoaderButton from '../../components/LoaderButton';
import { onError } from '../../lib/errorLib';

function deleteNote(id?: string) {
  return API.del('notes', `/notes/${id ?? ''}`, {});
}

type Props = {
  isDeleting: boolean;
  isLoading: boolean;
  isSaveDisabled: boolean;
  setIsDeleting: React.Dispatch<React.SetStateAction<boolean>>;
};

export function NotesButtonToolbar(props: Props) {
  const { isDeleting, isLoading, isSaveDisabled, setIsDeleting } = props;
  const nav = useNavigate();

  async function handleDelete(event: React.FormEvent<HTMLModElement>) {
    event.preventDefault();

    // eslint-disable-next-line no-alert
    const confirmed = window.confirm(
      'Are you sure you want to delete this note?'
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteNote();
      void nav('/');
    } catch (error) {
      onError(error);
      setIsDeleting(false);
    }
  }

  return (
    <Stack gap={1}>
      <LoaderButton
        size='lg'
        type='submit'
        isLoading={isLoading}
        disabled={isSaveDisabled}
      >
        Save
      </LoaderButton>
      <LoaderButton
        size='lg'
        variant='danger'
        onClick={handleDelete}
        isLoading={isDeleting}
      >
        Delete
      </LoaderButton>
    </Stack>
  );
}
