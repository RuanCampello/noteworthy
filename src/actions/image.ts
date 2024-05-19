import { storage } from '@/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

export async function uploadImage(image: File, userId: string) {
  const profileImageRef = ref(storage, userId);

  await uploadBytesResumable(profileImageRef, image);
  const downloadUrl = await getDownloadURL(profileImageRef);
  return downloadUrl;
}
