import 'server-only';

import { Note } from '@prisma/client';
import { getAllUserNotes } from '@/queries/note';

export class API {
  public readonly notes: {
    ordinary: OrdinaryNotes;
    favourite: FavouriteNotes;
    archived: ArchivedNotes;
  };

  public constructor(userId: string) {
    this.notes = {
      ordinary: new OrdinaryNotes(userId),
      favourite: new FavouriteNotes(userId),
      archived: new ArchivedNotes(userId),
    };
  }
}

export interface Notes {
  get(): Promise<Note[] | null>;
}

export class OrdinaryNotes implements Notes {
  private readonly userId: string;
  public constructor(userId: string) {
    this.userId = userId;
  }

  async get(): Promise<Note[] | null> {
    const notes = await getAllUserNotes(this.userId, {
      isArchived: false,
      isFavourite: false,
    });
    if (!notes) return null;
    return notes;
  }
}
export class FavouriteNotes implements Notes {
  private readonly userId: string;
  public constructor(userId: string) {
    this.userId = userId;
  }

  async get(): Promise<Note[] | null> {
    const notes = await getAllUserNotes(this.userId, {
      isArchived: false,
      isFavourite: true,
    });
    if (!notes) return null;
    return notes;
  }
}
export class ArchivedNotes implements Notes {
  private readonly userId: string;
  public constructor(userId: string) {
    this.userId = userId;
  }

  async get(): Promise<Note[] | null> {
    const notes = await getAllUserNotes(this.userId, {
      isArchived: true,
      isFavourite: false,
    });
    if (!notes) return null;
    return notes;
  }
}
