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

async function uploadWeatherImages() {
  console.log('🚀 开始上传天气图片...\n');

  const images = ['a.png', 'b.png', 'c.png'];
  const imageDir = path.join(__dirname, '../image');

  for (const image of images) {
    const imagePath = path.join(imageDir, image);
    
    if (!fs.existsSync(imagePath)) {
      console.error(`❌ 图片文件不存在：${imagePath}`);
      continue;
    }

    console.log(`📁 上传 ${image}...`);
    await uploadFile(imagePath, `weather/${image}`);
  }

  console.log('\n✅ 图片上传完成！\n');
  console.log('📋 图片 URLs:');
  images.forEach(image => {
    console.log(`   https://${cosDomain}/weather/${image}`);
  });
}

uploadWeatherImages().catch(console.error);
