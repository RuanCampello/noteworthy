'use client';

import { ReactNode } from 'react';
import { DropdownMenu } from '@/ui/dropdown-menu';
import { useSettings } from '@/lib/zustand/settings';

export default function Menu({ children }: { children: ReactNode }) {
  const isOpen = useSettings((s) => s.dropdownOpen);
  const setOpen = useSettings((s) => s.setDropdownOpen);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setOpen}>
      {children}
    </DropdownMenu>
  );
}
