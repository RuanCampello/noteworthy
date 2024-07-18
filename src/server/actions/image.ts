'use server';

import { getSignedUrlForObject } from '@/lib/s3';

export async function getUploadUrl(key: string, contentType: string) {
  const signedUrl = await getSignedUrlForObject(key, contentType);
  return signedUrl;
}
