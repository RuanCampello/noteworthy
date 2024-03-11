'use client';
import { Save } from 'lucide-react';
import MenuTooltip from './Tooltip';
import { useCurrentEditor } from '@tiptap/react';
import { getCookie } from 'cookies-next';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { NoteType } from '@/types/note-type';
import { useState } from 'react';

export default function SaveNote() {
  const currentEditor = useCurrentEditor();
  const [loading, setLoading] = useState(false);
  const user_id = getCookie('user_id');
  const openNote = getCookie('open_note');
  if (!currentEditor) return;

  async function handleSave() {
    const currentContent = currentEditor.editor?.getHTML();
    if (!user_id || !openNote || !currentContent) return;
    setLoading(true);
    const response = await getDoc(doc(db, 'userNotes', user_id));
    const data = response.data();
    if (!data) return;
    const notes: NoteType[] = data['notes'];
    if (!notes) return;
    const note = notes.find((note) => note.uid === openNote);
    if (!note) return;
    const { uid, date, colour, owner, title } = note;
    const updatedNotes = notes.filter((note) => note.uid !== openNote);
    updatedNotes.push({
      uid: uid,
      date: date,
      owner: owner,
      colour: colour,
      title: title,
      content: currentContent,
    });
    await setDoc(doc(db, 'userNotes', user_id), { notes: updatedNotes });
    setLoading(false);
  }
  return (
    <MenuTooltip content='Save changes' sideOffset={8}>
      <button
        disabled={loading}
        onClick={handleSave}
        className='text-silver h-fit p-2 border-2 border-silver rounded-full disabled:animate-pulse'
      >
        <Save size={22} strokeWidth={2} />
      </button>
    </MenuTooltip>
  );
}
