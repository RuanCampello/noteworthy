'use client';

import { useSidebarState } from '@/lib/zustand/sidebar';
import { Button } from '@/ui/button';
import { setCookie } from 'cookies-next';
import { PanelRightClose, PanelRightOpen } from 'lucide-react';
import { useHotkeys } from 'react-hotkeys-hook';

export default function ToggleSidebarButton() {
  const { state, toggleState } = useSidebarState();
  useHotkeys('ctrl+l', () => toggleSidebarState(), {
    preventDefault: true,
    enableOnFormTags: true,
    enableOnContentEditable: true,
  });

  const iconProps = {
    size: 20,
    className: 'text-silver',
    strokeWidth: 2.2,
  };

  function toggleSidebarState() {
    const value = state === 'open' ? 'closed' : 'open';
    toggleState(value);
    setCookie('sidebar-state', value);
  }

  return (
    <Button
      size='icon'
      variant='secondary'
      className='dark'
      onClick={() => toggleSidebarState()}
    >
      {state === 'open' ? (
        <PanelRightOpen {...iconProps} />
      ) : (
        <PanelRightClose {...iconProps} />
      )}
    </Button>
  );
}
