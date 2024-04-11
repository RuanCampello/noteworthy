import Note from './Note';
import SectionTitle from '../SectionTitle';
import Counter from '../Counter';
import SearchNote from './SearchNote';
import SortDropdown from '../SortDropdown';
import { getFilteredNotes, getFilter } from '@/utils/format-notes';
import NoteContextMenu from './NoteContextMenu';
import { getAllUserOrdinaryNotes } from '@/data/note';
import { auth } from '@/auth';
import { ReactNode } from 'react';

export default async function Notes() {
  const session = await auth();
  if (!session?.user || !session.user.id) return;

  const notes = await getAllUserOrdinaryNotes(session.user.id);
  if (!notes) return;
  const owner = session.user.name;
  const { notes: filteredNotes, searchParam } = getFilteredNotes(notes);
  const filter = getFilter();

  if (filter === 'date-new') {
    filteredNotes.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  } else if (filter === 'date-old') {
    filteredNotes.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  } else if (filter === 'title') {
    filteredNotes.sort((a, b) => a.title.localeCompare(b.title));
  } else {
    filteredNotes.sort(
      (a, b) => b.lastUpdate.getTime() - a.lastUpdate.getTime()
    );
  }
  return (
    <div>
      <SectionTitle title='Notes'>
        <Counter />
      </SectionTitle>
      <div className='px-5 flex gap-2 items-center'>
        <SearchNote />
        <SortDropdown />
      </div>
      <div className='flex flex-col gap-1 overflow-y-scroll scrollbar-thin scrollbar-track-black scrollbar-thumb-silver xl:max-h-[400px] lg:max-h-[300px] max-h-[230px] px-5 pb-1'>
        {filteredNotes.length === 0 && searchParam ? (
          <PlaceholderWrapper>
            <h1>
              No note with such name as{' '}
              <span className='italic font-medium'>{searchParam}</span>
            </h1>
          </PlaceholderWrapper>
        ) : filteredNotes.length > 0 ? (
          filteredNotes.map((note) => {
            const { id, title, colour, content, createdAt } = note;
            const extendedNote = {...note, owner}
            return (
              <NoteContextMenu
                note={extendedNote}
                key={id}
              >
                <Note
                  href='notes'
                  uid={id}
                  colour={colour}
                  name={title}
                  text={content}
                  date={createdAt}
                />
              </NoteContextMenu>
            );
          })
        ) : (
          <PlaceholderWrapper>
            <div className='flex flex-col h-full justify-between'>
              <h1 className='italic'>Darkness here, and nothing more.</h1>
              <p className='h-fit'>Try to fill with some note</p>
            </div>
          </PlaceholderWrapper>
        )}
      </div>
    </div>
  );
}

function PlaceholderWrapper({ children }: { children: ReactNode }) {
  return (
    <div className='bg-midnight h-[100px] w-full rounded-sm lg:p-5 p-2 outline-2 outline-offset-2 outline-dashed outline-silver text-silver my-2 select-none'>
      {children}
    </div>
  );
}
