import { BookA, X } from 'lucide-react';
import MenuTooltip from '../Tooltip';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getDefinition } from '@/actions/dictionary';
import { Separator } from '../ui/separator';
import DictionarySearch from './DictionarySearch';
import ListenWord from './ListenWord';
import DerivedWords from './DerivedWords';
import Example from './Example';
import NotFound from './NotFound';
import { Definition, Meaning } from '@/types/definition';

interface DictionaryProps {
  word?: string;
}

async function closeDictionary() {
  'use server';

  const headersList = headers();
  const params = headersList.get('search-params');
  const searchParams = new URLSearchParams(params!);

  if (searchParams.has('dfn-open')) {
    searchParams.delete('dfn-open');
    searchParams.delete('dfn-word');
    redirect(`?${searchParams}`);
  } else {
    redirect('?');
  }
}

interface PhoneticSectionProps {
  definition: Definition;
}

function PhoneticSection({ definition }: PhoneticSectionProps) {
  const firstPhoneticWithAudio = definition?.phonetics.find(
    (phonetic) => phonetic.audio
  );

  return (
    <section className='py-4 mt-1 flex items-center justify-between'>
      <div>
        <h3 className='text-3xl font-semibold capitalize leading-none'>
          {definition.word}
        </h3>
        <p className='text-silver font-semibold'>{definition.phonetic}</p>
      </div>
      {firstPhoneticWithAudio && (
        <ListenWord url={firstPhoneticWithAudio.audio} />
      )}
    </section>
  );
}

interface MeaningSectionProps {
  meanings: Meaning[];
  word: string;
}

function MeaningSection({ meanings, word }: MeaningSectionProps) {
  return meanings.map((meaning, i: number) => (
    <section key={i}>
      <div className='flex items-center overflow-hidden gap-4 text-silver mb-3'>
        <p className='italic font-medium text-lg'>{meaning.partOfSpeech}</p>
        <Separator
          orientation='horizontal'
          className='bg-silver/40'
        />
      </div>
      {meaning.definitions.slice(0, 3).map((def, index: number) => (
        <div
          className='mb-2 mx-2'
          key={def.definition}
        >
          <p className='text-white/80 flex gap-1.5'>
            <span className='px-2 rounded-full text-sm leading-6 h-fit items-center text-silver bg-midnight'>
              {index + 1}
            </span>
            {def.definition}
          </p>
          <DerivedWords
            items={def.synonyms}
            title='Synonyms'
          />
          <DerivedWords
            items={def.antonyms}
            title='Antonyms'
          />
          <Example
            text={def.example}
            word={word}
          />
        </div>
      ))}
    </section>
  ));
}

interface FooterSectionProps {
  definition: Definition;
}

function FooterSection({ definition }: FooterSectionProps) {
  return (
    <footer className='flex flex-col gap-3 mt-4 underline-offset-4 text-silver text-sm'>
      <Separator orientation='horizontal' />
      <div className='grid grid-cols-4'>
        <p>{definition.sourceUrls.length > 1 ? 'Sources' : 'Source'}</p>
        <div className='flex flex-col col-span-3'>
          {definition.sourceUrls.map((source: string) => (
            <a
              key={source}
              href={source}
              className='underline'
              target='_blank'
            >
              {source}
            </a>
          ))}
        </div>
      </div>
      <div className='grid grid-cols-4'>
        <p>Licence</p>
        <a
          className='underline col-span-3'
          href={definition.license.url}
        >
          {definition.license.name}
        </a>
      </div>
    </footer>
  );
}

export default async function Dictionary({ word }: DictionaryProps) {
  const definition = await getDefinition(word!);
  const hasContent = definition && word;

  return (
    <aside className='w-1/4 p-5 pt-0 border-l border-l-midnight h-screen overflow-y-scroll overflow-hidden relative'>
      <div className='sticky top-0 pt-5 bg-black'>
        <header className='flex mb-6 items-center justify-between'>
          <div className='flex items-center gap-1.5'>
            <BookA size={26} />
            <h2 className='text-xl font-medium'>Dictionary</h2>
          </div>
          <MenuTooltip content='Close dictionary'>
            <form action={closeDictionary}>
              <button
                type='submit'
                className='p-1.5 rounded-full text-silver hover:bg-midnight'
              >
                <X size={18} />
              </button>
            </form>
          </MenuTooltip>
        </header>
        <DictionarySearch />
        {hasContent ? (
          <PhoneticSection definition={definition} />
        ) : !definition ? (
          <NotFound />
        ) : null}
      </div>
      {hasContent && (
        <MeaningSection
          meanings={definition.meanings}
          word={definition.word}
        />
      )}
      {hasContent && <FooterSection definition={definition} />}
    </aside>
  );
}
