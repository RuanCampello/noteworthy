'use client';

import { ReactNode } from 'react';
import { useFormStatus } from 'react-dom';

interface SubmitButtonProps {
  children: ReactNode;
}

export default function SubmitButton({ children }: SubmitButtonProps) {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      type='submit'
      className='w-full flex items-center gap-3 focus:outline-none group'
    >
      {children}
    </button>
  );
}
