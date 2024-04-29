import { Loader2 } from 'lucide-react';

export default function LoadingSuspense() {
  return (
    <div className='w-screen h-screen flex bg-black items-center justify-center'>
      <Loader2 size={20} />
    </div>
  );
}
