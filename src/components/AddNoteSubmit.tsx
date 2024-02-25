'use client';

import { useFormStatus } from 'react-dom';

export default function AddNoteSubmit() {
  const { pending } = useFormStatus();
  return (
    <button
      className='p-2 px-3 bg-tiffany hover:bg-tiffany/90 disabled:bg-tiffany/40 focus:outline-2 focus:outline-white focus:outline focus:outline-offset-2 text-black transition-colors duration-200 font-medium rounded-lg'
      type='submit'
      disabled={pending}
    >
      Create Note
    </button>
  );
}
