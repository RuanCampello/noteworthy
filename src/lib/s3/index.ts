let s3Client: {
  getSignedUrlForObject: (key: string, type: string) => Promise<string>;
};

if (process.env.NODE_ENV === 'production') {
  s3Client = require('./s3.prod.ts');
} else {
  s3Client = require('./s3.dev.ts');
}

export const { getSignedUrlForObject } = s3Client;
