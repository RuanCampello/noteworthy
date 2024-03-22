import { ReactNode } from 'react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './ui/resizable';
import Sidebar from './Sidebar';

export default function Resizable({ children }: { children: ReactNode }) {
  return (
    <ResizablePanelGroup direction='horizontal'>
      <ResizablePanel className='w-full xl:min-w-[13%] h-screen min-w-[25%] relative' defaultSize={20}>
        <Sidebar />
      </ResizablePanel>
      <ResizableHandle className='bg-midnight' />
      <ResizablePanel className='w-full h-screen relative' minSize={75} defaultSize={80}>
        {children}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
