'use client';

import { updateNoteContent } from '@/actions/note';
import { useCurrentEditor } from '@tiptap/react';
import { Check, Save } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useTransition } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import MenuTooltip from '../Tooltip';
import { useToast } from '../ui/use-toast';

export default function SaveNote() {
  const currentEditor = useCurrentEditor();
  const { toast } = useToast();
  const [loading, startTransition] = useTransition();
  const t = useTranslations('SaveButton');
  const tt = useTranslations('Toast');

  const openNote = useParams<{ id: string }>().id;
  useHotkeys('ctrl+s', () => handleSaveClick(), {
    preventDefault: true,
    enableOnFormTags: true,
    enableOnContentEditable: true,
  });

  if (!currentEditor) return;

  async function handleSaveClick() {
    startTransition(async () => {
      if (!openNote || !currentEditor.editor) return;
      await updateNoteContent(openNote, currentEditor.editor.getHTML());
      toast({
        title: tt('sv_note_title'),
        description: tt('sv_note_dsc'),
        variant: 'success',
        action: (
          <div className='bg-blue/20 p-2 rounded-md w-fit'>
            <Check
              size={24}
              className='bg-blue text-midnight p-1 rounded-full'
            />
          </div>
        ),
      });
    });
  }
  return (
    <MenuTooltip content={`${t('title')} (Ctrl+S)`} sideOffset={8}>
      <form action={handleSaveClick}>
        <button
          type='submit'
          disabled={loading}
          onClick={handleSaveClick}
          className='text-silver hover:text-neutral-200 hover:border-neutral-100 h-fit focus:outline-offset-2 p-2 border-2 border-silver rounded-full disabled:animate-pulse'
        >
          <Save size={18} strokeWidth={2.3} />
        </button>
      </form>
    </MenuTooltip>
  );
}
