import { getDefinition } from '@/actions';
import { BookA } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Definition, Meaning } from '@/types/Definition';
import { Separator } from '@/ui/separator';
import CloseButton from './CloseButton';
import DerivedWords from './DerivedWords';
import DictionarySearch from './DictionarySearch';
import Example from './Example';
import ListenWord from './ListenWord';
import NotFound from './NotFound';

interface DictionaryProps {
  word?: string;
}

interface PhoneticSectionProps {
  definition: Definition;
}

function PhoneticSection({ definition }: PhoneticSectionProps) {
  const firstPhoneticWithAudio = definition?.phonetics.find(
    (phonetic) => phonetic.audio,
  );

  return (
    <section className='py-4 mt-1 flex items-center justify-between'>
      <div>
        <h3 className='text-3xl font-semibold capitalize leading-tight'>
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
        <Separator orientation='horizontal' className='bg-silver/40' />
      </div>
      {meaning.definitions.slice(0, 3).map((def, index: number) => (
        <div className='mb-2 mx-2' key={def.definition}>
          <p className='text-white/80 flex gap-1.5'>
            <span className='px-2 rounded-full text-sm leading-6 h-fit items-center text-silver bg-midnight'>
              {index + 1}
            </span>
            {def.definition}
          </p>
          <DerivedWords items={def.synonyms} title='Synonyms' />
          <DerivedWords items={def.antonyms} title='Antonyms' />
          <Example text={def.example!} word={word} />
        </div>
      ))}
    </section>
  ));
}

interface FooterSectionProps {
  definition: Definition;
}

async function FooterSection({ definition }: FooterSectionProps) {
  const t = await getTranslations('Dictionary');

  return (
    <footer className='flex flex-col gap-3 mt-4 underline-offset-4 text-silver text-sm'>
      <Separator orientation='horizontal' />
      <div className='grid grid-cols-4'>
        <p>{definition.sourceUrls.length > 1 ? t('srcs') : t('src')}</p>
        <div className='flex flex-col col-span-3'>
          {definition.sourceUrls.map((source: string) => (
            <a key={source} href={source} className='underline' target='_blank'>
              {source}
            </a>
          ))}
        </div>
      </div>
      <div className='grid grid-cols-4'>
        <p>{t('lic')}</p>
        <a className='underline col-span-3' href={definition.license.url}>
          {definition.license.name}
        </a>
      </div>
    </footer>
  );
}

export default async function Dictionary({ word }: DictionaryProps) {
  const definition = await getDefinition(word!);
  const t = await getTranslations('Dictionary');
  const hasContent = definition && word;

  return (
    <aside className='w-1/4 p-5 pt-0 border-l border-l-midnight h-screen overflow-y-scroll overflow-hidden relative'>
      <div className='sticky top-0 pt-5 bg-black'>
        <header className='flex mb-6 items-center justify-between'>
          <div className='flex items-center gap-1.5'>
            <BookA size={26} />
            <h2 className='text-xl font-medium'>{t('title')}</h2>
          </div>
          <CloseButton />
        </header>
        <DictionarySearch />
        {hasContent ? (
          <PhoneticSection definition={definition} />
        ) : !definition ? (
          <NotFound />
        ) : null}
      </div>
      {hasContent && (
        <MeaningSection meanings={definition.meanings} word={definition.word} />
      )}
      {hasContent && <FooterSection definition={definition} />}
    </aside>
  );
}
