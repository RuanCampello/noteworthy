import { signOut } from '@/lib/auth-js/auth';
import { getUserWithPreferences } from '@/actions';
import { getUserProfileImage } from '@/actions';
import {
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu';
import { Bolt, LogOut } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Avatar } from './Avatar';
import KeyboardDialog from './KeyboardDialog';
import Menu from './Menu';
import SettingsDialog from './SettingsDialog';

export default async function Profile() {
  const t = await getTranslations('ProfileDropdown');

  const { user, preferences } = await getUserWithPreferences();
  if (!user || !user?.name) return null;

  async function handleLogout() {
    'use server';
    await signOut();
  }

  const imageUrl = await getUserProfileImage();
  // TODO: imagUrl loading on a client component but not on the server component in dev

  return (
    <div className='mt-auto group-data-[state=closed]/root:p-2 p-5 md:ps-4 group-data-[state=open]/root:bg-midnight relative rounded-md m-1 select-none'>
      <div className='flex justify-center xl:gap-4 md:gap-2 items-center w-full'>
        <Avatar source={imageUrl} fallback={user.name[0].toUpperCase()} />
        <div className='overflow-hidden md:inline hidden group-data-[state=closed]/root:hidden'>
          <h2 className='text-lg leading-none font-semibold trucate'>
            {user.name}
          </h2>
          <h2 className='text-silver leading-none truncate'>{user.email}</h2>
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
