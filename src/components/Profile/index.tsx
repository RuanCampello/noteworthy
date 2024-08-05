import { Bolt, LogOut } from 'lucide-react';
import {
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu';
import { signOut } from '@/auth/auth';
import { env } from '@/env';
import { currentUser } from '@/server/queries/note';
import { useSidebarState } from '@/utils/sidebar';
import KeyboardDialog from './KeyboardDialog';
import SettingsDialog from './SettingsDialog';
import { getUserPreferences } from '@/server/actions/user-preferences';
import { getTranslations } from 'next-intl/server';
import Menu from './Menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/ui/avatar';

export default async function Profile() {
  const user = await currentUser();
  const state = useSidebarState();
  const t = await getTranslations('ProfileDropdown');
  if (!user || !user?.id) return;

  const { image, name, email, id } = user;
  const preferences = await getUserPreferences(id);
  if (!name) return null;

  async function handleLogout() {
    'use server';
    await signOut();
  }

  const source =
    image ||
    `${env.NEXT_PUBLIC_CLOUDFLARE_DEV_URL}/${user.id}?${new Date().getTime()}`;
  const fallback = name[0].toUpperCase();

  return (
    <div
      data-state={state}
      className='mt-auto data-[state=closed]:p-2 p-5 md:ps-4 data-[state=open]:bg-midnight relative rounded-md m-1 select-none'
    >
      <div className='flex justify-center xl:gap-4 md:gap-2 items-center w-full'>
        <Avatar>
          <AvatarImage className='object-cover' src={source} />
          <AvatarFallback className='bg-slate font-semibold'>
            {fallback}
          </AvatarFallback>
        </Avatar>
        <div className='overflow-hidden md:inline hidden group-data-[state=closed]/root:hidden'>
          <h2 className='text-lg leading-none font-semibold trucate'>{name}</h2>
          <h2 className='text-silver leading-none truncate'>{email}</h2>
        </div>
        <Menu>
          <DropdownMenuTrigger asChild>
            <Bolt className='text-silver shrink-0 ms-auto cursor-pointer lg:inline hidden group-data-[state=closed]/root:hidden' />
          </DropdownMenuTrigger>
          <DropdownMenuContent className='dark bg-black w-44'>
            <div className='flex flex-col gap-1'>
              <SettingsDialog preferences={preferences} />
              <KeyboardDialog />
            </div>
            <DropdownMenuSeparator />
            <form id='logout' action={handleLogout}>
              <button
                form='logout'
                type='submit'
                className='w-full text-sm focus:outline-none text-start px-3 p-1 rounded-sm hover:bg-tickle hover:text-black hover:font-semibold group flex items-center'
              >
                {t('log_out')}
                <DropdownMenuShortcut>
                  <LogOut size={16} className='group-hover:text-black' />
                </DropdownMenuShortcut>
              </button>
            </form>
          </DropdownMenuContent>
        </Menu>
      </div>
    </div>
  );
}
