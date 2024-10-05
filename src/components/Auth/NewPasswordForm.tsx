'use client';

import { newPassword } from '@/actions';
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
import { newPasswordSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type NewPasswordSchema = z.infer<typeof newPasswordSchema>;

export default function NewPasswordForm() {
  const [loading, startTransition] = useTransition();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const router = useRouter();
  const t = useTranslations('NewPassword');

  const newPasswordForm = useForm<NewPasswordSchema>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      password: '',
    },
  });

  function handleReset(values: NewPasswordSchema) {
    startTransition(async () => {
      await newPassword(values, token);
      router.push('/login');
    });
  }

  return (
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
                <FormLabel className='font-semibold'>
                  {t('new_password')}
                </FormLabel>
                <FormControl>
                  <CustomForm.PasswordWrapper
                    value={isPasswordVisible}
                    onChange={() => setIsPasswordVisible(!isPasswordVisible)}
                  >
                    <Input
                      type={isPasswordVisible ? 'text' : 'password'}
                      placeholder='•••••••'
                      className='bg-midnight text-base border-none focus:ring-transparent'
                      {...field}
                    />
                  </CustomForm.PasswordWrapper>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <CustomForm.Button title={t('button')} disableWhen={loading} />
        </form>
      </Form>
      <CustomForm.Redirect text={t('return_to')} path='/login' link='Login' />
    </div>
  );
}
