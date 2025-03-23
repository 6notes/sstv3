import { API } from 'aws-amplify';

import { isNoteType, NoteType } from '../types/note';

export async function loadNotes(): Promise<Array<NoteType>> {
  const notes: Array<NoteType> = [];
  const rawNotes = (await API.get('notes', '/notes', {})) as unknown;
  if (!Array.isArray(rawNotes)) {
    return [];
  }
  for (const rawNote of rawNotes) {
    if (isNoteType(rawNote)) {
      notes.push(rawNote);
    }
  }
  return notes;
}

export async function loadNote(
  id: string | undefined
): Promise<NoteType | null> {
  const rawNote = (await API.get('notes', `/notes/${id ?? ''}`, {})) as unknown;
  if (isNoteType(rawNote)) {
    return rawNote;
  }
  return null;
}
