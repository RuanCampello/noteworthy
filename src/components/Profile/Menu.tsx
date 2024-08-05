'use client';

import { ReactNode } from 'react';
import { DropdownMenu } from '@/ui/dropdown-menu';
import { useSettingsStore } from '@/lib/zustand/settings';

export default function Menu({ children }: { children: ReactNode }) {
  const { isOpen, setOpen } = useSettingsStore();
  return (
    <DropdownMenu open={isOpen} onOpenChange={setOpen}>
      {children}
    </DropdownMenu>
  );
}
