import Counter from '@/components/Counter';
import Note from '@/components/Note/Note';
import SearchNote from '@/components/Note/SearchNote';
import SectionTitle from '@/components/SectionTitle';
import SortDropdown from '@/components/SortDropdown';
import { API } from '@/server/api';
import { currentUser } from '@/server/queries/note';
import { getFilter } from '@/utils/format-notes';
import { getTranslations } from 'next-intl/server';
import { headers } from 'next/headers';
import { type ReactNode } from 'react';

export default async function Notes() {
  const user = await currentUser();
  if (!user || !user.id) return;
  const t = await getTranslations('Sidebar');
  const isFirefox = headers().get('user-agent')?.includes('Firefox');

  const result = await new API().notes(user.id).ordinary.filter();
  if (!result) return;
  const { notes, searchParam } = result;
  const filter = getFilter();

  if (filter === 'date-new') {
    notes.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  } else if (filter === 'date-old') {
    notes.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  } else if (filter === 'title') {
    notes.sort((a, b) => a.title.localeCompare(b.title));
  } else {
    notes.sort((a, b) => b.lastUpdate.getTime() - a.lastUpdate.getTime());
  }
  return (
    <div data-className='group/root'>
      <SectionTitle title={t('notes')}>
        <Counter />
      </SectionTitle>
      <div className='px-5 flex gap-2 items-center group-data-[state=closed]/root:hidden'>
        <SearchNote />
        <SortDropdown />
      </div>
      <div
        data-firefox={isFirefox}
        className='flex flex-col gap-1.5 overflow-y-scroll scrollbar-w-1 scrollbar scrollbar-thumb-rounded-full scrollbar-thumb-silver xl:max-h-[396px] lg:max-h-[300px] max-h-[230px] px-5 pe-4 pb-1 group-data-[state=closed]/root:items-center group-data-[state=closed]/root:overflow-x-hidden data-[firefox=true]:scrollbar-thin data-[firefox=true]:scrollbar-track-black'
      >
        {notes.length === 0 && searchParam ? (
          <PlaceholderWrapper>
            <h1>
              No note with such name as{' '}
              <span className='italic font-medium'>{searchParam}</span>
            </h1>
          </PlaceholderWrapper>
        ) : notes.length > 0 ? (
          notes.map((note) => {
            const { id, title, colour, content, createdAt } = note;
            return (
              <Note
                key={id}
                href='notes'
                uid={id}
                colour={colour}
                name={title}
                text={content}
                date={createdAt}
              />
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
