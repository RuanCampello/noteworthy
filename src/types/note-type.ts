import { ColourType } from '@/utils/colours';
import { HTMLContent } from '@tiptap/react';
import { Timestamp } from 'firebase/firestore';

export type NoteType = {
  uid: string;
  title: string;
  date: Timestamp;
  content: HTMLContent;
  owner: string;
  colour: ColourType;
  lastUpdate: Timestamp;
};
