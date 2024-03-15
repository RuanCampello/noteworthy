import { cookies } from 'next/headers';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { db } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';

import { Bolt } from 'lucide-react';
import EditProfileDialog from './EditProfileDialog';
import { User } from '@/types/user-type';

export default async function Profile() {
  const user_id = cookies().get('user_id')?.value;
  if (!user_id) return null;

  const user = (await getDoc(doc(db, 'users', user_id))).data() as User;
  const { name, email, photoURL } = user;

  return (
    <div className='mt-auto p-5 ps-4 bg-midnight rounded-md m-1'>
      <div className='flex gap-4 items-center'>
        <Avatar className='dark'>
          <AvatarImage src={photoURL} />
          <AvatarFallback className='bg-slate font-semibold text-neutral-100'>
            {name[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className='flex flex-col gap-1'>
          <h1 className='text-lg leading-none font-semibold trucate'>{name}</h1>
          <h2 className='text-silver leading-none truncate'>{email}</h2>
        </div>
        <EditProfileDialog currentUser={user}>
          <Bolt className='text-silver ms-auto cursor-pointer' />
        </EditProfileDialog>
      </div>
    </div>
  );
}
