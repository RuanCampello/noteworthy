interface DictionaryProps {
  word?: string;
}

export default async function Dictionary({ word }: DictionaryProps) {
  return <aside className='w-1/4'>{word}</aside>;
}
