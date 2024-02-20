import SectionTitle from './SectionTitle';
import MoreItem from './MoreItem';

export default function More() {
  return (
    <div>
      <SectionTitle title='More' />
      <div className='font-semibold flex flex-col'>
        <MoreItem href='/favourites' name='Favourites' icon={'star'} />
        <MoreItem href='/archived' name='Archived Notes' icon={'archive'} />
      </div>
    </div>
  );
}
