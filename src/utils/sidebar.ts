import { cookies } from 'next/headers';

type SidebarState = 'open' | 'closed';

export function useSidebarState(): SidebarState {
  const state = cookies().get('sidebar-state')?.value;

  if (state === 'closed') return 'closed';
  if (!state) return 'open';
  return 'open';
}
