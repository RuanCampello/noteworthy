'use client';

import { newPassword } from '@/actions/new-password';
import { CustomForm } from '@/components/Form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { newPasswordSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, X } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type NewPasswordSchema = z.infer<typeof newPasswordSchema>;

export default function NewPasswordPage() {
  const [loading, startTransition] = useTransition();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const newPasswordForm = useForm<NewPasswordSchema>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      password: '',
    },
  });

  function handleReset(values: NewPasswordSchema) {
    startTransition(async () => {
      const { error, success } = await newPassword(values, token);
      // if (error) {
      //   toast({
      //     title: 'Error',
      //     description: error,
      //     variant: 'error',
      //     action: (
      //       <div className='bg-tickle/20 p-2 rounded-md w-fit'>
      //         <X
      //           size={24}
      //           className='bg-tickle text-midnight p-1 rounded-full'
      //         />
      //       </div>
      //     ),
      //   });
      // } else if (success) {
      //   toast({
      //     title: 'Success',
      //     description: success,
      //     variant: 'success',
      //     action: (
      //       <div className='bg-blue/20 p-2 rounded-md w-fit'>
      //         <Check
      //           size={24}
      //           className='bg-blue text-midnight p-1 rounded-full'
      //         />
      //       </div>
      //     ),
      //   });
      // }
    });
  }

  return (
    <main className='w-screen h-screen overflow-hidden flex items-center justify-center'>
      <div className='w-[380px]'>
        <CustomForm.Header />
        <Form {...newPasswordForm}>
          <form
            className='flex flex-col gap-8'
            onSubmit={newPasswordForm.handleSubmit(handleReset)}
          >
            <FormField
              control={newPasswordForm.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='font-semibold'>New Password</FormLabel>
                  <FormControl>
                    <CustomForm.PasswordWrapper
                      value={isPasswordVisible}
                      onChange={() => setIsPasswordVisible(!isPasswordVisible)}
                    >
                      <Input
                        type={isPasswordVisible ? 'text' : 'password'}
                        placeholder='•••••••'
                        className='bg-neutral-200 text-base border-none focus:ring-transparent'
                        {...field}
                      />
                    </CustomForm.PasswordWrapper>
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
