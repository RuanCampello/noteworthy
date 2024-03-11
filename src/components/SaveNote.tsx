'use client';
import { Check, Save } from 'lucide-react';
import MenuTooltip from './Tooltip';
import { useCurrentEditor } from '@tiptap/react';
import { getCookie } from 'cookies-next';
import { useState } from 'react';
import { OverrideNote } from '@/utils/api';
import { usePathname } from 'next/navigation';
import { useToast } from './ui/use-toast';
import { getCollection } from '@/utils/get-navigation-info';
export default function SaveNote() {
  const currentEditor = useCurrentEditor();
  const pathname = usePathname();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const user_id = getCookie('user_id');
  const openNote = getCookie('open_note');
  if (!currentEditor) return;
  const collection = getCollection(pathname)

  async function handleSave() {
    const currentContent = currentEditor.editor?.getHTML();
    if (!user_id || !openNote || !currentContent) return;
    setLoading(true);
    await OverrideNote(user_id, openNote, collection, {
      content: currentContent,
    });
    setLoading(false);
    toast({
      title: 'Note Saved',
      description:
        "Your note has been saved! It's ready whenever you need it. 📌",
      variant: 'success',
      action: (
        <div className='bg-blue/20 p-2 rounded-md w-fit'>
          <Check size={24} className='bg-blue text-midnight p-1 rounded-full' />
        </div>
      ),
    });
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
