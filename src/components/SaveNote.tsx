'use client';
import { Save } from 'lucide-react';
import MenuTooltip from './Tooltip';
import { useCurrentEditor } from '@tiptap/react';
import { getCookie } from 'cookies-next';
import { useState } from 'react';
import { Collections, OverrideNote } from '@/utils/api';
import { usePathname } from 'next/navigation';

export default function SaveNote() {
  const currentEditor = useCurrentEditor();
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const user_id = getCookie('user_id');
  const openNote = getCookie('open_note');
  if (!currentEditor) return;
  const collection: Collections = pathname.includes('/favourites/')
    ? 'userFavourites'
    : pathname.includes('/notes/')
    ? 'userNotes'
    : 'userArchived';

  async function handleSave() {
    const currentContent = currentEditor.editor?.getHTML();
    if (!user_id || !openNote || !currentContent) return;
    setLoading(true);
    await OverrideNote(user_id, openNote, collection, {
      content: currentContent,
    });
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
