'use client';

import { useAddNoteDialog } from '@/lib/zustand/add-note-dialog';
import { Colours } from '@/utils/colours';
import {
  Archive,
  Plus,
  LayoutDashboard,
  Star,
  type LucideProps,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Fragment, type ElementType } from 'react';

type NavItem = {
  href: string;
  name: string;
  icon: ElementType<LucideProps>;
  colour: keyof typeof Colours;
};

const navItems: NavItem[] = [
  {
    name: 'Hub',
    href: '/hub',
    icon: LayoutDashboard,
    colour: 'slate',
  },
  {
    name: 'Favourites notes',
    href: '/favourites',
    icon: Star,
    colour: 'sunset',
  },
  {
    name: 'Archived notes',
    href: '/archived',
    icon: Archive,
    colour: 'cambridge',
  },
  {
    name: 'Archived notes',
    href: '/archived',
    icon: Archive,
    colour: 'cambridge',
  },
];

export default function MobileNav() {
  const setOpen = useAddNoteDialog((s) => s.setOpen);
  const pathname = usePathname();

  return (
    <nav className='w-full h-fit bg-black fixed bottom-0 border-t-midnight border-t-2 shadow-[0_0_20px_0_rgba(0,0,0,0.25)]'>
      <div className='flex justify-evenly items-center h-full'>
        {navItems.map((item, i) => (
          <Fragment key={item.href}>
            <Link
              style={{
                borderColor: pathname.includes(item.href)
                  ? Colours[item.colour]
                  : 'transparent',
              }}
              className='focus:outline-none p-3 border-b-4'
              aria-describedby={item.name}
              href={item.href}
            >
              <div className='p-2 rounded-lg flex justify-center items-center'>
                <item.icon
                  className='shrink-0'
                  color={
                    pathname.includes(item.href) ? Colours[item.colour] : '#fff'
                  }
                  size={24}
                  strokeWidth={2.5}
                />
              </div>
            </Link>
            {i === 1 && (
              <button
                className='focus:outline-none p-3 border-2 border-midnight -translate-y-5 z-50 bg-slate rounded-full'
                aria-label='Add note'
                onClick={() => setOpen(true)}
              >
                <Plus size={32} strokeWidth={2} />
              </button>
            )}
          </Fragment>
        ))}
      </div>
    </nav>
  );
}
