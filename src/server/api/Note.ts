import {
  countNoteNumber,
  getAllUserNotes,
  getNoteByIdWithPreferences,
} from '@/queries/note';
import { type Note as NoteType } from '@/types/database-types';
import { type FilteredResults, getFilteredNotes } from '@/utils/format-notes';

export abstract class Note {
  protected userId: string;
  constructor(userId: string) {
    this.userId = userId;
  }

  abstract get(): Promise<NoteType[] | null>;
  abstract count(): Promise<number>;
  async filter(): Promise<FilteredResults | null> {
    const notes = await this.get();
    if (!notes) return null;
    return getFilteredNotes(notes);
  }
}

export class SingleNote {
  public async get(id: string) {
    const notes = await getNoteByIdWithPreferences(id);
    if (!notes) return null;
    return notes;
  }
}

export class OrdinaryNote extends Note {
  public constructor(userId: string) {
    super(userId);
  }

  async get() {
    const notes = await getAllUserNotes(this.userId, {
      isArchived: false,
      isFavourite: false,
    });
    if (!notes) return null;
    return notes;
  }
  async count(): Promise<number> {
    const count = await countNoteNumber(this.userId, false, false);
    return count;
  }
}
export class FavouriteNote extends Note {
  public constructor(userId: string) {
    super(userId);
  }

  async get() {
    const notes = await getAllUserNotes(this.userId, {
      isArchived: false,
      isFavourite: true,
    });
    if (!notes) return null;
    return notes;
  }
  async count(): Promise<number> {
    const count = await countNoteNumber(this.userId, true, false);
    return count;
  }
}

export class ArchivedNote extends Note {
  public constructor(userId: string) {
    super(userId);
  }

  async get() {
    const notes = await getAllUserNotes(this.userId, {
      isArchived: true,
      isFavourite: false,
    });
    if (!notes) return null;
    return notes;
  }
  async count(): Promise<number> {
    const count = await countNoteNumber(this.userId, false, true);
    return count;
  }
}
