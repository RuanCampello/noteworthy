'use server';

import { env } from '@/env';
import { auth, signIn } from '@/lib/auth-js/auth';
import { Filter } from '@/lib/zustand/search-filter';
import { DEFAULT_REDIRECT } from '@/routes';
import {
  loginFormSchema,
  newPasswordSchema,
  noteDialogSchema,
  registerFormSchema,
  resetPasswordSchema,
  userPreferencesSchema,
} from '@/schemas';
import type { Definition } from '@/types/Definition';
import type { PartialNote } from '@/types/Note';
import type { PasswordResetToken } from '@/types/PasswordResetToken';
import { SearchResult } from '@/types/SearchResult';
import type { UserPreferences } from '@/types/UserPreferences';
import { getPathnameParams } from '@/utils/format-notes';
import { AuthError } from 'next-auth';
import { getTranslations } from 'next-intl/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import { z } from 'zod';

// Look for the current logged-in user in the session.
export const currentUser = cache(async () => {
  const session = await auth();
  return session?.user;
});

// createNote calls the `notes` endpoint with a `POST` method, validate the form params
// and revalidate the sidebar with the new created note.
export async function createNote(values: z.infer<typeof noteDialogSchema>) {
  const fields = noteDialogSchema.safeParse(values);

  if (!fields.success) return;
  const { colour, name } = fields.data;

  const user = await currentUser();
  if (!user || !user.accessToken) return;

  const response = await fetch(`${env.INK_HOSTNAME}/notes`, {
    method: 'post',
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${user.accessToken}`,
    },
    body: JSON.stringify({
      title: name,
      content: '',
      colour: colour,
    }),
  });
  const id = await response.json();
  const { origin, basePath } = getPathnameParams();

  revalidateTag('sidebar-notes');
  if (!basePath || basePath === 'favourites' || basePath === 'archived') {
    redirect(`${origin}/notes/${id}`);
  }
  //if user is already in notes path, but not on favourite/archive page
  redirect(`${origin}/${basePath}/${id}`);
}

// Makes a `POST` request to `/notes/placeholder/:userId` endpoint to create a placeholder note for the user.
export async function createPlaceholderNote(userId: string) {
  await fetch(`${env.INK_HOSTNAME}/notes/placeholder/${userId}`, {
    method: 'post',
    headers: { 'content-type': 'application/json' },
  });
}

// editNote validates the data sent
// makes a `PATCH` method call to the selected `notes/:id/endpoint`
// and revalidates both the sidebar and the current opened note.
export async function editNote(
  values: z.infer<typeof noteDialogSchema>,
  id: string,
) {
  const fields = noteDialogSchema.safeParse(values);
  if (!fields.success) return;
  const { colour, name } = fields.data;

  const user = await currentUser();
  if (!user || !user.accessToken) return;

  try {
    await fetch(`${env.INK_HOSTNAME}/notes/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        colour: colour,
        title: name,
      }),
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${user.accessToken}`,
      },
    });
  } catch (error) {
    console.error(error);
  }
  revalidateTag('sidebar-notes');
  revalidateTag('note-page');
}

// deleteNote calls a `DELETE` method on the `notes/:id` endpoint,
// revalidates the sidebar and redirect the user to the main page.
export async function deleteNote(id: string) {
  const user = await currentUser();
  if (!user || !user.accessToken) return;

  await fetch(`${env.INK_HOSTNAME}/notes/${id}`, {
    method: 'delete',
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${user.accessToken}`,
    },
  });
  revalidateTag('sidebar-notes');
  redirect('/');
}

// updateNoteContent calls a `PATCH` on the `notes/:id/content` endpoint
// revalidates both the sidebar and the current open note.
export async function updateNoteContent(id: string, content: string) {
  try {
    const user = await currentUser();
    if (!user || !user.accessToken) return;

    await fetch(`${env.INK_HOSTNAME}/notes/${id}/content`, {
      body: JSON.stringify({
        content: content,
      }),
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${user.accessToken}`,
      },
      method: 'PATCH',
    });
    revalidateTag('note-page');
    revalidateTag('sidebar-notes');
  } catch (error) {
    console.error(error);
    return;
  }
}

// Make a fetch with a `PATCH` method to the selected `notes/:id/favourite` endpoint
// and redirect the user based on note `isFavourite` (boolean) attribute.
// Also, revalidates the note with its new status and the sidebar.
export async function toggleNoteFavourite(id: string) {
  const { basePath, origin } = getPathnameParams();
  const user = await currentUser();
  if (!user || !user?.accessToken) return;

  await fetch(`${env.INK_HOSTNAME}/notes/${id}/favourite`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${user.accessToken}`,
    },
  });

  revalidateTag('sidebar-notes');
  revalidateTag('note-page');

  if (basePath === 'favourites') {
    const redirectUrl = new URL(`${origin}/notes/${id}`);
    redirect(redirectUrl.toString());
  } else if (basePath === 'notes') {
    const redirectUrl = new URL(`${origin}/favourites/${id}`);
    redirect(redirectUrl.toString());
  } else {
    revalidatePath('/');
  }
}

// Make a fetch with a `PATCH` method to the selected `notes/:id/archived` endpoint
// and redirect the user based on note `isArchived` (boolean) attribute.
// Also, revalidates the note with its new status and the sidebar.
export async function toggleNoteArchived(id: string) {
  const { basePath, origin } = getPathnameParams();
  const user = await currentUser();
  if (!user || !user?.accessToken) return;

  await fetch(`${env.INK_HOSTNAME}/notes/${id}/archived`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${user.accessToken}`,
    },
  });

  revalidateTag('sidebar-notes');
  revalidateTag('note-page');

  if (basePath === 'archived') {
    const redirectUrl = new URL(`${origin}/notes/${id}`);
    redirect(redirectUrl.toString());
  } else if (basePath === 'notes') {
    const redirectUrl = new URL(`${origin}/archived/${id}`);
    redirect(redirectUrl.toString());
  }
}

// Make a fetch with a `PATCH` method to the selected `notes/:id/public` endpoint
// and redirect the user based on note `isPublic` (boolean) attribute.
// Also, revalidates only the publish dialog with new data.
export async function togglePublishState(id: string) {
  try {
    const user = await currentUser();
    if (!user || !user.accessToken) return;

    await fetch(`${env.INK_HOSTNAME}/notes/${id}/public`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${user.accessToken}` },
    });
    revalidateTag('note-public-state');
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Makes a `GET` request to `notes/:id/public` to seek the current state of `is_public`.
export async function getNoteIsPublic(id: string) {
  const user = await currentUser();
  if (!user || !user.accessToken) return;

  const response = await fetch(`${env.INK_HOSTNAME}/notes/${id}/public`, {
    method: 'get',
    headers: { Authorization: `Bearer ${user.accessToken}` },
    next: { tags: ['note-public-state'] },
    cache: 'force-cache',
  });

  if (!response.ok) return false;

  const is_public: boolean = await response.json();
  return is_public;
}

// Makes a `POST` request to register endpoint and tries to insert the given data
// into the database. If it's successful, will make a placeholder note to the user
// and login.
export async function register(
  values: z.infer<typeof registerFormSchema>,
): Promise<{ error: string | null }> {
  const t = await getTranslations('ServerErrors');
  const fields = registerFormSchema.safeParse(values);

  if (!fields.success) return { error: t('inv_field') };
  const { email, password, username } = fields.data;

  const response = await fetch(`${env.INK_HOSTNAME}/register`, {
    method: 'post',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      email,
      password,
      name: username,
    }),
  });

  if (response.status === 409) return { error: t('email_taken') };

  const id = await response.json();
  await createPlaceholderNote(id);
  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: DEFAULT_REDIRECT,
    });
    return { error: null };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: t('inv_credentials') };
        default:
          return { error: t('default_error') };
      }
    }
    throw error;
  }
}

// Make a request to notes/generate endpoint
// that will try to generate a note content and title to the current user
// with NoteHover. Will also redirect the user to the created note and revalidate the sidebar notes.
export async function generateNote() {
  const user = await currentUser();
  if (!user || !user?.accessToken) return;

  try {
    const response = await fetch(`${env.INK_HOSTNAME}/notes/generate`, {
      method: 'post',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${user.accessToken}`,
      },
    });
    revalidateTag('sidebar-notes');
    return await response.json();
  } catch (error) {
    return null;
  }
}

// Call the notes/search endpoint with q as query and an optional filter.
export const searchNotes = cache(
  async (query: string, filter: Filter | null) => {
    query = query.replace(/(\S) (\S)/g, '$1 & $2').trim();
    const user = await currentUser();
    if (!user || !user?.accessToken) return null;

    let search_filter: string;

    switch (filter) {
      case 'Archived': {
        search_filter = '&is_arc=true&is_fav=false';
        break;
      }
      case 'Favourites': {
        search_filter = '&is_arc=false&is_fav=true';
        break;
      }
      default: {
        search_filter = '&is_arc=false&is_fav=false';
        break;
      }
    }

    const response = await fetch(
      `${env.INK_HOSTNAME}/notes/search?q=${query}${search_filter}`,
      {
        method: 'get',
        cache: 'force-cache',
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      },
    );
    if (!response.ok) return null;
    return (await response.json()) as SearchResult[];
  },
);

// Makes a `get` request to `/notes` endpoint and tries to get the current user notes depending on the page.
// If `main` params if set to true, always returns all notes.
export async function getRespectiveNotes(main = false) {
  const user = await currentUser();
  if (!user || !user?.accessToken) return null;
  const pathname = headers().get('pathname');

  const fav = !main && pathname?.includes('/favourites');
  const arc = !main && pathname?.includes('/archived');

  const response = await fetch(
    `${env.INK_HOSTNAME}/notes?is_fav=${fav}&is_arc=${arc}`,
    {
      method: 'get',
      headers: {
        Authorization: `Bearer ${user.accessToken}`,
      },
      cache: 'force-cache',
      next: {
        tags: ['sidebar-notes'],
      },
    },
  );
  if (!response.ok) return null;
  const notes: PartialNote[] = await response.json();
  return notes;
}

// Receives an formData with an image and makes a `POST` request to `users/profile`
// that then compacts and uploads the image to cloudflare using the
// userId as a key. Also, revalidates the profile image in success case.
export async function uploadUserImage(data: FormData) {
  const user = await currentUser();
  if (!user || !user?.accessToken) return null;

  try {
    const response = await fetch(`${env.INK_HOSTNAME}/users/profile`, {
      headers: {
        Authorization: `Bearer ${user.accessToken}`,
      },
      method: 'post',
      body: data,
    });

    console.debug(await response.text());

    if (response.ok) revalidateTag('profile-image');
  } catch (error) {
    console.error('error uploading user profile image', error);
  }
}

// Checks if the current user has an image, if not
// fetch the current user at `users/profile/:id` endpoint with a `GET` method
// and search for a profile image in CF.
export const getUserProfileImage = cache(async () => {
  const user = await currentUser();
  if (!user || !user.accessToken) return null;

  if (!user.image) {
    const response = await fetch(
      `${env.INK_HOSTNAME}/users/profile/${user.id}`,
      {
        method: 'get',
        next: { tags: ['profile-image'], revalidate: 3600 },
      },
    );

    return await response.json();
  }
  return user.image;
});

// Validates the user input and tries to log in the user.
export async function login(
  values: z.infer<typeof loginFormSchema>,
): Promise<{ error: string | null }> {
  const fields = loginFormSchema.safeParse(values);
  const t = await getTranslations('ServerErrors');

  if (!fields.success) return { error: t('inv_field') };
  const { email, password } = fields.data;
  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: DEFAULT_REDIRECT,
    });
    return { error: null };
  } catch (error) {
    console.error(error);
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: t('inv_credentials') };
        case 'AccessDenied':
          return { error: t('email_not_found') };
        default:
          return { error: t('default_error') };
      }
    }
    throw error;
  }
}

// Does a `POST` request to `users/reset-password/:token` endpoint, which starts
// a transaction trying to reset the user password.
export async function newPassword(
  values: z.infer<typeof newPasswordSchema>,
  token?: string | null,
) {
  const t = await getTranslations('ServerErrors');
  if (!token) return { error: t('no_token') };

  const fields = newPasswordSchema.safeParse(values);
  if (!fields.success) return { error: t('inv_password') };

  const { password } = fields.data;

  const response = await fetch(
    `${env.INK_HOSTNAME}/users/reset-password/${token}`,
    {
      method: 'post',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ password }),
    },
  );

  switch (response.status) {
    case 200:
      return { success: t('password_update') };
    case 403:
      return { error: t('token_exp') };
    case 404:
      return { error: t('inv_token') };
    case 422:
      return { error: t('inv_password') };
  }
}

// Makes a `POST` request to `users/new-password-token/:email`. Returns a new reset token
// or an old but valid one with `isNew` to differentiate. Also, sends the reset password e-mail to the user.
export async function generatePasswordResetToken(email: string): Promise<{
  token: PasswordResetToken;
  isNew: boolean;
}> {
  const response = await fetch(
    `${env.INK_HOSTNAME}/users/new-password-token/${email}`,
    {
      method: 'post',
    },
  );

  const token: PasswordResetToken = await response.json();

  if (response.status === 200) return { token, isNew: true };
  return { token, isNew: false };
}

export async function resetPassword(
  values: z.infer<typeof resetPasswordSchema>,
) {
  const fields = resetPasswordSchema.safeParse(values);
  const t = await getTranslations('ServerErrors');
  if (!fields.success) return { error: t('inv_email') };

  const { email } = fields.data;
  // TODO: try/catch the error instead of returning as a string

  const { token, isNew } = await generatePasswordResetToken(email);
  if (!isNew) {
    return {
      message: `${t('already_has_a_token')} ${token.expires}, ${t('check_out')}`,
    };
  }

  return { success: t('email_sent') };
}

// Makes a `GET` request to `users/preferences` looking for the current user preferences.
// Returns the preferences if found and a partial object of the current user.
export async function getUserWithPreferences() {
  const user = await currentUser();
  if (!user || !user.accessToken) return { user: null, preferences: null };

  const response = await fetch(`${env.INK_HOSTNAME}/users/preferences`, {
    method: 'get',
    headers: {
      Authorization: `Bearer ${user.accessToken}`,
    },
    next: { tags: ['user-preferences'] },
    cache: 'force-cache',
  });

  let preferences: UserPreferences | null = null;

  if (response.ok) {
    preferences = (await response.json()) as UserPreferences;
  }

  return { user: { email: user.email, name: user.name }, preferences };
}

// Makes a `PUT` request to `users/preferences`. If the user has already a preferences table
// it will update it. If not, it's going to create a new preferences table for the respective user.
export async function updateUserPreferences(
  values: z.infer<typeof userPreferencesSchema>,
) {
  const user = await currentUser();
  if (!user || !user.accessToken) return null;

  const fields = userPreferencesSchema.safeParse(values);
  if (!fields.success) return { error: 'Invalid fields' };

  await fetch(`${env.INK_HOSTNAME}/users/preferences`, {
    method: 'put',
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${user.accessToken}`,
    },
    body: JSON.stringify(fields.data),
  });

  revalidateTag('user-preferences');
}

// Fetch the API with a `GET` request to `dictionary/:word` seeking for word's definition.
export async function getDefinition(word: string) {
  const response = await fetch(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
    {
      method: 'GET',
      next: { tags: ['update-definition'] },
    },
  );
  try {
    const data = await response.json();
    const definition: Definition = data[0];
    return definition;
  } catch (error) {
    console.error(error);
  }
}
