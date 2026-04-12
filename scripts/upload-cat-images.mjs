import COS from 'cos-nodejs-sdk-v5';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 读取 .env 文件
const envPath = path.join(__dirname, '../.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    envVars[key.trim()] = value.trim();
  }
});

const cos = new COS({
  SecretId: envVars.VITE_TENCENT_SECRET_ID,
  SecretKey: envVars.VITE_TENCENT_SECRET_KEY
});

const bucket = 'juiceqiuqiu-1420133198';
const region = 'ap-shanghai';

// 猫猫挂件动作列表
const catActions = [
  'stand',
  'walkleft',
  'walkright',
  'sleep',
  'fish',
  'kiss',
  'drag',
  'falling',
];

// 动态动作的帧数（1-12）
const dynamicFrames = 12;

async function uploadCatImages() {
  const localCatDir = path.join(__dirname, '../public/max');

  console.log('🐱 开始上传猫猫挂件图片...\n');

  let successCount = 0;
  let failCount = 0;

  // 检查本地目录是否存在
  if (!fs.existsSync(localCatDir)) {
    console.error(`❌ 本地猫猫图片目录不存在：${localCatDir}`);
    console.log('请确保猫猫图片放在 public/max/ 目录下');
    return;
  }

  // 上传每个动作的图片
  for (const action of catActions) {
    console.log(`📷 处理动作：${action}`);

    // 静态动作（sleep, fish, kiss）只需要一张图
    const isStatic = ['sleep', 'fish', 'kiss'].includes(action);
    const frames = isStatic ? [1] : Array.from({ length: dynamicFrames }, (_, i) => i + 1);

    for (const frame of frames) {
      // 尝试不同的文件名格式
      const possibleFiles = [
        `${action}${frame}.png`,
        `${action}_${frame}.png`,
        `${action}_${frame === 1 ? '' : frame}.png`,
        `${action}${frame === 1 ? '' : frame}.png`,
      ];

      let uploaded = false;
      for (const filename of possibleFiles) {
        const localPath = path.join(localCatDir, filename);
        
        if (fs.existsSync(localPath)) {
          const cosKey = `max/${action}${frame}.png`;
          
          try {
            const buffer = fs.readFileSync(localPath);
            
            await new Promise((resolve, reject) => {
              cos.putObject({
                Bucket: bucket,
                Region: region,
                Key: cosKey,
                StorageClass: 'STANDARD',
                Body: buffer,
              }, (err, data) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(data);
                }
              });
            });
            
            console.log(`  ✅ ${filename} -> ${cosKey}`);
            successCount++;
            uploaded = true;
            break;
          } catch (error) {
            console.error(`  ❌ 上传失败：${filename}`, error.message);
            failCount++;
          }
        }
      }

      if (!uploaded) {
        console.log(`  ⚠️  未找到图片文件：${action}${frame}.png`);
      }
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(` 上传完成！`);
  console.log(`✅ 成功：${successCount} 张`);
  console.log(`❌ 失败：${failCount} 张`);
  console.log('='.repeat(50));
}

// 运行上传
uploadCatImages().catch(console.error);
