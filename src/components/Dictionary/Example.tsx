interface ExampleProps {
  text: string;
  word: string;
}

export default function Example({ text, word }: ExampleProps) {
  if (!text) return;

  const underlinedExample = text
    .split(new RegExp(`(${word})`, 'gi'))
    .map((part, index) =>
      part.toLowerCase() === word.toLowerCase() ? (
        <u key={index}>{part}</u>
      ) : (
        part
      )
    );

  return (
    <p className='leading-tight underline-offset-2 my-2 text-silver text-[15px]'>
      &quot;{underlinedExample}&quot;
    </p>
  );
}
