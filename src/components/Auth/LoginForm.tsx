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
import GoogleLogo from '@/assets/third-part-login/Google.png';
import GithubLogo from '@/assets/third-part-login/GitHub.svg';
import { useToast } from '../ui/use-toast';
import { X } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Button } from '../ui/button';
import Link from 'next/link';

type LoginFormSchema = z.infer<typeof loginFormSchema>;

export default function LoginForm() {
  const [isPending, startTransition] = useTransition();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
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
          <div>
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='font-semibold'>Password</FormLabel>
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
            <Button
              variant='link'
              className='dark px-0 self-start text-neutral-300 underline-offset-2 focus:outline-none'
              asChild
              size='sm'
            >
              <Link href='/reset'>Forgot password?</Link>
            </Button>
          </div>
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
