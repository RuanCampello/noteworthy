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
} from './ui/form';
import { Input } from './ui/input';
import Image from 'next/image';
import { Separator } from './ui/separator';
import LogoImage from '../../public/assets/logo.svg';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email({
    message: 'E-mail must be valid',
  }),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters',
  }),
});

export default function LoginForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='rounded-md w-[420px]'
      >
        <div className='flex flex-col gap-3'>
          <div className='flex gap-2'>
            <Image
              alt='noteworthy logo'
              src={LogoImage}
              width={64}
              height={64}
            />
            <h1 className='text-6xl font-semibold'>Login</h1>
          </div>
          <h2 className='text-lg font-medium text-silver'>Welcome back 👋</h2>
        </div>
        <div className='mt-12 mb-10'>
          <button
            type='button'
            className='bg-neutral-200 hover:bg-neutral-300 transition-colors duration-200 font-semibold text-midnight p-3 w-full rounded-md flex items-center justify-center gap-4'
          >
            <Image
              width={32}
              height={32}
              src='https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/2048px-Google_%22G%22_logo.svg.png'
              alt='google logo'
            />
            Login with Google
          </button>
        </div>
        <div className='flex items-center justify-between text-white/40 text-medium mb-8'>
          <Separator className='w-[45%] bg-white/40' />
          <span>or</span>
          <Separator className='w-[45%] bg-white/40' />
        </div>
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
                    placeholder='johnsmith@gmail.com'
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
        <button
          type='submit'
          className='bg-tickle hover:bg-tickle/80 transition-colors duration-200 font-semibold text-midnight p-4 w-full rounded-md flex items-center justify-center'
        >
          Login
        </button>
        <div className='flex my-10 justify-center gap-1 text-neutral-400'>
          <span>Not registered yet?</span>
          <Link
            href='/register'
            className='text-tickle hover:underline underline-offset-2 flex items-center group'
          >
            Create an account <ArrowUpRight size={20} />
          </Link>
        </div>
      </form>
    </Form>
  );
}
