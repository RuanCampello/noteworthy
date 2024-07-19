'use server';

import { getSignedUrlForObject } from '@/lib/s3';

export async function getUploadUrl(key: string, contentType: string) {
  return await getSignedUrlForObject(key, contentType);
}
