'use client';

import { ReactNode } from 'react';
import { useFormStatus } from 'react-dom';
import { Button, ButtonProps } from '@/ui/button';

interface SubmitButtonProps extends ButtonProps {
  children: ReactNode;
}

export default function SubmitButton({
  children,
  ...props
}: SubmitButtonProps) {
  const { pending } = useFormStatus();
  return (
    <Button
      disabled={pending}
      aria-disabled={pending}
      {...props}
    >
      {children}
    </Button>
  );
}
