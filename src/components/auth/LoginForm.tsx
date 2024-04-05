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
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='rounded-md w-[420px]'
      >
        <CustomForm.Header
          image={LogoImage}
          title='Login'
          subtitle='Welcome back 👋'
        />
        <CustomForm.ThirdPartLogin
          disableWhen={isPending}
          type='login'
          image={
            'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/2048px-Google_%22G%22_logo.svg.png'
          }
          name='Google'
        />
        <CustomForm.Separator />
        <div className='gap-8 flex flex-col mb-12'>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-lg text-neutral-200'>
                  E-mail
                </FormLabel>
                <FormControl>
                  <Input
                    type='email'
                    placeholder='johnsmith@example.com'
                    className='placeholder:text-midnight/50 placeholder:font-medium bg-neutral-200 text-lg h-14 text-midnight'
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
                <FormLabel className='text-lg text-neutral-200'>
                  Password
                </FormLabel>
                <FormControl>
                  <Input
                    type='password'
                    placeholder='•••••••'
                    className='placeholder:text-midnight/50 placeholder:font-medium bg-neutral-200 text-lg h-14 text-midnight'
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
