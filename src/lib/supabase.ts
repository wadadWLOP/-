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

const bucket = import.meta.env.VITE_TENCENT_BUCKET || 'juiceqiuqiu-1420133198';
const region = import.meta.env.VITE_TENCENT_REGION || 'ap-shanghai';

console.log('COS 配置检查:', {
  hasSecretId: !!import.meta.env.VITE_TENCENT_SECRET_ID,
  hasSecretKey: !!import.meta.env.VITE_TENCENT_SECRET_KEY,
  bucket,
  region
});

export const uploadImage = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `diary-photos/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    
    console.log('开始上传到腾讯云 COS:', {
      bucket,
      region,
      fileName,
      fileSize: file.size,
      fileType: file.type
    });

    cos.putObject({
      Bucket: bucket,
      Region: region,
      Key: fileName,
      StorageClass: 'STANDARD',
      Body: file,
    }, (err, data) => {
      if (err) {
        console.error('上传失败:', err);
        reject(err);
      } else {
        const url = `https://${bucket}.cos.${region}.myqcloud.com/${fileName}`;
        console.log('上传成功:', url);
        resolve(url);
      }
    });
  });
};
