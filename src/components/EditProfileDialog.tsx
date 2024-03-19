'use client';

import { useEffect, useState } from 'react';
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
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '@/firebase';
import { User } from '@/types/user-type';
import { getCookie } from 'cookies-next';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Pencil, X } from 'lucide-react';
import { updateProfile } from '@/utils/api';
import { useToast } from './ui/use-toast';
import { useRouter } from 'next/navigation';

interface EditProfileDialogProps {
  currentUser: User;
}

const formSchema = z.object({
  name: z
    .string()
    .min(6, { message: 'Username must be at least 6 characters' }),
  image: z.any().optional(),
});

type FormSchema = z.infer<typeof formSchema>;

export default function EditProfileDialog({
  currentUser,
}: EditProfileDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });

  const [userId, setUserID] = useState(String);
  const [selectedImage, setSelectedImage] = useState<string>();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const user_id = getCookie('user_id');
    if (user_id) setUserID(user_id);
  }, []);

  if (!userId) return null;

  async function handleEditProfile({ name, image }: FormSchema) {
    const newName = name !== currentUser.name ? name : undefined;

    if (newName === undefined && (image === undefined || image.length === 0))
      return;

    if (image !== undefined && image.length > 0) {
      const profileImage = image[0];
      const storageRef = ref(storage, `${userId}`);
      await uploadBytesResumable(storageRef, profileImage);
      const downloadUrl = await getDownloadURL(storageRef);

      if (newName !== undefined) {
        await updateProfile(currentUser, {
          name: newName,
          photoURL: downloadUrl,
        });
      } else {
        await updateProfile(currentUser, { photoURL: downloadUrl });
      }
    } else await updateProfile(currentUser, { name: newName });

    setOpen(false);
    router.refresh();
    setSelectedImage(undefined);
    toast({
      title: 'Profile Updated',
      description: 'Your digital identity shines brighter than ever! ✨',
      variant: 'edit',
      action: (
        <div className='bg-slate/20 p-2 rounded-md w-fit'>
          <Check
            size={24}
            className='bg-slate text-midnight p-1 rounded-full'
          />
        </div>
      ),
    });
  }
  function handleImageChange(e: any) {
    if (e.target && e.target.files && e.target.files.length > 0) {
      const preview = e.target.files[0];
      setSelectedImage(URL.createObjectURL(preview));
    }
  }
  const { name, photoURL } = currentUser;
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className='w-full rounded-sm text-sm items-center hover:bg-midnight px-3 py-1 flex justify-between'>
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
                src={selectedImage || photoURL}
                width={160}
                height={160}
                alt={name[0].toUpperCase()}
              />
            </Label>
            <Input
              {...register('image')}
              {...(onchange = (e) => handleImageChange(e))}
              type='file'
              className='hidden'
              id='image-input'
              accept='image/png, image/jpeg'
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label className='text-right text-base'>Name</Label>
            <Input
              {...register('name')}
              className='col-span-3 bg-black invalid:focus:outline-red-600'
              required
              defaultValue={name}
              minLength={4}
            />
          </div>
          <DialogFooter className='mt-4'>
            <Button disabled={isSubmitting} type='submit'>
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
