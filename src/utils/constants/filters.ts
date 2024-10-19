export type Filters = 'date-new' | 'date-old' | 'title' | 'last-modified';

export const allowedFilters: Filters[] = [
  'date-new',
  'date-old',
  'title',
  'last-modified',
];

// Alias to revalidate next-js' cache.
export const Tag = {
  // The notes that appears on the sidebar.
  Notes: 'sidebar-notes',
  // Whether the note is public or not.
  Publicity: 'note-public-state',
  // The user's profile image.
  Profile: 'profile-image',
  // The user's preferences settings.
  Preferences: 'user-preferences',
  // The search results cache.
  Search: 'search-notes',
  // The page of an open note.
  Page: 'note-page',
  // The dictionary definition page.
  Definition: 'update-definition',
  // The number count of each note category.
  Counter: {
    All: 'all-notes-counter',
    Favourites: 'favourite-notes-counter',
    Archived: 'archived-notes-counter',
  },
};
