import { supabase } from './supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import imageCompression from 'browser-image-compression';

export async function uploadImage(file, folder = 'products') {
  if (!file) return null;

  const compressedImage = await imageCompression(file, {
    maxSizeMB: 1,
    maxWidthOrHeight: 800,
    useWebWorker: true,
  });

  const fileExt = file.name.split('.').pop();
  const fileName = `${uuidv4()}.${fileExt}`;
  const filePath = `${folder}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('product-images')
    .upload(filePath, compressedImage, { upsert: false });

  if (uploadError) throw new Error(uploadError.message);

  const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
  return data.publicUrl;
}
