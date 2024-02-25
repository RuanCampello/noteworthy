import SectionTitle from './SectionTitle';
import MoreItem from './MoreItem';
import Counter from './Counter';

export default function More() {
  return (
    <div>
      <SectionTitle title='More' />
      <div className='font-semibold flex flex-col'>
        <MoreItem href='/favourites' name='Favourites' icon={'star'}>
          <Counter type='userFavourites' />
        </MoreItem>
        <MoreItem href='/archived' name='Archived Notes' icon={'archive'}>
          <Counter type='userArchived' />
        </MoreItem>
      </div>
    </div>
  );
}
