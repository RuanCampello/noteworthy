'use client';

import { useFormStatus } from 'react-dom';
import { AlertDialogAction } from './ui/alert-dialog';

export default function DeleteNoteSubmit() {
  const { pending } = useFormStatus();
  return (
    <AlertDialogAction
    disabled={pending}
      name='button'
      type='submit'
      className='bg-red-600 focus:bg-red-700 hover:bg-red-700 active:bg-red-700 disabled:bg-red-800 text-neutral-200 font-bold'
    >
      Delete Note
    </AlertDialogAction>
  );
}
