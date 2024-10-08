// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { Colour } from './Enums';
import type { NoteFormat } from './Enums';

export type Note = {
  id: string;
  title: string;
  content: string;
  colour: Colour;
  userId: string;
  createdAt: string;
  isArchived: boolean;
  isFavourite: boolean;
  isPublic: boolean;
  lastUpdate: string;
  name: string;
  fullNote: boolean;
  noteFormat: NoteFormat;
};

export type PartialNote = {
  id: string;
  title: string;
  content: string;
  colour: Colour;
  createdAt: string;
};
