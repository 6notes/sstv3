import './NewNote.css';

import { API } from 'aws-amplify';
import React, { useRef, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Stack from 'react-bootstrap/Stack';
import { useNavigate } from 'react-router-dom';

import LoaderButton from '../components/LoaderButton';
import config from '../config';
import { s3Upload } from '../lib/awsLib';
import { onError } from '../lib/errorLib';
import { NoteType } from '../types/note';

export default function NewNote() {
  const file = useRef<null | File>(null);
  const nav = useNavigate();
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  function validateForm() {
    const emptyContentLength = 0;
    return content.length > emptyContentLength;
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.currentTarget.files === null) return;
    const [firstFile] = event.currentTarget.files;
    file.current = firstFile;
  }

  function createNote(note: NoteType) {
    return API.post('notes', '/notes', {
      body: note,
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
      // eslint-disable-next-line no-alert
      alert(
        `Please pick a file smaller than ${String(
          config.MAX_ATTACHMENT_SIZE / config.NUMBER_OF_BYTES_IN_MB
        )} MB.`
      );
      return;
    }

    setIsLoading(true);

    try {
      const attachment = file.current ? await s3Upload(file.current) : null;

      await createNote({ content, attachment });
      void nav('/');
    } catch (error) {
      onError(error);
      setIsLoading(false);
    }
  }

  return (
    <div className='NewNote'>
      <Form onSubmit={void handleSubmit}>
        <Form.Group controlId='content'>
          <Form.Control
            value={content}
            as='textarea'
            onChange={(event) => {
              setContent(event.target.value);
            }}
          />
        </Form.Group>
        <Form.Group className='mt-2' controlId='file'>
          <Form.Label>Attachment</Form.Label>
          <Form.Control onChange={handleFileChange} type='file' />
        </Form.Group>
        <Stack>
          <LoaderButton
            size='lg'
            type='submit'
            variant='primary'
            isLoading={isLoading}
            disabled={!validateForm()}
          >
            Create
          </LoaderButton>
        </Stack>
      </Form>
    </div>
  );
}
