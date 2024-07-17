import SectionTitle from '@/components/SectionTitle';
import MoreItem from '@/components/MoreItem';
import Counter from '@/components/Counter';
import { Colours } from '@/utils/colours';
import { useSidebarState } from '@/utils/sidebar';

export default function More() {
  const favouriteColour = Colours['sunset'];
  const archiveColour = Colours['cambridge'];

  const state = useSidebarState();
  return (
    <div className='group/root' data-state={state}>
      <SectionTitle title='More' />
      <div className='font-semibold flex flex-col'>
        <MoreItem
          colour={favouriteColour}
          href='/favourites'
          name='Favourites'
          icon={'star'}
        >
          <Counter isFavourite />
        </MoreItem>
        <MoreItem
          colour={archiveColour}
          href='/archived'
          name='Archived Notes'
          icon={'archive'}
        >
          <Counter isArchived />
        </MoreItem>
      </div>
    </div>
  );
}
