import { Separator } from '../ui/separator';

export default function FormSeparator() {
  return (
    <div className='flex items-center justify-between text-silver/70 mb-6 mt-9'>
      <Separator className='w-[45%] bg-silver/70' />
      <span className='font-medium'>or</span>
      <Separator className='w-[45%] bg-silver/70' />
    </div>
  );
}
