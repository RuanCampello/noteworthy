'use client';

import { resetPassword } from '@/actions/reset-password';
import { CustomForm } from '@/components/Form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from '@/components/ui/use-toast';
import { resetPasswordSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Check, X } from 'lucide-react';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;

export default function ResetPage() {
  const [loading, startTransition] = useTransition();
  const resetPasswordForm = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  function handleReset(values: ResetPasswordSchema) {
    startTransition(async () => {
      const { error, success, message } = await resetPassword(values);
      if (error) {
        toast({
          title: 'Error',
          description: error,
          variant: 'error',
          action: (
            <div className='bg-tickle/20 p-2 rounded-md w-fit'>
              <X
                size={24}
                className='bg-tickle text-midnight p-1 rounded-full'
              />
            </div>
          ),
        });
      } else if(success) {
        toast({
          title: 'Success',
          description: success,
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
      } else if(message) {
        toast({
          title: 'A moment',
          description: message,
          variant: 'edit',
          action: (
            <div className='bg-slate/20 p-2 rounded-md w-fit'>
              <AlertCircle
                size={24}
                className='bg-slate text-midnight rounded-full p-0.5'
              />
            </div>
          ),
        });
      }
    });
  }

  return (
    <main className='w-screen h-screen overflow-hidden flex items-center justify-center'>
      <div className='w-[380px]'>
        <CustomForm.Header />
        <Form {...resetPasswordForm}>
          <form
            className='flex flex-col gap-8'
            onSubmit={resetPasswordForm.handleSubmit(handleReset)}
          >
            <FormField
              control={resetPasswordForm.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='font-semibold'>E-mail</FormLabel>
                  <FormControl>
                    <CustomForm.Input
                      type='email'
                      placeholder='johnsmith@gmail.com'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <CustomForm.Button title='Reset password' disableWhen={loading} />
          </form>
        </Form>
        <CustomForm.Redirect text='Return to' path='/login' link='Login' />
      </div>
    </main>
  );
}
