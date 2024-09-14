/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { CustomForm } from '../Form';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/ui/form';
import { Input } from '@/ui/input';
import { useToast } from '@/ui/use-toast';
import { useEffect, useState, useTransition } from 'react';
import { registerFormSchema } from '@/schemas';
import { register } from '@/actions';

import GoogleLogo from '@/assets/third-part-login/Google.png';
import GithubLogo from '@/assets/third-part-login/GitHub.svg';
import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';

type RegisterFormSchema = z.infer<typeof registerFormSchema>;

export default function RegisterForm() {
  const { toast } = useToast();
  const [error, setError] = useState(String);
  const [isSubmitting, startTransition] = useTransition();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const t = useTranslations('Register');

  const form = useForm<RegisterFormSchema>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: RegisterFormSchema) {
    startTransition(async () => {
      const { error } = await register(values);
      if (error) setError(error);
    });
  }

  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: error,
        variant: 'error',
        action: (
          <div className='bg-tickle/20 p-2 rounded-md w-fit'>
            <X size={24} className='bg-tickle text-midnight p-1 rounded-full' />
          </div>
        ),
      });
    }
  }, [error]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='rounded-md w-[380px]'
      >
        <CustomForm.Header />
        <CustomForm.ThirdPartLogin
          disableWhen={isSubmitting}
          type='signup'
          image={GoogleLogo}
          name='Google'
        />
        <CustomForm.ThirdPartLogin
          disableWhen={isSubmitting}
          type='signup'
          image={GithubLogo}
          name='Github'
        />
        <CustomForm.Separator />
        <div className='gap-3 flex flex-col mb-8'>
          <FormField
            control={form.control}
            name='username'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='font-semibold'>{t('username')}</FormLabel>
                <FormControl>
                  <CustomForm.Input
                    type='text'
                    placeholder='johnsmith'
                    {...field}
                  />
                </FormControl>
                <FormDescription className='text-white/60'>
                  {t('username_dsc')}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='font-semibold'>E-mail</FormLabel>
                <FormControl>
                  <CustomForm.Input
                    type='email'
                    placeholder='johnsmith@example.com'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='font-semibold'>{t('password')}</FormLabel>
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
        </div>
        <CustomForm.Button disableWhen={isSubmitting} title={t('button')} />
        <CustomForm.Redirect
          disableWhen={isSubmitting}
          text={t('have_account')}
          path='/login'
          link={t('log_in')}
        />
      </form>
    </Form>
  );
}
