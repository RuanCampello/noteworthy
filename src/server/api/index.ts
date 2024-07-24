import 'server-only';

import { type Note as NoteType } from '@prisma/client';
import { getAllUserNotes } from '@/queries/note';
import { FilteredResults, getFilteredNotes } from '@/utils/format-notes';

export class API {
  public readonly notes: {
    ordinary: OrdinaryNote;
    favourite: FavouriteNote;
    archived: ArchivedNote;
  };

  public constructor(userId: string) {
    this.notes = {
      ordinary: new OrdinaryNote(userId),
      favourite: new FavouriteNote(userId),
      archived: new ArchivedNote(userId),
    };
  }
}

export abstract class Note {
  abstract get(): Promise<NoteType[] | null>;
  async filter(): Promise<FilteredResults | null> {
    const notes = await this.get();
    if (!notes) return null;
    return getFilteredNotes(notes);
  }
}

class OrdinaryNote extends Note {
  private readonly userId: string;
  public constructor(userId: string) {
    super();
    this.userId = userId;
  }

  async get() {
    const notes = await getAllUserNotes(this.userId, {
      isArchived: false,
      isFavourite: false,
    });
    if (!notes) return null;
    return notes;
  }
}
class FavouriteNote extends Note {
  private readonly userId: string;
  public constructor(userId: string) {
    super();
    this.userId = userId;
  }

  async get() {
    const notes = await getAllUserNotes(this.userId, {
      isArchived: false,
      isFavourite: true,
    });
    if (!notes) return null;
    return notes;
  }
}
class ArchivedNote extends Note {
  private readonly userId: string;
  public constructor(userId: string) {
    super();
    this.userId = userId;
  }

  async get() {
    const notes = await getAllUserNotes(this.userId, {
      isArchived: false,
      isFavourite: false,
    });
    if (!notes) return null;
    return notes;
  }
}
