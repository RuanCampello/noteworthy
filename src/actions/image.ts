import { storage } from '@/firebase';
import { compressImage } from '@/utils/compress-image';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

export async function uploadImage(image: File, userId: string) {
  const profileImageRef = ref(storage, userId);

  const metadata = { contentType: 'image/jpeg' };
  const compressedImage = await compressImage(image);

  await uploadBytesResumable(profileImageRef, compressedImage, metadata);
  const downloadUrl = await getDownloadURL(profileImageRef);
  return downloadUrl;
}
