'use client';

import { Button } from '@/ui/button';
import { getCookie, setCookie } from 'cookies-next';
import { OptionsType } from 'cookies-next/lib/types';
import { PanelRightClose, PanelRightOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import useKeyboardShortcut from 'use-keyboard-shortcut';

const key = 'sidebar-state';
const options: OptionsType = {
  sameSite: 'strict',
};

export default function ToggleSidebarButton() {
  const [currentState, setCurrentState] = useState<boolean>(true);
  const router = useRouter();
  useKeyboardShortcut(['Alt', 'S'], () => handleToogleSidebar(), {
    overrideSystem: true,
    repeatOnHold: false,
  });

  useEffect(() => {
    const state = getCookie(key);
    const initialValue = state === 'open' || !state;
    setCurrentState(initialValue);
  }, [currentState]);

  const iconProps = {
    size: 20,
    className: 'text-silver',
    strokeWidth: 2.2,
  };

  function handleToogleSidebar() {
    const sidebarState = getCookie(key);

    if (sidebarState === 'open' || !sidebarState) {
      setCookie(key, 'closed', options);
      setCurrentState(false);
    } else {
      setCookie(key, 'open', options);
      setCurrentState(true);
    }

    router.refresh();
  }

  return (
    <Button
      size='icon'
      variant='secondary'
      className='dark'
      onClick={handleToogleSidebar}
    >
      {currentState ? (
        <PanelRightOpen {...iconProps} />
      ) : (
        <PanelRightClose {...iconProps} />
      )}
    </Button>
  );
}
