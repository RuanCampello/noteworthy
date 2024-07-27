import Image from 'next/image';

interface FormButtonProps {
  title: string;
  disableWhen: boolean;
}

export default function FormButton({ title, disableWhen }: FormButtonProps) {
  return (
    <button
      type='submit'
      disabled={disableWhen}
      className='bg-slate hover:bg-slate/80 disabled:bg-slate/80 transition-colors duration-200 font-semibold text-midnight disabled:p-2 p-2.5 w-full rounded-sm flex items-center justify-center'
    >
      {!disableWhen ? (
        title
      ) : (
        <Image
          alt='loading...'
          width={28}
          height={28}
          src={
            'https://raw.githubusercontent.com/n3r4zzurr0/svg-spinners/abfa05c49acf005b8b1e0ef8eb25a67a7057eb20/svg-css/90-ring-with-bg.svg'
          }
        />
      )}
    </button>
  );
}
