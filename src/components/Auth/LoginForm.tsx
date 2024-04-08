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
        className='rounded-md w-[380px]'
      >
        <CustomForm.Header image={LogoImage} />
        <CustomForm.ThirdPartLogin
          disableWhen={isPending}
          type='login'
          image={
            'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/2048px-Google_%22G%22_logo.svg.png'
          }
          name='Google'
        />
        <CustomForm.ThirdPartLogin
          disableWhen={isPending}
          type='login'
          image={
            'https://upload.wikimedia.org/wikipedia/commons/c/c2/GitHub_Invertocat_Logo.svg'
          }
          name='Github'
        />
        <CustomForm.Separator />
        <div className='gap-3 flex flex-col mb-10'>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='font-semibold'>
                  E-mail
                </FormLabel>
                <FormControl>
                  <Input
                    type='email'
                    placeholder='johnsmith@example.com'
                    className='placeholder:text-midnight/50 placeholder:font-medium h-11 text-base bg-neutral-200 text-midnight'
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
                <FormLabel className='font-semibold'>
                  Password
                </FormLabel>
                <FormControl>
                  <Input
                    type='password'
                    placeholder='•••••••'
                    className='placeholder:text-midnight/50 placeholder:font-medium bg-neutral-200 h-11 text-base text-midnight'
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
