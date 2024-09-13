'use server';

import { currentUser } from '@/queries/note';
import { noteDialogSchema } from '@/schemas';
import { getPathnameParams } from '@/utils/format-notes';
import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

// createNote calls the notes endpoint with a POST method, validate the form params
// and revalidate the sidebar with the new created note.
export async function createNote(values: z.infer<typeof noteDialogSchema>) {
  const fields = noteDialogSchema.safeParse(values);

  if (!fields.success) return;
  const { colour, name } = fields.data;

  const user = await currentUser();
  if (!user || !user.accessToken) return;

  const response = await fetch('http://localhost:6969/notes', {
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

// editNote validates the data sent
// makes a PATCH method call to the selected note endpoint
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
    await fetch(`http://localhost:6969/notes/${id}`, {
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

// deleteNote calls a DELETE method on the note endpoint,
// revalidates the sidebar and redirect the user to the main page.
export async function deleteNote(id: string) {
  const user = await currentUser();
  if (!user || !user.accessToken) return;

  await fetch(`http://localhost:6969/notes/${id}`, {
    method: 'delete',
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${user.accessToken}`,
    },
  });
  revalidateTag('sidebar-notes');
  redirect('/');
}

// updateNoteContent calls a PATCH on the note/content endpoint
// revalidates both the sidebar and the current open note.
export async function updateNoteContent(id: string, content: string) {
  try {
    const user = await currentUser();
    if (!user || !user.accessToken) return;

    await fetch(`http://localhost:6969/notes/${id}/content`, {
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

// Checks if the current user has an image, if not
// fetch the current user /profile endpoint with a GET method
// and search for a profile image in CF.
export async function getUserProfileImage(): Promise<string | null> {
  const user = await currentUser();
  if (!user || !user.accessToken) return null;

  if (!user.image) {
    const response = await fetch(
      `http://localhost:6969/users/profile/${user.id}`,
      {
        method: 'get',
        cache: 'force-cache',
        next: { tags: ['profile-image'] },
      },
    );
    return await response.text();
  }
  return user.image;
}
