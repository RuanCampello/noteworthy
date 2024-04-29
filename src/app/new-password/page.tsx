import NewPasswordForm from '@/components/Auth/NewPasswordForm';
import LoadingSuspense from '@/components/LoadingSuspense';
import { Suspense } from 'react';

export default async function NewPasswordPage() {
  <Suspense fallback={<LoadingSuspense />}>
    <main className='w-screen h-screen overflow-hidden flex items-center justify-center'>
      <NewPasswordForm />
    </main>
  </Suspense>;
}
