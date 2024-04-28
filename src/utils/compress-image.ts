import Compressor from 'compressorjs';

/**
 * Compress image
 * @param image - A File object representing the image to compress
 * @returns A Promise resolving to a Blob containing the compressed image data
 */

export async function compressImage(image: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    if (!(image instanceof File)) {
      reject(new Error('The input must be a File object.'));
      return;
    }

    new Compressor(image, {
      quality: 0.8, // Set compression quality to 80%
      maxWidth: 72,
      maxHeight: 72,
      mimeType: 'image/jpeg', // Output image format
      success: (result: Blob) => {
        resolve(result);
      },
      error: (error: any) => {
        console.error('Image compression error:', error);
        reject(error);
      },
    });
  });
}
