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
import { CustomForm } from './Form';
import { Input } from './ui/input';
import LogoImage from '../../public/assets/logo.svg';
import { AuthError, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase';
import { getCookie, setCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import { useToast } from './ui/use-toast';
import { X } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email({
    message: 'E-mail must be valid',
  }),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters',
  }),
});

export default function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { email, password } = values;
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);

      const { uid } = response.user;
      if (uid) {
        setCookie('user_id', response.user.uid);
        if (getCookie('user_id')) {
          router.refresh();
        }
      }
    } catch (e) {
      const error = e as AuthError;
      if (error.code === 'auth/invalid-login-credentials') {
        toast({
          title: 'Login Failed',
          description:
            'Uh-oh! It seems there was a hiccup. Double-check your email and password and try again.',
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
    }
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
          disableWhen={isSubmitting}
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
        <CustomForm.Button disableWhen={isSubmitting} title='Login' />
        <CustomForm.Redirect
          disableWhen={isSubmitting}
          text='Not registered yet?'
          path='/register'
          link='Create an account'
        />
      </form>
    </Form>
  );
}
