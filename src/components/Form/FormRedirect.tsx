import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

interface FormRedirectProps {
  text: string;
  path: string;
  link: string;
  disableWhen?: boolean;
}

export default function FormRedirect({ text, path, link, disableWhen }: FormRedirectProps) {
  return (
    <div className='flex my-10 justify-center gap-1 text-silver select-none'>
      <span>{text}</span>
      <Link
        aria-disabled={disableWhen}
        href={path}
        className={`flex items-center group ${disableWhen ? 'text-tickle/80 pointer-events-none' : 'text-tickle hover:underline underline-offset-2 focus:outline-none'}`}
      >
        {link} <ArrowUpRight size={20} />
      </Link>
    </div>
  );
}
