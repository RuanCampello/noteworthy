import { ColourType } from '@/utils/colours';
import { HTMLContent } from '@tiptap/react';

export type NoteType = {
  id: string;
  title: string;
  createdAt: Date;
  content: HTMLContent;
  owner: string;
  colour: ColourType;
  lastUpdate: Date;
};
