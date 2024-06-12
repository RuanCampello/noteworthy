import { BookA, Search, X } from 'lucide-react';
import { Input } from './ui/input';
import MenuTooltip from './Tooltip';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getDefinition } from '@/actions/dictionary';
import { revalidateTag } from 'next/cache';
import { Separator } from './ui/separator';

interface DictionaryProps {
  word?: string;
}

export default async function Dictionary({ word }: DictionaryProps) {
  const definition = await getDefinition(word!);

  async function closeDictionary() {
    'use server';

    const headersList = headers();
    const params = headersList.get('search-params');
    const searchParams = new URLSearchParams(params!);

    if (searchParams.has('dfn-open')) {
      searchParams.delete('dfn-open');
      searchParams.delete('dfn-word');

      redirect(`?${searchParams}`);
    }
  }

  async function searchWord(formData: FormData) {
    'use server';

    const word = formData.get('word') as string;
    if (!word) return;

    const headersList = headers();
    const params = headersList.get('search-params');
    const searchParams = new URLSearchParams(params!);

    searchParams.set('dfn-open', 'true');
    searchParams.set('dfn-word', word);

    revalidateTag('update-definition');
    redirect(`?${searchParams}`);
  }

  return (
    <aside className='w-1/4 p-5 pt-0 border-l border-l-midnight h-screen overflow-y-scroll relative'>
      <div className='sticky top-0 pt-5 pb-1 bg-black'>
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
        <form
          action={searchWord}
          className='w-full pe-3 flex bg-midnight text-silver rounded-md items-center'
        >
          <Input
            defaultValue={word}
            className='dark bg-midnight placeholder:text-silver/60 font-medium ring-transparent'
            name='word'
            placeholder='Search for a word'
          />
          <button
            type='submit'
            className='h-fit focus:outline-none'
          >
            <Search size={20} />
          </button>
        </form>
        <section>
          <div className='my-3'>
            <h3 className='text-3xl font-semibold capitalize'>
              {definition.word}
            </h3>
            <p className='text-silver font-semibold'>{definition.phonetic}</p>
          </div>
        </section>
      </div>
      {definition.meanings.map((meaning) => (
        <section key={meaning.partOfSpeech}>
          <div className='flex items-center overflow-hidden gap-4 text-silver mb-3'>
            <p className='italic font-medium text-lg'>{meaning.partOfSpeech}</p>
            <Separator orientation='horizontal' />
          </div>
          {meaning.definitions.map((definition, i) => (
            <div className='mb-2' key={definition.definition}>
              <p className='mx-2 text-white/80 flex gap-1.5'>
                <span className='px-2 rounded-full h-fit text-silver bg-midnight'>{i+1}</span>
                {definition.definition}
                </p>
            </div>
          ))}
        </section>
      ))}
    </aside>
  );
}
