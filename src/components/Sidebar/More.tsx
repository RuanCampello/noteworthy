import Counter from '@/components/Counter';
import FolderCollapsible from '@/components/Folder/FolderCollapsible';
import SectionTitle from '@/components/SectionTitle';
import { Colours } from '@/utils/colours';
import { getTranslations } from 'next-intl/server';
import MoreItem from './MoreItem';

export default async function More() {
  const favouriteColour = Colours['sunset'];
  const archiveColour = Colours['cambridge'];
  const t = await getTranslations('Sidebar');

  return (
    <div className='group/root'>
      <SectionTitle title={t('more')} />
      <div className='font-semibold flex flex-col'>
        <MoreItem
          colour={favouriteColour}
          href='/favourites'
          name={t('favourites')}
          icon={'star'}
        >
          <Counter isFavourite />
        </MoreItem>
        <MoreItem
          colour={archiveColour}
          href='/archived'
          name={t('archived')}
          icon={'archive'}
        >
          <Counter isArchived />
        </MoreItem>
        <FolderCollapsible />
      </div>
    </div>
  );
}
