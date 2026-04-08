import COS from 'cos-nodejs-sdk-v5';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cos = new COS({
  SecretId: process.env.TENCENT_SECRET_ID,
  SecretKey: process.env.TENCENT_SECRET_KEY
});

const bucket = process.env.TENCENT_BUCKET;
const region = process.env.TENCENT_REGION || 'ap-shanghai';
const cosDomain = `${bucket}.cos.${region}.myqcloud.com`;

async function uploadFile(filePath, key) {
  return new Promise((resolve, reject) => {
    cos.putObject({
      Bucket: bucket,
      Region: region,
      Key: key,
      StorageClass: 'STANDARD',
      Body: fs.createReadStream(filePath),
    }, (err, data) => {
      if (err) {
        console.error(`❌ 上传失败 ${key}:`, err.message);
        reject(err);
      } else {
        const url = `https://${cosDomain}/${key}`;
        console.log(`✅ ${key} → ${url}`);
        resolve(url);
      }
    });
  });
}

async function uploadFont() {
  console.log('🚀 开始上传字体文件...\n');

  const fontPath = path.join(__dirname, '../public/fonts/乐米小奶泡体.ttf');
  
  if (!fs.existsSync(fontPath)) {
    console.error('❌ 字体文件不存在:', fontPath);
    return;
  }

  console.log('📁 上传字体文件...');
  await uploadFile(fontPath, '乐米小奶泡体.ttf');

  console.log('\n✅ 字体上传完成！\n');
  console.log(`📋 字体 URL: https://${cosDomain}/乐米小奶泡体.ttf`);
}

uploadFont().catch(console.error);
