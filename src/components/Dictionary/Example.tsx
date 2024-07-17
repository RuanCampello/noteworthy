interface ExampleProps {
  text: string;
  word: string;
}

export default function Example({ text, word }: ExampleProps) {
  if (!text) return;

  const boldedExample = text
    .split(new RegExp(`(${word})`, 'gi'))
    .map((part, index) =>
      part.toLowerCase() === word.toLowerCase() ? (
        <b key={index}>{part}</b>
      ) : (
        part
      ),
    );

  return (
    <p className='leading-tight underline-offset-2 my-2 text-silver text-[15px]'>
      &quot;{boldedExample}&quot;
    </p>
  );
}
