'use client';

import { useSidebarState } from '@/lib/zustand/sidebar';
import { Button } from '@/ui/button';
import { PanelRightClose, PanelRightOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import useKeyboardShortcut from 'use-keyboard-shortcut';

export default function ToggleSidebarButton() {
  const { state, toggleState } = useSidebarState();
  const router = useRouter();
  useKeyboardShortcut(['Shift', 'Alt', 'S'], () => toggleState(state), {
    overrideSystem: true,
    repeatOnHold: false,
  });

  const iconProps = {
    size: 20,
    className: 'text-silver',
    strokeWidth: 2.2,
  };

  return (
    <Button
      size='icon'
      variant='secondary'
      className='dark'
      onClick={() => toggleState(state)}
    >
      {state === 'open' ? (
        <PanelRightOpen {...iconProps} />
      ) : (
        <PanelRightClose {...iconProps} />
      )}
    </Button>
  );
}
