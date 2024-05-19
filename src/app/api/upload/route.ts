import { uploadImage } from '@/actions/image';

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get('file') as File;

  if (!file) return new Response('File is required', { status: 400 });

  const searchParams = new URL(req.url).searchParams;
  const userId = searchParams.get('id');

  if (!userId) return new Response('Unauthorized', { status: 401 });

  const url = await uploadImage(file, userId);
  return new Response(url, { status: 200 });
}
