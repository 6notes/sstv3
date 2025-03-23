export interface NoteType {
  noteId?: string;
  content: string;
  createdAt?: string;
  attachment?: string;
  attachmentURL?: string;
}

export function isNoteType(note: unknown): note is NoteType {
  return typeof (note as NoteType).content !== 'undefined';
}
