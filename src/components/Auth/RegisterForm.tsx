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
} from '../ui/form';
import { Input } from '../ui/input';
import LogoImage from '@assets/logo.svg';
import { useRouter } from 'next/navigation';
import { useToast } from '../ui/use-toast';
import { useEffect, useState, useTransition } from 'react';
import { registerFormSchema } from '@/schemas';
import { register } from '@/actions/register';

import GoogleLogo from '@assets/third-part-login/Google.png';
import GithubLogo from '@assets/third-part-login/GitHub.svg';
import { X } from 'lucide-react';

type RegisterFormSchema = z.infer<typeof registerFormSchema>;

export default function RegisterForm() {
  const { toast } = useToast();
  const [error, setError] = useState(String);
  const [isSubmitting, startTransition] = useTransition();

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
        <div className='gap-3 flex flex-col mb-10'>
          <FormField
            control={form.control}
            name='username'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='font-semibold'>Username</FormLabel>
                <FormControl>
                  <Input
                    type='text'
                    placeholder='johnsmith'
                    className={inputStyle}
                    {...field}
                  />
                </FormControl>
                <FormDescription className='text-white/60'>
                  This is your public display name.
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
        <CustomForm.Button disableWhen={isSubmitting} title='Register' />
        <CustomForm.Redirect
          disableWhen={isSubmitting}
          text='Have an account?'
          path='/login'
          link='Log in now'
        />
      </form>
    </Form>
  );
}
