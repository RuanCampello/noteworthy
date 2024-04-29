import LoginForm from '@/components/Auth/LoginForm';
import LoadingSuspense from '@/components/LoadingSuspense';
import { Suspense } from 'react';

export default async function LoginPage() {
  return (
    <div className='flex justify-center h-screen w-screen overflow-hidden items-center bg-black'>
      <Suspense fallback={<LoadingSuspense />}>
        <LoginForm />
      </Suspense>
    </div>
  );
  }