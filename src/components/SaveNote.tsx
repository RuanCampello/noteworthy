'use client';
import { Check, Save } from 'lucide-react';
import MenuTooltip from './Tooltip';
import { useCurrentEditor } from '@tiptap/react';
import { useState } from 'react';
import { saveNote } from '@/utils/api';
import { usePathname } from 'next/navigation';
import { useToast } from './ui/use-toast';
export default function SaveNote() {
  const currentEditor = useCurrentEditor();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  if (!currentEditor) return;

  async function handleSaveClick() {
    const currentContent = currentEditor.editor?.getHTML();
    if (!currentContent) return;
    setLoading(true);
    await saveNote(currentContent, pathname);
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
    <MenuTooltip content='Save changes (Ctrl+Alt+S)' sideOffset={8}>
      <button
        disabled={loading}
        onClick={handleSaveClick}
        className='text-silver h-fit p-2 border-2 border-silver rounded-full disabled:animate-pulse'
      >
        <Save size={22} strokeWidth={2} />
      </button>
    </MenuTooltip>
  );
}
