import { getUserWithPreferences } from '@/actions';
import SettingsDialog from '@/components/Profile/SettingsDialog';
import Counter from '@/components/Sidebar/Counter';
import MenuItem from '@/components/Sidebar/MenuItem';
import SectionTitle from '@/components/Sidebar/SectionTitle';
import { Colours } from '@/utils/colours';
import { Archive, Settings, Star, LayoutDashboard } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

export default async function Menu() {
  const favouriteColour = Colours['sunset'];
  const archiveColour = Colours['cambridge'];
  const settingsColour = Colours['cambridge'];

  const t = await getTranslations('Sidebar');

  const { preferences } = await getUserWithPreferences();
  console.log('preferences: ', preferences);

  return (
    <section className='group/root'>
      <SectionTitle title={t('more')} />
      <div className='font-semibold flex flex-col'>
        <Link href='/hub' className='focus:outline-none'>
          <MenuItem
            colour={Colours['slate']}
            name={t('hub')}
            path='hub'
            icon={<LayoutDashboard />}
          />
        </Link>
        <Link href='/favourites' className='focus:outline-none'>
          <MenuItem
            colour={favouriteColour}
            path={'favourites'}
            name={t('favourites')}
            icon={<Star />}
          >
            <Counter isFavourite />
          </MenuItem>
        </Link>
        <Link href='/archived' className='focus:outline-none'>
          <MenuItem
            colour={archiveColour}
            path={'archived'}
            name={t('archived')}
            icon={<Archive />}
          >
            <Counter isArchived />
          </MenuItem>
        </Link>
        <SettingsDialog preferences={preferences}>
          <MenuItem
            colour={settingsColour}
            name={t('settings')}
            icon={<Settings />}
          />
        </SettingsDialog>
      </div>
    </section>
  );
}
