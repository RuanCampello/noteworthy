import { ReactNode } from 'react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './ui/resizable';
import Sidebar from './Sidebar';

export default function Resizable({ children }: { children: ReactNode }) {
  return (
    <ResizablePanelGroup direction='horizontal'>
      <ResizablePanel className='w-full h-screen' minSize={15} defaultSize={20}>
        <Sidebar />
      </ResizablePanel>
      <ResizableHandle className='bg-neutral-950' />
      <ResizablePanel className='w-full h-screen' minSize={75} defaultSize={80}>
        {children}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
