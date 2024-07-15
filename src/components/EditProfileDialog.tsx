'use client';

import { useState, useTransition } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { z } from 'zod';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Pencil, X } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { CustomForm } from './Form';
import Compressor from 'compressorjs';
import { getUploadUrl } from '@/actions/image';
import { DropdownMenuShortcut } from './ui/dropdown-menu';

const formSchema = z.object({
  name: z
    .string()
    .min(6, { message: 'Username must be at least 6 characters' }),
  image: z.any().optional(),
});

type FormSchema = z.infer<typeof formSchema>;

export default function EditProfileDialog() {
  const [selectedImage, setSelectedImage] = useState<string>();
  const [loading, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const { data: session, update } = useSession();
  const router = useRouter();
  const user = session?.user;

  const editProfileForm = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || '',
    },
  });

  const currentName = useWatch({
    control: editProfileForm.control,
    name: 'name',
  });

  if (!user) return;

  async function handleEditProfile({ name, image }: FormSchema) {
    startTransition(async () => {
      if (!user?.id || isOAuthImage) return;

      if (name !== user.name) {
        await update({ name: currentName });
      }
      if (image && image[0]) {
        new Compressor(image[0], {
          maxHeight: 72,
          maxWidth: 72,
          quality: 0.8,
          async success(result: File) {
            if (!user.id) return;

            const uploadUrl = await getUploadUrl(user.id, result.type);
            await fetch(uploadUrl, {
              method: 'PUT',
              body: result,
            });
            if (typeof window !== 'undefined') {
              window.location.reload();
            }
          },
        });
      }
      setOpen(false);
      setSelectedImage(undefined);
      router.refresh();
    });
  }

  function handleImageChange(e: any) {
    if (e.target && e.target.files && e.target.files.length > 0) {
      const preview = e.target.files[0];
      setSelectedImage(URL.createObjectURL(preview));
    }
  }

  const { name, image, id } = user;

  const isOAuthImage =
    image?.includes('https://avatars.githubusercontent.com') ||
    image?.includes('https://lh3.googleusercontent.com');
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='dropdown' size='xs'>
          Profile
          <DropdownMenuShortcut>
            <Pencil size={16} />
          </DropdownMenuShortcut>
        </Button>
      </DialogTrigger>
      <DialogContent className='dark bg-black w-96'>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <Form {...editProfileForm}>
          <form
            className='flex flex-col gap-3'
            onSubmit={editProfileForm.handleSubmit(handleEditProfile)}
          >
            <FormField
              control={editProfileForm.control}
              name='image'
              render={({ field }) => (
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
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className='bg-slate hover:bg-slate/80 hover:text-silver transition-colors ease-in-out rounded-lg text-4xl font-semibold text-center items-center w-20 h-20 shrink-0 object-cover flex justify-center'
                      src={
                        selectedImage ||
                        image ||
                        `${process.env.NEXT_PUBLIC_CLOUDFLARE_DEV_URL}/${id}` ||
                        ''
                      }
                      loading='lazy'
                      alt={(name && name[0].toUpperCase()) || ''}
                    />
                  </FormLabel>
                  <FormControl>
                    <CustomForm.Input
                      {...editProfileForm.register('image')}
                      {...(onchange = (e) => handleImageChange(e))}
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
                      Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        type='text'
                        className='bg-black dark col-span-3 focus:outline focus:ring-transparent'
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className='mt-4'>
              <Button
                size='sm'
                disabled={
                  loading ||
                  (currentName === name && selectedImage === undefined)
                }
                type='submit'
                className='flex items-center gap-1'
              >
                Save changes
                {loading && <Loader2 size={16} className='animate-spin' />}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
