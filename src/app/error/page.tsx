import { CustomForm } from '@/components/Form';
import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function ErrorPage() {
  return (
    <main className="flex flex-col w-screen h-screen overflow-hidden justify-center items-center">
      <div className="w-[380px]">
        <CustomForm.Header />
        <p className="flex gap-4 bg-midnight justify-center text-lg font-semibold items-center rounded-sm p-5 select-none text-tickle">
          Something went wrong!
          <AlertTriangle size={24} strokeWidth={2.5} />
        </p>
        <Link
          className="bg-tickle hover:bg-tickle/80 disabled:bg-tickle/80 transition-colors duration-200 font-semibold text-midnight disabled:p-2 p-2.5 w-full rounded-md flex items-center justify-center mt-12"
          href="login"
        >
          Back to Login
        </Link>
      </div>
    </main>
  );
}
