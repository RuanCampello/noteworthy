/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { CustomForm } from '../Form';
import { Input } from '../ui/input';
import { login } from '@/actions/login';
import { useEffect, useState, useTransition } from 'react';
import { loginFormSchema } from '@/schemas';
import GoogleLogo from '@assets/third-part-login/Google.png';
import GithubLogo from '@assets/third-part-login/GitHub.svg';
import { useToast } from '../ui/use-toast';
import { X } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

type LoginFormSchema = z.infer<typeof loginFormSchema>;

export default function LoginForm() {
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const [error, setError] = useState(String);
  const { toast } = useToast();
  const form = useForm<LoginFormSchema>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: LoginFormSchema) {
    startTransition(async () => {
      const { error } = await login(values);
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
      }
    });
  }

  const emailError = searchParams.get('error') === 'OAuthAccountNotLinked';
  
  useEffect(() => {
    if (emailError) setError('E-mail already in use with another provider!');
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
  }, [emailError, error]);

  const inputStyle =
    'placeholder:text-midnight/50 placeholder:font-medium bg-neutral-200 h-11 text-base text-midnight focus-visible:ring focus-visible:ring-tickle border-none ring-offset-tickle';

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='rounded-md w-[380px]'
      >
        <CustomForm.Header />
        <CustomForm.ThirdPartLogin
          disableWhen={isPending}
          type='login'
          image={GoogleLogo}
          name='Google'
        />
        <CustomForm.ThirdPartLogin
          disableWhen={isPending}
          type='login'
          image={GithubLogo}
          name='Github'
        />
        <CustomForm.Separator />
        <div className='gap-3 flex flex-col mb-10'>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='font-semibold'>E-mail</FormLabel>
                <FormControl>
                  <Input
                    type='email'
                    placeholder='johnsmith@example.com'
                    className={inputStyle}
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
                <FormLabel className='font-semibold'>Password</FormLabel>
                <FormControl>
                  <Input
                    type='password'
                    placeholder='•••••••'
                    className={inputStyle}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <CustomForm.Button disableWhen={isPending} title='Login' />
        <CustomForm.Redirect
          disableWhen={isPending}
          text='Not registered yet?'
          path='/register'
          link='Create an account'
        />
      </form>
    </Form>
  );
}
