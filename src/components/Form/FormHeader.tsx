import Image, { StaticImageData } from 'next/image';

interface FormHeaderProps {
  image: StaticImageData;
  title: string;
  subtitle: string;
}

export default function FormHeader({image, title, subtitle}: FormHeaderProps) {
  return (
    <div className='flex flex-col gap-3'>
      <div className='flex gap-2'>
        <Image alt='noteworthy logo' src={image} width={64} height={64} />
        <h1 className='text-6xl font-semibold'>{title}</h1>
      </div>
      <h2 className='text-lg font-medium text-silver'>{subtitle}</h2>
    </div>
  );
}
