import { env } from '@/env';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.CLOUDFLARE_ACCESS_KEY,
    secretAccessKey: env.CLOUDFLARE_SECRET_KEY,
  },
});

export async function getSignedUrlForObject(key: string, type: string) {
  const response = await getSignedUrl(
    s3Client,
    new PutObjectCommand({
      Bucket: env.CLOUDFLARE_BUCKET_NAME,
      Key: key,
      ContentType: type,
    }),
    { expiresIn: 3600 },
  );
  console.log(response);
  return response;
}
