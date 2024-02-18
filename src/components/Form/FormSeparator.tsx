import { Separator } from '../ui/separator';

export default function FormSeparator() {
  return (
    <div className='flex items-center justify-between text-white/40 text-medium mb-8'>
      <Separator className='w-[45%] bg-white/40' />
      <span>or</span>
      <Separator className='w-[45%] bg-white/40' />
    </div>
  );
}
