/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { Pause, Play } from 'lucide-react';
import { Button } from '../ui/button';
import { useEffect, useState } from 'react';

interface ListenWordProps {
  url: string;
}

export default function ListenWord({ url }: ListenWordProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const handleAudioEnd = () => setIsPlaying(false);

  useEffect(() => {
    if (!url) return;
    
    const audioElement = new Audio(url);
    setAudio(audioElement);

    return () => {
      audioElement.pause();
      audioElement.removeEventListener('ended', handleAudioEnd);
    };
  }, [url]);

  useEffect(() => {
    if (!url) return;

    if (audio) {
      if (isPlaying) {
        console.log('source audio', audio);
        audio.play();
      } else {
        audio.pause();
      }
      audio.addEventListener('ended', handleAudioEnd);

      return () => audio.removeEventListener('ended', handleAudioEnd);
    }
  }, [isPlaying, audio]);

  const iconProps = {
    size: 24,
    fill: '#181818',
  };

  return (
    <Button
      onClick={() => setIsPlaying(!isPlaying)}
      className='p-6 rounded-full focus:outline-none hover:bg-neutral-400 data-[playing=true]:bg-neutral-400'
      size='icon'
      variant='secondary'
      data-playing={isPlaying}
    >
      {isPlaying ? (
        <Pause
          {...iconProps}
          className='shrink-0 text-black'
        />
      ) : (
        <Play
          {...iconProps}
          className='translate-x-[1.5px] shrink-0 text-black'
        />
      )}
    </Button>
  );
}
