import './Home.css';

import { useEffect, useState } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import { BsPencilSquare } from 'react-icons/bs';

import { loadNotes } from '../lib/apiLib';
import { useAppContext } from '../lib/contextLib';
import { onError } from '../lib/errorLib';
import { NoteType } from '../types/note';

export default function Home() {
  const [notes, setNotes] = useState<Array<NoteType>>([]);
  const { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }

      try {
        const notes = await loadNotes();
        setNotes(notes);
      } catch (e) {
        onError(e);
      }

      setIsLoading(false);
    }

    void onLoad();
  }, [isAuthenticated]);

  function formatDate(str: undefined | string) {
    return !str ? '' : new Date(str).toLocaleString();
  }

  function renderNotesList(notes: NoteType[]) {
    return (
      <>
        <ListGroup.Item
          action
          className='py-3 text-nowrap text-truncate'
          href='/notes/new'
        >
          <BsPencilSquare size={17} />
          <span className='ms-2 fw-bold'>Create a new note</span>
        </ListGroup.Item>
        {notes.map(({ noteId, content, createdAt }) => (
          <ListGroup.Item
            action
            className='text-nowrap text-truncate'
            href={`/notes/${noteId ?? ''}`}
            key={noteId}
          >
            <span className='fw-bold'>{content.trim().split('\n')[0]}</span>
            <br />
            <span className='text-muted'>Created: {formatDate(createdAt)}</span>
          </ListGroup.Item>
        ))}
      </>
    );
  }

  function renderLander() {
    return (
      <div className='lander'>
        <h1>Scratch</h1>
        <p className='text-muted'>A simple note taking app</p>
      </div>
    );
  }

  function renderNotes() {
    return (
      <div className='notes'>
        <h2 className='pb-3 mt-4 mb-3 border-bottom'>Your Notes</h2>
        <ListGroup>{!isLoading && renderNotesList(notes)}</ListGroup>
      </div>
    );
  }

  return (
    <div className='Home'>
      {isAuthenticated ? renderNotes() : renderLander()}
    </div>
  );
}
