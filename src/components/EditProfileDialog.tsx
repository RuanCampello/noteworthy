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
import { Label } from './ui/label';
import Image from 'next/image';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Pencil, X } from 'lucide-react';
import { useToast } from './ui/use-toast';
import { useSession } from 'next-auth/react';
import { uploadImage } from '@/actions/user';
import { uploadUserProfileImage } from '@/data/user';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  name: z
    .string()
    .min(6, { message: 'Username must be at least 6 characters' }),
  image: z.any().optional(),
});

type FormSchema = z.infer<typeof formSchema>;

export default function EditProfileDialog() {
  const { register, handleSubmit } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });

  const [selectedImage, setSelectedImage] = useState<string>();
  const [loading, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const session = useSession();
  const user = session.data?.user;
  const { toast } = useToast();

  if (!user) return;

  async function handleEditProfile({ name, image }: FormSchema) {
    startTransition(async () => {
      if (!user?.id || !user.name || !image) return;
      const url = await uploadImage(image[0], user.name);
      await uploadUserProfileImage(url, user.id);
      //force reload to prevent nextjs image cache
      if (!(typeof window === 'undefined')) window.location.reload();
    });
  }

  function handleImageChange(e: any) {
    if (e.target && e.target.files && e.target.files.length > 0) {
      const preview = e.target.files[0];
      setSelectedImage(URL.createObjectURL(preview));
    }
  }

  const { name, image } = user;
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className='w-full select-none rounded-sm text-sm items-center hover:bg-midnight px-3 py-1 flex justify-between cursor-pointer'>
          Edit profile
          <Pencil size={16} className='text-neutral-400' />
        </div>
      </DialogTrigger>
      <DialogContent className='dark bg-black w-96'>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleEditProfile)}>
          <div className='flex justify-center mb-6'>
            <Label
              htmlFor='image-input'
              className='text-center cursor-pointer relative'
            >
              {selectedImage && (
                <button
                  type='button'
                  className='absolute -right-2 -top-2 bg-slate border p-1 rounded-full'
                  onClick={() => setSelectedImage(undefined)}
                >
                  <X size={16} />
                </button>
              )}
              <Image
                className='bg-slate hover:bg-slate/80 hover:text-silver transition-colors ease-in-out rounded-lg text-4xl font-semibold text-center items-center w-20 h-20 shrink-0 object-cover flex justify-center'
                src={selectedImage || image || ''}
                width={160}
                height={160}
                alt={(name && name[0].toUpperCase()) || ''}
              />
            </Label>
            <Input
              {...register('image')}
              {...(onchange = (e) => handleImageChange(e))}
              type='file'
              className='hidden'
              id='image-input'
              accept='image/png, image/jpeg'
              disabled={loading}
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label className='text-right text-base'>Name</Label>
            <Input
              {...register('name')}
              className='col-span-3 bg-black invalid:focus:outline-red-600'
              required
              defaultValue={name || ''}
              disabled={loading}
            />
          </div>
          <DialogFooter className='mt-4'>
            <Button
              size='sm'
              disabled={loading}
              type='submit'
              className='flex items-center gap-2'
            >
              Save changes
              {loading && <Loader2 size={16} className='animate-spin' />}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
