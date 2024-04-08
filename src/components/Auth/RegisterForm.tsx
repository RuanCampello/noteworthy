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
import { useTransition } from 'react';
import { registerFormSchema } from '@/schemas';
import { register } from '@/actions/register';

type RegisterFormSchema = z.infer<typeof registerFormSchema>;

export default function RegisterForm() {
  const router = useRouter();
  const { toast } = useToast();
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
    startTransition(() => {
      register(values);
    });
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='rounded-md w-[420px]'
      >
        <CustomForm.Header image={LogoImage} />
        <CustomForm.ThirdPartLogin
          disableWhen={isSubmitting}
          type='signup'
          image={
            'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/2048px-Google_%22G%22_logo.svg.png'
          }
          name='Google'
        />
        <CustomForm.Separator />
        <div className='gap-6 flex flex-col mb-12'>
          <FormField
            control={form.control}
            name='username'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-lg text-neutral-200'>
                  Username
                </FormLabel>
                <FormControl>
                  <Input
                    type='text'
                    placeholder='johnsmith123'
                    className='placeholder:text-midnight/50 placeholder:font-medium bg-neutral-200 text-lg h-14 text-midnight'
                    {...field}
                  />
                </FormControl>
                <FormDescription className='text-base text-white/50'>
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
