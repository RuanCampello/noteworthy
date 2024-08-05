import SectionTitle from '@/components/SectionTitle';
import MoreItem from '@/components/MoreItem';
import Counter from '@/components/Counter';
import { Colours } from '@/utils/colours';
import { getTranslations } from 'next-intl/server';

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
      </div>
    </div>
  );
}
