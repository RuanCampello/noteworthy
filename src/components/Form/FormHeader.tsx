import Image, { StaticImageData } from 'next/image';
import { Lora } from 'next/font/google';

interface FormHeaderProps {
  image: StaticImageData;
}

const lora = Lora({subsets: ['latin']})

export default function FormHeader({ image }: FormHeaderProps) {
  return (
    <div className='flex gap-1 items-center pb-16'>
      <Image alt='noteworthy logo' src={image} width={48} height={52} />
      <h1 className={`${lora.className} text-4xl font-bold`}>Noteworthy</h1>
    </div>
  );
}
