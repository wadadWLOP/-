import { createClient } from '@supabase/supabase-js';
import COS from 'cos-js-sdk-v5';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are not set. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file');
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);

const cos = new COS({
  SecretId: import.meta.env.VITE_TENCENT_SECRET_ID,
  SecretKey: import.meta.env.VITE_TENCENT_SECRET_KEY
});

const bucket = import.meta.env.VITE_TENCENT_BUCKET;
const region = import.meta.env.VITE_TENCENT_REGION || 'ap-shanghai';

export const uploadImage = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `diary-photos/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

    cos.putObject({
      Bucket: bucket,
      Region: region,
      Key: fileName,
      StorageClass: 'STANDARD',
      Body: file,
    }, (err, data) => {
      if (err) {
        console.error('Error uploading image:', err);
        reject(err);
      } else {
        const url = `https://${bucket}.cos.${region}.myqcloud.com/${fileName}`;
        resolve(url);
      }
    });
  });
};
