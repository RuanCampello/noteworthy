'use client';

import { getUserProfileImage, currentUser, uploadUserImage } from '@/actions';
import { CustomForm } from '@/components/Form';
import { useSettingsStore } from '@/lib/zustand/settings';
import { useSettingsDialogStore } from '@/lib/zustand/settings-dialog';
import { Button } from '@/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/ui/form';
import { Input } from '@/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, X } from 'lucide-react';
import type { User } from 'next-auth';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useState, useTransition, type ChangeEvent, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
  name: z
    .string()
    .min(6, { message: 'Username must be at least 6 characters' }),
  image: z.any().optional(),
});

type FormSchema = z.infer<typeof formSchema>;

export default function EditProfile() {
  const [selectedImage, setSelectedImage] = useState<string>();
  const [imageUrl, setImageUrl] = useState<string>();
  const [loading, startTransition] = useTransition();
  const { setOpen: setSettings } = useSettingsStore();
  const { setOpen: setSettingsDialog } = useSettingsDialogStore();
  const t = useTranslations('Profile');
  const [user, setUser] = useState<User>();

  useEffect(() => {
    startTransition(async () => {
      const [user, image] = await Promise.all([
        currentUser(),
        getUserProfileImage(),
      ]);
      setUser(user);
      image && setImageUrl(image);
    });
  }, []);

  useEffect(() => {
    if (user && user?.name) {
      editProfileForm.setValue('name', user.name);
    }
  }, [user]);

  const editProfileForm = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  });

  const currentName = useWatch({
    control: editProfileForm.control,
    name: 'name',
  });

  async function handleEditProfile({ name, image }: FormSchema) {
    startTransition(async () => {
      console.log('on transition');
      if (!isOAuthImage) {
        const formData = new FormData();
        if (image && image?.length > 0) {
          const file: File = image[0];
          formData.append('image', file);
        }
        formData.append('name', name);

        console.log('On handle');

        await uploadUserImage(formData);
        setSettings(false);
        setSettingsDialog(false);
      }
      setSelectedImage(undefined);
    });
  }

  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target && e.target.files && e.target.files.length > 0) {
      const preview = e.target.files[0];
      setSelectedImage(URL.createObjectURL(preview));
    }
  }

  if (!user) return;
  const { name, image } = user;

  const isOAuthImage =
    image?.includes('https://avatars.githubusercontent.com') ||
    image?.includes('https://lh3.googleusercontent.com');

  return (
    <Form {...editProfileForm}>
      <form
        id='update-user-profile'
        className='flex flex-col gap-4 w-96'
        onSubmit={editProfileForm.handleSubmit(handleEditProfile)}
      >
        <FormField
          control={editProfileForm.control}
          name='image'
          render={() => (
            <FormItem className='flex justify-center'>
              <FormLabel
                aria-disabled={isOAuthImage}
                htmlFor='image-input'
                className={`text-center relative ${
                  isOAuthImage ? 'cursor-not-allowed' : 'cursor-pointer'
                }`}
              >
                {selectedImage && !loading && (
                  <button
                    type='button'
                    disabled={loading}
                    className='absolute -right-2 -top-2 bg-slate border p-1 rounded-full'
                    onClick={() => setSelectedImage(undefined)}
                  >
                    <X size={16} />
                  </button>
                )}
                <div className='w-28 h-28 min-w-28 min-h-28 shrink-0 flex items-center justify-center'>
                  {!loading ? (
                    <Image
                      className='bg-slate hover:bg-slate/80 hover:text-silver transition-colors ease-in-out rounded-md text-4xl font-semibold text-center items-center w-full h-full shrink-0 object-cover flex justify-center'
                      width={128}
                      height={128}
                      src={selectedImage || image || imageUrl || ''}
                      alt={(name && name[0].toUpperCase()) || ''}
                    />
                  ) : (
                    <Loader2 size={32} className='animate-spin' />
                  )}
                </div>
              </FormLabel>
              <FormControl>
                <CustomForm.Input
                  {...(onchange = (e: Event) =>
                    handleImageChange(
                      e as unknown as ChangeEvent<HTMLInputElement>,
                    ))}
                  {...editProfileForm.register('image')}
                  type='file'
                  className='hidden'
                  id='image-input'
                  accept='image/png, image/jpeg'
                  disabled={loading || isOAuthImage}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={editProfileForm.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <div className='grid grid-cols-4 gap-4 items-center'>
                <FormLabel className='text-base text-neutral-200 text-right'>
                  {t('field_name')}
                </FormLabel>
                <FormControl>
                  <Input
                    type='text'
                    className='bg-black dark col-span-3 focus:outline focus:ring-transparent'
                    // defaultValue={user?.name!}
                    {...field}
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
      <footer className='mt-4 w-full'>
        <Button
          size='sm'
          form='update-user-profile'
          disabled={
            loading || (currentName === name && selectedImage === undefined)
          }
          type='submit'
          className='flex items-center gap-1 float-end'
        >
          {t('button')}
          {loading && <Loader2 size={16} className='animate-spin' />}
        </Button>
      </footer>
    </Form>
  );
}
