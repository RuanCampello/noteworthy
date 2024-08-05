import { colour, note, noteFormat, userPreferences } from '@/server/db/schema';
import { InferSelectModel } from 'drizzle-orm';
import { z } from 'zod';

export type Note = InferSelectModel<typeof note>;
export type Preferences = InferSelectModel<typeof userPreferences>;

const colourEnum = z.enum(colour.enumValues);
export type Colour = z.infer<typeof colourEnum>;

const noteFormatEnum = z.enum(noteFormat.enumValues);
export type NoteFormat = z.infer<typeof noteFormatEnum>;
