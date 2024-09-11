'use server';

import { currentUser } from '../queries/note';

export async function getUserProfileImage(): Promise<string | null> {
  const user = await currentUser();
  if (!user || !user.accessToken) return null;

  if (!user.image) {
    const response = await fetch(
      `http://localhost:6969/users/profile/${user.id}`,
      {
        method: 'get',
        cache: 'force-cache',
        next: { revalidate: 3600, tags: ['profile-image'] },
      },
    );
    const image_url = await response.text();
    return image_url;
  }

  return user.image;
}
