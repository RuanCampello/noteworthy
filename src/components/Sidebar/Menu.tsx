import { getUserWithPreferences } from '@/actions';
import Counter from '@/components/Sidebar/Counter';
import MenuItem from '@/components/Sidebar/MenuItem';
import SectionTitle from '@/components/Sidebar/SectionTitle';
import SettingsDialog from '@/components/Profile/SettingsDialog';
import { Colours } from '@/utils/colours';
import { getTranslations } from 'next-intl/server';
import { headers } from 'next/headers';
import Link from 'next/link';

export default async function Menu() {
  const favouriteColour = Colours['sunset'];
  const archiveColour = Colours['cambridge'];
  const settingsColour = Colours['cambridge'];

  const t = await getTranslations('Sidebar');

  const pathname = headers().get('pathname');

  const { preferences } = await getUserWithPreferences();
  console.log('preferences: ', preferences);

  return (
    <section className='group/root'>
      <SectionTitle title={t('more')} />
      <div className='font-semibold flex flex-col'>
        <Link href='/favourites' className='focus:outline-none'>
          <MenuItem
            colour={favouriteColour}
            active={!!pathname?.includes('/favourites')}
            name={t('favourites')}
            icon={'star'}
          >
            <Counter isFavourite />
          </MenuItem>
        </Link>
        <Link href='/archived' className='focus:outline-none'>
          <MenuItem
            colour={archiveColour}
            active={!!pathname?.includes('/archived')}
            name={t('archived')}
            icon={'archive'}
          >
            <Counter isArchived />
          </MenuItem>
        </Link>
        <SettingsDialog preferences={preferences}>
          <MenuItem
            colour={settingsColour}
            name={t('settings')}
            icon={'settings'}
          />
        </SettingsDialog>
      </div>
    </section>
  );
}
