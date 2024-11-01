'use client';

import { useSettingsDialogStore } from '@/lib/zustand/settings-dialog';
import type { ReactNode } from 'react';

export default function SettingsButton({ children }: { children: ReactNode }) {
  const open = useSettingsDialogStore((s) => s.isOpen);
  const setOpen = useSettingsDialogStore((s) => s.setOpen);

  return (
    <button onClick={() => setOpen(!open)} data-open={open}>
      {children}
    </button>
  );
}
