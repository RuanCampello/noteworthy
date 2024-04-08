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
import LogoImage from '@assets/logo.svg';
import { login } from '@/actions/login';
import { useTransition } from 'react';
import { loginFormSchema } from '@/schemas';

import GoogleLogo from '@assets/third-part-login/Google.png';
import GithubLogo from '@assets/third-part-login/GitHub.svg';

type LoginFormSchema = z.infer<typeof loginFormSchema>;

export default function LoginForm() {
  const [isPending, startTransition] = useTransition();
  const form = useForm<LoginFormSchema>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: LoginFormSchema) {
    startTransition(() => {
      login(values);
    });
  }

  const inputStyle =
    'placeholder:text-midnight/50 placeholder:font-medium bg-neutral-200 h-11 text-base text-midnight focus-visible:ring focus-visible:ring-tickle border-none ring-offset-tickle';

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='rounded-md w-[380px]'
      >
        <CustomForm.Header image={LogoImage} />
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
