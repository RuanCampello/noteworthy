import 'server-only';

import { ArchivedNote, FavouriteNote, OrdinaryNote, SingleNote } from './Note';

export class API {
  public notes(userId: string) {
    return {
      ordinary: new OrdinaryNote(userId),
      favourite: new FavouriteNote(userId),
      archived: new ArchivedNote(userId),
    };
  }
  public readonly note: SingleNote;

  public constructor() {
    this.note = new SingleNote();
  }
}
