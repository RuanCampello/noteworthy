import Resizable from '@/components/Resizable';

export default async function FavouritesPage() {
  return (
    <Resizable>
      <div className='flex h-full'>
        {/* <SubSidebar title='Favourites' notes={favouriteNotes}>
          <NoNotes
            headerIcon={<StarOff size={80} strokeWidth={1} />}
            text="You don't have any favourite note"
            paragraph='Choose a note to favourite and make it sparkle!'
            paragraphIcon={<Sparkles size={16} fill='#A3A3A3' />}
          />
        </SubSidebar>
        {favouriteNotes && favouriteNotes.length > 0  && (
          <Placeholder
            paragraph='Choose a favourite note from the list on the left to view its contents, or favourite a note to add to your collection.'
            text='Select a favourite note to view'
          >
            <Sparkles size={80} strokeWidth={1} />
          </Placeholder>
        )} */}
      </div>
    </Resizable>
  );
}
