import SectionTitle from './SectionTitle';
import MoreItem from './MoreItem';
import Counter from './Counter';
import { Colours } from '@/utils/colours';

export default function More() {
  const favouriteColour = Colours['sunset'];
  const archiveColour = Colours['cambridge'];
  return (
    <div>
      <SectionTitle title='More' />
      <div className='font-semibold flex flex-col'>
        <MoreItem
          colour={favouriteColour}
          href='/favourites'
          name='Favourites'
          icon={'star'}
        >
          <Counter />
        </MoreItem>
        <MoreItem
          colour={archiveColour}
          href='/archived'
          name='Archived Notes'
          icon={'archive'}
        >
          <Counter />
        </MoreItem>
      </div>
    </div>
  );
}
