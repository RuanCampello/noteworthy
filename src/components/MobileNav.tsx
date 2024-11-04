'use client';

import { LayoutDashboard, Star, Archive } from 'lucide-react';
import Link from 'next/link';
import type { LucideProps } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Colours } from '@/utils/colours';

type NavItem = {
  href: string;
  name: string;
  icon: React.ElementType<LucideProps>;
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
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className='w-full h-fit bg-black absolute bottom-0 border-t-midnight border-t-2 shadow-[0_0_20px_0_rgba(0,0,0,0.25)]'>
      <div className='flex justify-evenly items-center h-full'>
        {navItems.map((item) => {
          const isActive = pathname.includes(item.href);

          return (
            <Link
              style={{
                borderColor: isActive ? Colours[item.colour] : 'transparent',
              }}
              className='focus:outline-none py-5 px-3 border-b-4'
              aria-describedby={item.name}
              key={item.href}
              href={item.href}
            >
              <div className='p-2 rounded-lg nav-button-bg flex justify-center items-center'>
                <item.icon
                  className='shrink-0'
                  color={isActive ? Colours[item.colour] : 'white'}
                  size={24}
                  strokeWidth={2.5}
                />
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
