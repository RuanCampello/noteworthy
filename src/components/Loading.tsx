import { Loader2 } from 'lucide-react';

export function Loading() {
  return (
    <div className="flex justify-center items-center text-silver flex-col gap-2 w-full h-full">
      <Loader2 size={52} className="animate-spin" />
      <h1 className="text-lg">Loading your beautiful note ⭐</h1>
    </div>
  );
}
