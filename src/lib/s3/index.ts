let s3Client: {
  getSignedUrlForObject: (key: string, type: string) => Promise<string>;
};

if (process.env.NODE_ENV === 'production') {
  s3Client = require('./s3Client.prod');
} else {
  s3Client = require('./s3Client.dev');
}

export const { getSignedUrlForObject } = s3Client;
