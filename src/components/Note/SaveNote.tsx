'use client';
import { Check, Save } from 'lucide-react';
import MenuTooltip from '../Tooltip';
import { useCurrentEditor } from '@tiptap/react';
import { useTransition } from 'react';
import { useToast } from '../ui/use-toast';
import { updateNoteContent } from '@/data/note';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';

export default function SaveNote() {
  const currentEditor = useCurrentEditor();
  const { toast } = useToast();
  const [loading, startTransition] = useTransition();
  const session = useSession();
  const userId = session.data?.user?.id;

  const openNote = useParams<{ id: string }>().id;

  if (!currentEditor) return;

  async function handleSaveClick() {
    startTransition(async () => {
      if (!userId || !openNote || !currentEditor.editor) return;
      await updateNoteContent(
        openNote,
        userId,
        currentEditor.editor?.getHTML()
      );
      toast({
        title: 'Note Saved',
        description:
          "Your note has been saved! It's ready whenever you need it. 📌",
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
    <MenuTooltip content='Save changes (Ctrl+S)' sideOffset={8}>
      <form action={handleSaveClick}>
        <button
          type='submit'
          disabled={loading}
          onClick={handleSaveClick}
          className='text-silver h-fit focus:outline-offset-2 p-2 border-2 border-silver rounded-full disabled:animate-pulse'
        >
          <Save size={22} strokeWidth={2} />
        </button>
      </form>
    </MenuTooltip>
  );
}
