'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { CustomForm } from './Form';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';
import LogoImage from '../../public/assets/logo.svg';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase';
import {
  AuthError,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { getRandomColour } from '@/utils/colours';
import { helloWorld } from '@/utils/hello-world';
import { useRouter } from 'next/navigation';
import { addNote, checkUsernameAvailability } from '@/utils/api';
import { setCookie } from 'cookies-next';
import { useToast } from './ui/use-toast';
import { X } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email({
    message: 'E-mail must be valid',
  }),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters',
  }),
  username: z.string().min(6, {
    message: 'Username must be at least 6 characters',
  }),
});

export default function RegisterForm() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { username, email, password } = values;

    const isUsernameAvailable = await checkUsernameAvailability(username);
    if (isUsernameAvailable) {
      try {
        const response = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        await updateProfile(response.user, {
          displayName: username,
        });
        await setDoc(doc(db, 'users', response.user.uid), {
          uid: response.user.uid,
          name: response.user.displayName,
          email: response.user.email,
        });
        await setDoc(doc(db, 'userNotes', response.user.uid), {});
        await addNote({
          userId: response.user.uid,
          title: 'Hello world!',
          content: helloWorld,
          owner: 'RuanCampello',
          colour: getRandomColour().name,
        });
        await setDoc(doc(db, 'userFavourites', response.user.uid), {});
        await setDoc(doc(db, 'userArchived', response.user.uid), {});
        setCookie('user_id', response.user.uid);
        router.push('/');
      } catch (e) {
        const error = e as AuthError;
        if (error.code === 'auth/email-already-in-use') {
          toast({
            title: 'E-mail Unavailable',
            description:
              "Oops! It seems like the e-mail you're trying to use is already taken.",
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
    } else {
      toast({
        title: 'Name Unavailable',
        description:
          "Oops! It seems like the name you're trying to use is already taken.",
        variant: 'error',
        action: (
          <div className='bg-tickle/20 p-2 rounded-md w-fit'>
            <X size={24} className='bg-tickle text-midnight p-1 rounded-full' />
          </div>
        ),
      });
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
          title='Sign Up'
          subtitle='Unique annotations 🌟'
        />
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
