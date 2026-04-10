import COS from 'cos-nodejs-sdk-v5';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cos = new COS({
  SecretId: process.env.VITE_TENCENT_SECRET_ID,
  SecretKey: process.env.VITE_TENCENT_SECRET_KEY
});

const bucket = process.env.VITE_TENCENT_BUCKET || 'juiceqiuqiu-1420133198';
const region = process.env.VITE_TENCENT_REGION || 'ap-shanghai';
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

async function uploadGuozhiIcon() {
  console.log('🚀 开始上传果汁图标...\n');

  const imageDir = path.join(__dirname, '../image');
  const imagePath = path.join(imageDir, 'd.jpg');
  
  if (!fs.existsSync(imagePath)) {
    console.error(`❌ 图片文件不存在：${imagePath}`);
    return;
  }

  console.log(`📁 上传 d.jpg...`);
  const url = await uploadFile(imagePath, 'icons/guozhi-icon.jpg');
  
  console.log('\n✅ 果汁图标上传完成！\n');
  console.log('📋 图标 URL:');
  console.log(`   ${url}`);
}

uploadGuozhiIcon().catch(console.error);
