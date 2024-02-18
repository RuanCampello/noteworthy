interface FormButtonProps {
  title: string;
}

export default function FormButton({ title }: FormButtonProps) {
  return (
    <button
      type='submit'
      className='bg-tickle hover:bg-tickle/80 transition-colors duration-200 font-semibold text-midnight p-4 w-full rounded-md flex items-center justify-center'
    >
      {title}
    </button>
  );
}
