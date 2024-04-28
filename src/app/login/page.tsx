import LoginForm from '@/components/Auth/LoginForm';
import { Loader2 } from 'lucide-react';
import { Suspense } from 'react';

export default async function LoginPage() {
  return (
    <div className='flex justify-center h-screen w-screen overflow-hidden items-center bg-black'>
      <Suspense fallback={<Loading />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}

function Loading() {
  return (
    <div className='w-screen h-screen flex items-center justify-center'>
      <Loader2 size={20} />
    </div>
  );
}
