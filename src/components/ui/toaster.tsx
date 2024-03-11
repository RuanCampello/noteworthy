'use client';

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast';
import { useToast } from '@/components/ui/use-toast';

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast
            duration={10000}
            className='dark bg-midnight border-l-[16px] border-r-0 border-y-0 justify-normal px-4'
            key={id}
            {...props}
          >
            {action}
            <div className='flex gap-4 items-center justify-between w-full'>
              <div className='grid gap-1'>
                {title && (
                  <ToastTitle className='text-lg leading-none'>
                    {title}
                  </ToastTitle>
                )}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
              <ToastClose />
            </div>
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
