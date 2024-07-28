import { Colour } from '@prisma/client';

export type SearchResult = {
  id: string;
  title: string;
  content: string;
  colour: Colour;
};
