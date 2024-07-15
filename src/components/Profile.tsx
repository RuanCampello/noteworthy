import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar';

import { Bolt, LogOut } from 'lucide-react';
import EditProfileDialog from '@/components/EditProfileDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu';
import { signOut } from '@/auth/auth';
import { env } from '@/env';
import { currentUser } from '@/server/queries/note';
import { useSidebarState } from '@/utils/sidebar';

export default async function Profile() {
  const user = await currentUser();
  const state = useSidebarState();
  if (!user) return;

  const { image, name, email, id } = user;
  if (!name) return null;

  async function handleLogout() {
    'use server';
    await signOut();
  }

  return (
    <div
      data-state={state}
      className='mt-auto data-[state=closed]:p-2 p-5 md:ps-4 data-[state=open]:bg-midnight relative rounded-md m-1 select-none'
    >
      <div className='flex justify-center xl:gap-4 md:gap-2 items-center w-full'>
        <Avatar className='dark'>
          <AvatarImage
            src={image || `${env.NEXT_PUBLIC_CLOUDFLARE_DEV_URL}/${id}` || ''}
          />
          <AvatarFallback className='bg-slate font-semibold text-neutral-100'>
            {name[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className='overflow-hidden md:inline hidden group-data-[state=closed]:hidden'>
          <h2 className='text-lg leading-none font-semibold trucate'>{name}</h2>
          <h2 className='text-silver leading-none truncate'>{email}</h2>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Bolt className='text-silver shrink-0 ms-auto cursor-pointer lg:inline hidden group-data-[state=closed]:hidden' />
          </DropdownMenuTrigger>
          <DropdownMenuContent className='dark bg-black'>
            <EditProfileDialog />
            <DropdownMenuSeparator />
            <form id='logout' action={handleLogout}>
              <button
                form='logout'
                type='submit'
                className='w-full text-sm focus:outline-none text-start px-3 p-1 rounded-sm hover:bg-tickle hover:text-black hover:font-semibold group flex items-center'
              >
                Log out
                <DropdownMenuShortcut>
                  <LogOut size={16} className='group-hover:text-black' />
                </DropdownMenuShortcut>
              </button>
            </form>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
