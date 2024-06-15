import NotFoundImage from '@/assets/dictionary-not-found.svg';
import Image from 'next/image';

export default function NotFound() {
  return (
    <section className='flex flex-col justify-center items-center'>
      <Image
        src={NotFoundImage}
        alt='not found'
        height={260}
        className='scale-150'
      />
      <h3 className='text-3xl font-bold -translate-y-8'>Word not found</h3>
    </section>
  );
}
