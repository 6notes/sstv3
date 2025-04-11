import './Notes.css';

import { API, Storage } from 'aws-amplify';
import React, { useEffect, useRef, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Stack from 'react-bootstrap/Stack';
import { NavigateFunction, useNavigate, useParams } from 'react-router-dom';

import config from '../../config';
import { loadNote } from '../../lib/apiLib';
import { s3Upload } from '../../lib/awsLib';
import { onError } from '../../lib/errorLib';
import { NoteType } from '../../types/note';
import { NotesButtonToolbar } from './NotesButtonToolbar';

function formatFilename(str: string) {
  return str.replace(/^\w+-/u, '');
}

type FileRef = React.MutableRefObject<File | null>;

function handleFileChange(input: {
  event: React.ChangeEvent<HTMLInputElement>;
  fileRef: FileRef;
}) {
  const { event, fileRef } = input;
  if (event.currentTarget.files === null) return;
  const [firstFile] = event.currentTarget.files;
  fileRef.current = firstFile;
}

function saveNote(input: { id?: string; note: NoteType }) {
  const { id, note } = input;
  return API.put('notes', `/notes/${id ?? ''}`, {
    body: note,
  });
}

async function handleSubmit(input: {
  content: string;
  event: React.FormEvent<HTMLFormElement>;
  fileRef: FileRef;
  nav: NavigateFunction;
  note: NoteType | null;
  oldAttachment: string | null;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setOldAttachment: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  const {
    content,
    event,
    fileRef,
    nav,
    note,
    oldAttachment,
    setIsLoading,
    setOldAttachment,
  } = input;
  let attachment: string | null = null;

  event.preventDefault();

  if (fileRef.current && fileRef.current.size > config.MAX_ATTACHMENT_SIZE) {
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
    const { attachment: noteAttachment } = note || {};
    if (fileRef.current) {
      attachment = await s3Upload(fileRef.current);
    } else if (note && noteAttachment) {
      attachment = noteAttachment;
    }

    await saveNote({
      note: {
        content,
        attachment,
      },
    });
    // After saving the note, delete old attachment if new attachment diff
    if (oldAttachment && oldAttachment !== attachment) {
      await Storage.vault.remove(oldAttachment);
      setOldAttachment(attachment ?? null);
    }
    void nav('/');
  } catch (error) {
    onError(error);
    setIsLoading(false);
  }
}

function validateForm(content: NoteType['content']) {
  return content.length > 0;
}

export default function Notes() {
  const file = useRef<null | File>(null);
  const { id } = useParams();
  const nav = useNavigate();
  const [note, setNote] = useState<NoteType | null>(null);
  const [oldAttachment, setOldAttachment] = useState<string | null>(null);
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function onLoad() {
      try {
        const loadedNote = await loadNote(id);
        if (loadedNote === null) {
          return;
        }
        const { content: loadedContent, attachment } = loadedNote;

        if (attachment) {
          loadedNote.attachmentURL = await Storage.vault.get(attachment);
          setOldAttachment(attachment);
        }

        setContent(loadedContent);
        setNote(loadedNote);
      } catch (error) {
        onError(error);
      }
    }

    void onLoad();
  }, [id, note]);

  return (
    <div className='Notes'>
      {note && (
        <Form
          onSubmit={(event) =>
            void handleSubmit({
              content,
              event,
              fileRef: file,
              nav,
              note,
              oldAttachment,
              setIsLoading,
              setOldAttachment,
            })
          }
        >
          <Stack gap={3}>
            <Form.Group controlId='content'>
              <Form.Control
                size='lg'
                as='textarea'
                value={content}
                onChange={(event) => {
                  setContent(event.target.value);
                }}
              />
            </Form.Group>
            <Form.Group className='mt-2' controlId='file'>
              <Form.Label>Attachment</Form.Label>
              {note.attachment && (
                <p>
                  <a
                    target='_blank'
                    rel='noopener noreferrer'
                    href={note.attachmentURL}
                  >
                    {formatFilename(note.attachment)}
                  </a>
                </p>
              )}
              <Form.Control
                onChange={(event) => {
                  handleFileChange({
                    event: event as React.ChangeEvent<HTMLInputElement>,
                    fileRef: file,
                  });
                }}
                type='file'
              />
            </Form.Group>
            <NotesButtonToolbar
              isDeleting={isDeleting}
              isLoading={isLoading}
              isSaveDisabled={!validateForm(content)}
              setIsDeleting={setIsDeleting}
            />
          </Stack>
        </Form>
      )}
    </div>
  );
}
